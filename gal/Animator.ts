/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/25
 * Description:
 */
namespace GAL {
  export class Animator {
    private nextTransform: ITransform;
    private animation: IAnimation;
    private isEnd: boolean = true;
    private tw: egret.Tween[] = [];
    private states: boolean[] = [];
    private target: egret.DisplayObject[];
    private callback: (transform: ITransform) => void;

    public init = (
      animation: IAnimation,
      target: egret.DisplayObject | egret.DisplayObject[],
      callback?: (transform: ITransform) => void
    ) => {
      this.tw = [];
      this.states = [];
      this.animation = animation;
      if (target instanceof Array) {
        this.target = target;
      } else {
        this.target = [target];
      }
      this.target.forEach(t => {
        this.tw.push(egret.Tween.get(t));
        this.states.push(false);
      });
      this.callback = callback;
    }

    public check = () => {
      return this.isEnd;
    }

    public start = (nextTransform: ITransform) => {
      this.isEnd = false;
      this.nextTransform = nextTransform;
      this.tw.forEach((t, index) => {
        t.to(this.nextTransform, this.animation.duration, this.animation.func)
          .call(() => {
            this.states[index] = true;
            const end = this.states.reduce((a, b) => a && b);
            if (end) {
              this.isEnd = true;
              this.callback && this.callback(this.nextTransform);
            }
          });
      });
    }

    public end = () => {
      this.target.forEach((target, index) => {
        if (this.tw[index]) {
          egret.Tween.pauseTweens(target);
        }
        Object.keys(this.nextTransform).forEach(key => {
          target[key] = this.nextTransform[key];
        });
      });
      this.isEnd = true;
      this.callback && this.callback(this.nextTransform);
    }
  }
}
