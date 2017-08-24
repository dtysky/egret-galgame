/// <reference path="types.ts" />
/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/19
 * Description:
 */

namespace GAL {
  export class Character extends egret.DisplayObjectContainer {
    public name: string;
    private charName: string;
    private resKey: string;
    private posImg: egret.Bitmap;
    private faceImg: egret.Bitmap;
    private prePos: egret.Bitmap;
    private preFace: egret.Bitmap;
    private posName: string;
    private faceName: string;
    private showSize: TCharSize = 'middle';
    private position = {x: 0, y: 0};
    private nextAlpha = 1;
    private direction: {
      direction: TDirection,
      duration: number
    } = {
      direction: 'right',
      duration: 600
    };
    private modified = {
      pos: false,
      face: false
    };
    private scene: Scene;
    private active: boolean = false;
    private animation: IAnimation;
    private animator: Animator = new Animator();
    private transition: ITransition = {
      duration: 500,
      type: 'fade'
    };
    private faceTransActor: Transition = new Transition();
    private posTransActor: Transition = new Transition();
    private multiPos: boolean;
    private multiFace: boolean;
    private sayWithShow: boolean = false;

    constructor(
      resKey: string,
      charName: string,
      bgKey: string,
      nameColor: number = 0x000000,
      wordsColor: number = 0x000000,
      cps: number = 30,
      multiPos: boolean = true,
      multiFace: boolean = true
    ) {
      super();
      this.name = charName;
      this.resKey = resKey;
      this.charName = charName;
      CHAR_ATTRS[this.resKey] = {
        name: charName,
        nameColor,
        wordsColor,
        bgPath: `dialog.${bgKey}-s`,
        bgThinkPath: `dialog.${bgKey}-t`,
        cps
      };
      this.multiPos = multiPos;
      this.multiFace = multiFace;
      this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.reset, this);
    }

    public addToScene(scene: Scene) {
      this.scene = scene;
      this.posImg = new egret.Bitmap();
      this.faceImg = new egret.Bitmap();
      this.prePos = new egret.Bitmap();
      this.preFace = new egret.Bitmap();
      this.addChild(this.posImg);
      this.addChild(this.faceImg);
      this.faceTransActor.init(this.transition);
      this.posTransActor.init(this.transition);
      this.active = false;
    }

    public rename(name?: string) {
      if (name !== undefined) {
        CHAR_ATTRS[this.resKey].name = name;
      } else {
        CHAR_ATTRS[this.resKey].name = this.charName;
      }
      return this;
    }

    public say(words: string) {
      if (!this.sayWithShow) {
        if (this.active) {
          this.scene.layers.chars.setChildIndex(this, 10);
        }
        return this.scene.dialog.say(this.resKey, words);
      } else {
        const res1 = this.show();
        const res2 = this.scene.dialog.say(this.resKey, words);
        return {
          check: () => (res1.check() && res2.check()),
          exec: () => {
            if (!res1.check()) {
              res1.exec();
            }
            if (!res2.check()) {
              res2.exec();
            }
          }
        }
      }
    }

    public think(words: string) {
      if (!this.sayWithShow) {
        if (this.active) {
          this.scene.layers.chars.setChildIndex(this, 10);
        }
        return this.scene.dialog.think(this.resKey, words);
      } else {
        const res1 = this.show();
        const res2 = this.scene.dialog.think(this.resKey, words);
        return {
          check: () => (res1.check() && res2.check()),
          exec: () => {
            if (!res1.check()) {
              res1.exec();
            }
            if (!res2.check()) {
              res2.exec();
            }
          }
        }
      }
    }

    public withShow(ok: boolean = true) {
      this.sayWithShow = ok;
      return this;
    }

    public reset = () => {
      this.active = false;
      this.animation = null;
    }

