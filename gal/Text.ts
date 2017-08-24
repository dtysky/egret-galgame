/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 3 Aug 2017
 * Description:
 */
namespace GAL {
  export class Text extends egret.DisplayObjectContainer {
    private texts: IText[];
    private targets: egret.TextField[];
    private direction: {
      direction: TDirection,
      duration: number,
      offset: number,
      scaleOffset?: number
    } = {
      direction: 'bottom',
      duration: 600,
      offset: 24,
      scaleOffset: 0
    };
    private animator: Animator = new Animator();
    private scene: Scene;
    private callback: () => void = null;

    public addToScene(scene: Scene) {
      this.scene = scene;
      this.texts = [];
      this.targets = [];
      this.scene.layers.text.addChild(this);
    }

    public from(
      direction: TDirection,
      duration: number = 600,
      offset: number = 24,
      scaleOffset: number = 0
    ) {
      this.direction.direction = direction;
      this.direction.duration = duration;
      this.direction.offset = offset;
      this.direction.scaleOffset = scaleOffset;
      return this;
    }

    public update(texts: IText[]) {
      this.texts = texts;
      return this;
    }

    public then(callback: () => void = null) {
      this.callback = callback;
      return this;
    }

    private draw() {
      const {stageWidth, stageHeight} = this.scene.stage;

      this.texts.forEach(({text: t, ...transform}) => {
        const container = new egret.DisplayObjectContainer();
        const text = new egret.TextField();

        text.text = t;
        text.size = transform.size || 16;
        text.width = transform.width;
        text.textAlign = transform.textAlign || 'center';
        text.lineSpacing = transform.lineSpacing || 8;
        text.textColor = transform.color || 0xffffff;
        if (typeof transform.strokeColor === 'number') {
          text.stroke = 1;
          text.strokeColor = transform.strokeColor;
        }
        if (typeof transform.glowColor === 'number') {
          const color = transform.glowColor;
          const alpha = 0.8;
          const blurX = 2;
          const blurY = 2;
          const strength = 2;
          const quality = egret.BitmapFilterQuality.HIGH;
          const inner = false;
          const knockout = false;
          const glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
          text.filters = [glowFilter];
        }
        text.anchorOffsetX = text.width / 2;
        text.anchorOffsetY = text.height / 2;
        if (typeof transform.x === 'number') {
          container.x = transform.x;
          container.x += text.anchorOffsetX;
        } else if (transform.x === egret.HorizontalAlign.CENTER) {
          container.x = (stageWidth - text.width) / 2;
        } else if (transform.x === undefined) {
          container.x = stageWidth / 2;
        }
        if (transform.y < 0) {
          container.y = stageHeight - text.height + transform.y;
        } else {
          container.y = transform.y;
        }
        container.y += text.anchorOffsetY;
        text.rotation = transform.rotation || 0;
        text.x = 0;
        text.y = 0;
        text.alpha = 0;
        this.targets.push(text);
        container.addChild(text);
        this.addChild(container);
      });
    }

    public show() {
      const callback = this.callback || (() => {});
      const {duration, offset, direction, scaleOffset} = this.direction;
      this.removeChildren();
      this.targets = [];
      
      this.draw();
      this.targets.forEach(target => {
        if (direction === 'left') {
          target.x = -offset;
        } else if (direction === 'right') {
          target.x = offset;
        } else if (direction === 'top') {
          target.y = -offset;
        } else if (direction === 'bottom') {
          target.y = offset;
        }
        if (scaleOffset) {
          target.scaleX = 1 - scaleOffset;
          target.scaleY = target.scaleX;
        }
      });

      this.animator.init({duration, func: t => t}, this.targets, () => {
        callback();
      });
      this.animator.start({x: 0, y: 0, alpha: 1, scaleX: 1, scaleY: 1});
      return {check: this.animator.check, exec: this.animator.end};
    }

    public hide() {
      const callback = this.callback || (() => {});
      const {duration, offset, direction, scaleOffset} = this.direction;
      let x = 0;
      let y = 0;
      let scale = 1;

      if (direction === 'left') {
        x = offset;
      } else if (direction === 'right') {
        x = -offset;
      } else if (direction === 'top') {
        y = offset;
      } else if (direction === 'bottom') {
        y = -offset;
      }
      if (scaleOffset) {
        scale = 1 + scaleOffset;
      }

      this.animator.init({duration, func: t => t}, this.targets, () => {
        this.removeChildren();
        this.targets = [];
        callback();
      });
      this.animator.start({x, y, alpha: 0, scaleX: scale, scaleY: scale});
      return {check: this.animator.check, exec: this.animator.end};
    }

    public clear() {
      this.removeChildren();
    }
  }
}
