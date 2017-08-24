/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/20
 * Description:
 */
namespace GAL {
  export class Dialog extends egret.DisplayObjectContainer {
    protected touchIcon: egret.Bitmap;

    constructor() {
      super();
      this.visible = false;
      this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onAddToStage() {
      this.touchIcon = new egret.Bitmap();
      this.touchIcon.name = 'touch';
      this.touchIcon.texture = RES.getRes(DIALOG_SIZE_LUT.touchIcon.bg);
      this.touchIcon.width = DIALOG_SIZE_LUT.touchIcon.width;
      this.touchIcon.height = this.touchIcon.width * this.touchIcon.texture.textureHeight / this.touchIcon.texture.textureWidth;
      this.touchIcon.x = this.width - this.touchIcon.width - DIALOG_SIZE_LUT.touchIcon.right;
      this.touchIcon.y = this.height - this.touchIcon.height - DIALOG_SIZE_LUT.touchIcon.bottom;
      
      this.addChild(this.touchIcon);
    }

    public say(id: string, words: string): TSPScriptResult {
      return {exec: () => {}, check: () => true};
    }

    public think(id: string, words: string): TSPScriptResult {
      return {exec: () => {}, check: () => true};
    }

    public hide() {
      this.visible = false;
    }

    public resume() {
      this.visible = true;
    }
  }
}