    private draw = () => {
      this.scene.layers.chars.setChildIndex(this, 10);

      if (this.multiPos && this.modified.pos) {
        this.modified.pos = false;
        this.modified.face = true;
        if (this.active && this.animator.check()) {
          this.prePos = this.posImg;
          this.posImg = new egret.Bitmap();
          this.posImg.texture = RES.getRes(`${this.resKey}-${this.posName}.body`);
          this.posTransActor.start(this.prePos, this.posImg, this, 1);
        } else {
          this.posImg.texture = RES.getRes(`${this.resKey}-${this.posName}.body`);
        }
      }

      if (this.multiFace && this.modified.face) {
        this.modified.face = false;
        if (this.active && this.animator.check()) {
          this.preFace = this.faceImg;
          this.faceImg = new egret.Bitmap();
          this.faceImg.texture = RES.getRes(`${this.resKey}-${this.posName}.${this.faceName}`);
          this.faceTransActor.start(this.preFace, this.faceImg, this, 3);
        } else {
          this.faceImg.texture = RES.getRes(`${this.resKey}-${this.posName}.${this.faceName}`);
        }
      }

      if (!this.multiPos && !this.multiFace) {
        this.posImg.texture = RES.getRes(`${this.resKey}`);
      }

      const scale = CHAR_SIZE_LUT.scale[this.showSize];
      this.anchorOffsetX = this.posImg.width * .5;
      const x = this.stage.stageWidth * this.position.x / GAL.MAX_GRID;
      const y = this.stage.stageHeight * this.position.y / GAL.MAX_GRID
        + CHAR_SIZE_LUT.yOffset[this.showSize];
      if (this.animation) {
        this.animator.init(this.animation, this);
        this.animator.start({scaleX: scale, scaleY: scale, x, y, alpha: this.nextAlpha});
        this.animation = null;
      } else {
        this.scaleX = scale;
        this.scaleY = scale;
        this.x = x;
        this.y = y;
        this.alpha = this.nextAlpha;
      }
      this.active = true;
      return {check: this.checkAnimation, exec: this.endAnimation};
    }

    public show() {
      if (!this.active) {
        this.scene.layers.chars.addChild(this);

        const originX = this.position.x;
        const originY = this.position.y;

        if (this.direction.direction === 'left') {
          this.position.x -= CHAR_SIZE_LUT.initFromOffset[this.showSize];
        } else if (this.direction.direction === 'right') {
          this.position.x += CHAR_SIZE_LUT.initFromOffset[this.showSize];
        } else if (this.direction.direction === 'top') {
          this.position.y -= CHAR_SIZE_LUT.initFromOffset[this.showSize];
        } else if (this.direction.direction === 'bottom') {
          this.position.y += CHAR_SIZE_LUT.initFromOffset[this.showSize];
        }

        this.opacity(0).draw();

        if (this.direction.direction === 'left' || this.direction.direction === 'right') {
          this.position.x = originX;
        } else {
          this.position.y = originY;
        }

        this.opacity(1).animate(this.direction.duration);
      }
      return this.draw();
    }

    public hide() {
      let nextX = this.position.x;
      let nextY = this.position.y;

      if (this.direction.direction === 'left') {
        nextX += CHAR_SIZE_LUT.initFromOffset[this.showSize];
      } else if (this.direction.direction === 'right') {
        nextX -= CHAR_SIZE_LUT.initFromOffset[this.showSize];
      } else if (this.direction.direction === 'top') {
        nextY += CHAR_SIZE_LUT.initFromOffset[this.showSize];
      } else if (this.direction.direction === 'bottom') {
        nextY -= CHAR_SIZE_LUT.initFromOffset[this.showSize];
      }
      
      const x = this.stage.stageWidth * nextX / GAL.MAX_GRID;
      const y = this.stage.stageHeight * nextY / GAL.MAX_GRID
        + CHAR_SIZE_LUT.yOffset[this.showSize];

      this.animate(this.direction.duration);
      this.animator.init(this.animation, this, () => {
        this.scene.layers.chars.removeChild(this);
        this.reset();
      });
      this.animator.start({x, y, alpha: 0});
      return {check: this.checkAnimation, exec: this.endAnimation};
    }

    public posture(posture: string) {
      this.modified.pos = this.posName !== posture;
      this.posName = posture;
      return this;
    }

    public face(face: string) {
      this.modified.face = this.faceName !== face;
      this.faceName = face;
      return this;
    }

    public size(size: TCharSize = 'middle') {
      this.showSize = size;
      return this;
    }

    public at(x: TGrid, y?: TGrid) {
      this.position.x = x;
      if (typeof y === 'number') {
        this.position.y = y;
      }
      return this;
    }

    public opacity(alpha: number) {
      this.nextAlpha = alpha;
      return this;
    }

    public from(
      direction: TDirection,
      duration: number = 600
    ) {
      this.direction.direction = direction;
      if (duration) {
        this.direction.duration = duration;
      }
      return this;
    }

    public with(
      duration: number = 800,
      type: TTransitionType = 'fade'
    ) {
      this.transition = {duration, type};
      this.faceTransActor.init(this.transition);
      this.posTransActor.init(this.transition);
      return this;
    }

    public animate(
      duration: number = 500,
      func: (t: number) => number = t => t
    ) {
      this.animation = {duration, func};
      return this;
    }

    public behind(name: string) {
      return this;
    }

    private checkAnimation = () => {
      return this.animator.check() && this.faceTransActor.check() && this.posTransActor.check();
    }

    private endAnimation = () => {
      if (!this.animator.check()) {
        this.animator.end();
      }
      if (!this.faceTransActor.check()) {
        this.faceTransActor.end();
      }
      if (!this.posTransActor.check()) {
        this.posTransActor.end();
      }
      this.animation = null;
    }
  }
}
