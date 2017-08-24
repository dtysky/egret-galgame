/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/26
 * Description:
 */
namespace GAL {
  export class Transition {
    private transition: ITransition;
    private isEnd: boolean = true;
    private preTarget: egret.DisplayObject;
    private nextTarget: egret.DisplayObject;
    private parent: egret.DisplayObjectContainer;

    public init(transition: ITransition) {
      this.transition = transition;
    }

    public start = (
      preTarget: egret.DisplayObject,
      nextTarget: egret.DisplayObject,
      parent: egret.DisplayObjectContainer,
      index?: number
    ) => {
      this.isEnd = false;
      this.parent = parent;
      this.preTarget = preTarget;
      this.nextTarget = nextTarget;
      this.nextTarget.alpha = 0;
      if (index !== undefined) {
        this.parent.addChildAt(this.nextTarget, index);
      } else {
        this.parent.addChild(this.nextTarget);
      }

      if (this.transition.type === 'fade') {
        const duration = this.transition.duration;
        egret.Tween.get(this.preTarget).to({alpha: 0}, duration * .8);
        egret.Tween.get(this.nextTarget)
          .wait(duration * .3)
          .to({alpha: 1}, duration * .7)
          .call(() => this.end());
      }

      if (this.transition.type === 'none') {
        this.end();
      }
    }

    public check = () => {
      return this.isEnd;
    }

    public end = () => {
      if (!this.isEnd) {
        egret.Tween.pauseTweens(this.preTarget);
        egret.Tween.pauseTweens(this.nextTarget);
        this.parent.removeChild(this.preTarget);
        this.nextTarget.alpha = 1;
        this.isEnd = true;
        this.preTarget = null;
        this.nextTarget = null;
      }
    }
  }
}
