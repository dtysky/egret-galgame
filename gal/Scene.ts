/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/19
 * Description:
 */
namespace GAL {
  export class Scene extends egret.DisplayObjectContainer {
    private mode: TMode = 'ADV';
    private bgName: string = 'bg_default';
    private position = {x: 0, y: 0};
    private mainPosition = {x: 0, y: 0};
    private offset = {x: 0, y: 0};
    private bgScale = 1;
    private layer: egret.DisplayObjectContainer;
    public main: egret.DisplayObjectContainer;
    private transitionMask: egret.Bitmap;
    public bg: egret.Bitmap;
    public dialog: Dialog;
    public layers: ILayers;
    private animation: IAnimation;
    private animator: Animator = new Animator();
    private createDone = false;
    private direction: TDirection = 'left';
    private transition: ITransition = {
      duration: 1200,
      type: 'normal'
    };
    private moveWithChar: boolean = false;
    private callback: () => void = null;
    private interpreter: Interpreter;

    constructor(interpreter: Interpreter) {
      super();
      this.interpreter = interpreter;
      this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage() {
      this.width = this.stage.stageWidth;
      this.height = this.stage.stageHeight;
      this.layers = {
        bg: new egret.DisplayObjectContainer(),
        text: new egret.DisplayObjectContainer(),
        dialog: new egret.DisplayObjectContainer(),
        chars: new egret.DisplayObjectContainer(),
        branch: new egret.DisplayObjectContainer()
      };
      this.transitionMask = new egret.Bitmap();
      this.transitionMask.visible = false;
      this.transitionMask.texture = RES.getRes('transition');
      this.layer = new egret.DisplayObjectContainer();
      this.main = new egret.DisplayObjectContainer();
      this.bg = new egret.Bitmap();
      this.layer.name = 'layer';
      this.transitionMask.name = 'transition';
      this.main.name = 'main';
      this.layers.bg.name = 'bg';
      this.layers.chars.name = 'chars';
      this.layers.text.name = 'text';
      this.layers.dialog.name = 'dialog';
      this.layers.branch.name = 'branch';
      this.layers.bg.addChild(this.bg);
      this.main.addChild(this.layers.bg);
      this.main.addChild(this.layers.chars);
      this.main.addChild(this.layers.text);
      this.layer.addChild(this.main);
      this.layer.addChild(this.layers.branch);
      this.layer.addChild(this.layers.dialog);
      this.addChild(this.transitionMask);
      this.addChild(this.layer);
    }

    public show() {
      const callback = this.callback || (() => {});

      this.dialog.hide();
      let x = this.position.x;
      let y = this.position.y;
      let target = this.layers.bg;
      let next: any = {x, y, scaleX: this.bgScale, scaleY: this.bgScale};

      if (this.moveWithChar) {
        x = this.mainPosition.x;
        y = this.mainPosition.y;
        target = this.main;
        next = {x, y};
      }

      if (this.animation) {
        this.animator.init(this.animation, target, () => {
          this.animation = null;
          callback();
        });
        this.animator.start(next);
        return {
          check: this.animator.check,
          exec: () => {
            this.animator.end();
            this.animation = null;
            callback();
          }
        };
      }
      
      if (this.moveWithChar) {
        this.main.x = x;
        this.main.y = y;
      } else {
        this.layers.bg.x = x;
        this.layers.bg.y = y;
      }

      callback();
    }

    public then(callback: () => void = null) {
      this.callback = callback;
      return this;
    }

    public toMode(mode: GAL.TMode) {
      if (this.layers.dialog.contains(this.dialog)) {
        this.layers.dialog.removeChild(this.dialog);
      }
      this.mode = mode;
      if (this.mode === 'ADV') {
        this.dialog = new ADVDialog();
      } else if (this.mode === 'NVL') {
        this.dialog = new NVLDialog();
      }
      this.layers.dialog.addChild(this.dialog);
      return this;
    }

    public create(bg: string) {
      const callback = this.callback || (() => {});
      this.createDone = false;
      
      if (this.transition.type === 'normal') {
        if (this.direction === 'left') {
          this.transitionMask.x = this.stage.width;
        } else {
          this.transitionMask.x = -this.transitionMask.width;
        }

        this.transitionMask.texture = RES.getRes('transition');
        this.transitionMask.visible = true;
        this.setChildIndex(this.transitionMask, 5);
        this.animate(this.transition.duration, egret.Ease.quadInOut);

        this.animator.init(this.animation, this.transitionMask, () => {
          this.clear();
          this.updateBg(bg);

          this.animator.init(this.animation, this.transitionMask, () => {
            this.setChildIndex(this.transitionMask, 0);
            this.createDone = true;
            this.animation = null;
            this.toMode(this.mode);
            callback();
          });
          let nextX = 0;
          if (this.direction === 'left') {
            nextX = -this.transitionMask.width;
          } else {
            nextX = this.stage.width;
          }
          this.animator.start({x: nextX});
        });
        this.animator.start({x: -100});
      } else if (this.transition.type === 'fade') {
        this.transitionMask.texture = RES.getRes('transition-w');
        this.transitionMask.visible = true;
        this.transitionMask.x = 0;
        this.transitionMask.y = 0;
        this.animate(this.transition.duration, egret.Ease.quadInOut);

        this.animator.init(this.animation, this.layer, () => {
          this.clear();
          this.updateBg(bg);

          this.animator.init(this.animation, this.layer, () => {
            this.createDone = true;
            this.animation = null;
            this.toMode(this.mode);
            callback();
          });
          
          this.animator.start({alpha: 1});
        });
        this.animator.start({alpha: 0});
      } else if (this.transition.type === 'dissolve') {
        this.transitionMask.visible = false;
        this.animate(this.transition.duration, egret.Ease.quadInOut);

        this.animator.init(this.animation, this.layer, () => {
          this.clear();
          this.updateBg(bg);

          this.animator.init(this.animation, this.layer, () => {
            this.createDone = true;
            this.animation = null;
            this.toMode(this.mode);
            callback();
          });
          
          this.animator.start({alpha: 1});
        });
        this.animator.start({alpha: 0});
      } else if (this.transition.type === 'none') {
        this.clear();
        this.updateBg(bg);
        this.createDone = true;
        this.animation = null;
        this.toMode(this.mode);
        callback();
      }

      return {check: () => this.createDone, exec: () => {}};
    }

    private updateBg = (bg: string) => {
      const {x, y} = this.position;

      this.bgName = `bg_${bg}`;
      this.bg.texture = RES.getRes(this.bgName);
      this.bg.width = this.layers.bg.width = this.bg.texture.textureWidth;
      this.bg.height = this.layers.bg.height = this.bg.texture.textureHeight;
      this.offset = {
        x: (this.stage.stageWidth - this.bg.width) / 2,
        y: (this.stage.stageHeight - this.bg.height) / 2
      };
      this.layers.bg.anchorOffsetX = -this.offset.x;
      this.layers.bg.anchorOffsetY = -this.offset.y;
      this.layers.bg.x = x;
      this.layers.bg.y = y;
      this.layers.bg.scaleX = this.bgScale;
      this.layers.bg.scaleY = this.bgScale;
      this.main.x = 0;
      this.main.y = 0;
    }

    public scale(factor: number) {
      this.bgScale = factor;
      return this;
    }

    public at(x: number, y?: number, moveWithChar?: boolean) {
      if (moveWithChar !== undefined) {
        this.moveWithChar = moveWithChar;
      } else {
        this.moveWithChar = false;
      }
      if (this.moveWithChar) {
        this.mainPosition.x = -x;
        if (typeof y === 'number') {
          this.mainPosition.y = -y;
        }
      } else {
        this.position.x = -x;
        if (typeof y === 'number') {
          this.position.y = -y;
        }
      }
      return this;
    }

    public animate(
      duration: number = 500,
      func: (t: number) => number = t => t
    ) {
      this.animation = {duration, func};
      return this;
    }

    public from(direction: TDirection) {
      this.direction = direction;
      return this;
    }

    public with(
      duration: number = 1200,
      type: TTransitionType = 'normal'
    ) {
      this.transition = {duration, type};
      return this;
    }

    public hideDialog() {
      if (this.dialog) {
        this.dialog.hide();
      }
    }

    public clear() {
      this.layers.chars.removeChildren();
      this.hideDialog();
      let num = this.layers.branch.numChildren;
      for (let i = 0; i < num; i += 1) {
        (<Text>this.layers.text.getChildAt(i)).clear();
      }
      num = this.layers.branch.numChildren;
      for (let i = 0; i < num; i += 1) {
        (<Branch>this.layers.branch.getChildAt(i)).close();
      }
      return this;
    }

    private handleTouch = () => {
      // console.log('touchstart');
      this.interpreter.next();
    }

    public bindTouchEvent() {
      this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handleTouch ,this);
    }

    public unbindTouchEvent() {
      this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handleTouch, this);
    }
  }
}
