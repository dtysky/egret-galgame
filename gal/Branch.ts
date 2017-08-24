/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/29
 * Description:
 */
namespace GAL {
  export class Branch extends egret.DisplayObjectContainer {
    private scene: Scene;
    private isEnd = false;
    private animation: IAnimation = {
      duration: 400,
      func: t => t
    };
    private direction: {
      direction: TDirection,
      offset: number
    } = {
      direction: 'right',
      offset: 128
    };
    private customTransform = false;
    private animator: Animator = new Animator();
    
    public addToScene(scene: Scene) {
      this.scene = scene;
      this.scene.layers.branch.addChild(this);
    }

    public open(
      branches: IBranch[],
      autoClose: boolean = true,
      eachTransform: ITextATTRS = {}
    ) {      
      this.isEnd = false;
      this.scene.hideDialog();

      const mask = new egret.Bitmap();
      mask.texture = RES.getRes(`${BRANCH_ATTRS.mask}`);
      this.addChild(mask);

      const main = new egret.DisplayObjectContainer();
      this.addChild(main);

      let width = 0;
      let height = 0;
      let x = 0;
      let y = 0;

      branches.forEach(({content, callback, bg, transform}, index) => {
        const container = new egret.DisplayObjectContainer();
        const bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes(`${bg || BRANCH_ATTRS.bg}`);
        const text = new egret.TextField();
        container.touchEnabled = true;

        if (this.customTransform) {
          text.text = content || '';
          text.size = transform.size || BRANCH_ATTRS.fontSize;

          container.width = transform.width;
          bitmap.width = transform.width;
          text.width = transform.width;

          container.height = transform.height;
          bitmap.height = transform.height;

          text.textAlign = transform.textAlign || egret.HorizontalAlign.CENTER;
          text.lineSpacing = transform.lineSpacing || BRANCH_ATTRS.lineSpace;
          text.textColor = transform.color || BRANCH_ATTRS.color;
          text.y = (transform.height - text.height) / 2;

          let x = transform.x || BRANCH_ATTRS.branchAligh;

          if (typeof x === 'number') {
            container.x = x;
          } else if (x === egret.HorizontalAlign.CENTER) {
            container.x = (BRANCH_ATTRS.branchWidth - BRANCH_ATTRS.textWidth) / 2;
          } else if (x === egret.HorizontalAlign.LEFT) {
            container.x = 0;
          } else if (x === egret.HorizontalAlign.RIGHT) {
            container.x = this.stage.stageWidth - container.width;
          }
          container.y = transform.y;
          container.rotation = transform.rotation || 0;
        } else {
          text.text = content;
          text.size = eachTransform.size || BRANCH_ATTRS.fontSize;

          container.width = eachTransform.width || BRANCH_ATTRS.branchWidth;
          bitmap.width = eachTransform.width || BRANCH_ATTRS.branchWidth;
          text.width = eachTransform.width || BRANCH_ATTRS.textWidth;

          bitmap.height = container.width / bitmap.texture.textureWidth * bitmap.texture.textureHeight;

          text.textAlign = eachTransform.textAlign || BRANCH_ATTRS.textAlign;;
          text.lineSpacing = eachTransform.lineSpacing || BRANCH_ATTRS.lineSpace;
          text.x = BRANCH_ATTRS.textX || 0;
          text.y = BRANCH_ATTRS.textY || (bitmap.height - text.height) / 2;

          let x = eachTransform.x || BRANCH_ATTRS.branchAligh;

          if (typeof x === 'number') {
            container.x = x;
          } else if (x === egret.HorizontalAlign.CENTER) {
            container.x = (this.stage.stageWidth - BRANCH_ATTRS.branchWidth) / 2;
          } else if (x === egret.HorizontalAlign.LEFT) {
            container.x = 0;
          } else if (x === egret.HorizontalAlign.RIGHT) {
            container.x = this.stage.stageWidth - container.width;
          }

          container.y = y;
          container.height = (eachTransform.height || bitmap.height) + BRANCH_ATTRS.branchPadding * 2;
          y += container.height + BRANCH_ATTRS.branchSpace;
        }

        container.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          callback(index, content);
          if (autoClose) {
            this.close();
          }
        }, this);
        container.addChild(bitmap);
        container.addChild(text);
        main.addChild(container);
      });
      
      const containerWidth = this.stage.stageWidth;
      const containerHeight = this.stage.stageHeight;

      if (this.customTransform) {
        main.width = containerWidth;
        main.height = containerHeight;
      } else {
        height = y;
        y = (containerHeight - height) / 2;
        main.y = y;
      }

      this.customTransform = false;
      main.alpha = 0;
      const {offset, direction} = this.direction;
      const originX = main.x;
      const originY = main.y;
      
      if (direction === 'left') {
        main.x -= offset;
      } else if (direction === 'right') {
        main.x += offset;
      } else if (direction === 'top') {
        main.y -= offset;
      } else if (direction === 'bottom') {
        main.y += offset;
      }

      this.animator.init(this.animation, main);
      this.animator.start({alpha: 1, x: originX, y: originY});
      return {check: () => this.isEnd, exec: () => {}};
    }

    public animate(
      duration: number = 500,
      func: (t: number) => number = t => t
    ) {
      this.animation = {duration, func};
      return this;
    }

    public custom() {
      this.customTransform = true;
      return this;
    }

    public from(
      direction: TDirection,
      offset: number = 24
    ) {
      this.direction.direction = direction;
      if (offset) {
        this.direction.offset = offset;
      }
      return this;
    }

    public close() {
      this.removeChildren();
      this.isEnd = true;
    }
  }
}
