/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/20
 * Description:
 */
namespace GAL {
  export class ADVDialog extends Dialog {
    private bg: egret.Bitmap;
    private charName: egret.TextField;
    private charWords: egret.TextField;
    private words: string;
    private wordsLength: number;
    private currentCursor: number;
    private startTime: number;
    private cps: number;

    protected onAddToStage() {
      this.bg = new egret.Bitmap();
      this.bg.name = 'bg';
      this.charName = new egret.TextField();
      this.charName.name = 'name';
      this.charName.textAlign = 'center';
      this.charName.stroke = 2;
      this.charWords = new egret.TextField();
      this.charWords.name = 'words';
      this.charWords.multiline = true;
      this.charWords.stroke = 1;

      this.width = this.stage.stageWidth;
      this.height = this.stage.stageWidth * DIALOG_SIZE_LUT.adv.height / DIALOG_SIZE_LUT.adv.width;
      this.y = this.stage.stageHeight - DIALOG_SIZE_LUT.adv.height;
      this.charName.textAlign = egret.HorizontalAlign.LEFT;
      this.charName.x = DIALOG_SIZE_LUT.adv.nameLeft;
      this.charName.size = DIALOG_SIZE_LUT.adv.nameSize;
      this.charName.y = DIALOG_SIZE_LUT.adv.nameTop;

      this.charWords.width = DIALOG_SIZE_LUT.adv.wordsWidth;
      this.charWords.x = DIALOG_SIZE_LUT.adv.wordsLeft;
      this.charWords.y = DIALOG_SIZE_LUT.adv.wordsTop;
      this.charWords.size = DIALOG_SIZE_LUT.adv.wordsSize;
      this.charWords.lineSpacing = DIALOG_SIZE_LUT.adv.wordsLineSpacing;

      this.addChild(this.bg);
      this.addChild(this.charName);
      this.addChild(this.charWords);
      super.onAddToStage();
    }

    protected animate = () => {
      if (this.currentCursor === this.wordsLength) {
        this.endAnimate();
        return;
      }
      const duration = Date.now() - this.startTime;
      const currentCursor = ~~(duration * this.cps / 1000);
      if (currentCursor !== this.currentCursor) {
        this.charWords.text = this.words.substr(0, this.currentCursor);
        this.currentCursor = currentCursor;
      }
      requestAnimationFrame(this.animate);
    }

    protected createAnimate = () => {
      this.currentCursor = 0;
      this.startTime = Date.now();
      this.wordsLength = this.words.length;
      this.animate();
    }

    protected endAnimate = () => {
      this.currentCursor = this.wordsLength;
      this.charWords.text = this.words;
    }

    protected checkAnimationEnd = () => {
      return this.currentCursor === this.wordsLength;
    }

    public say(id: string, words: string) {
      this.visible = true;
      this.bg.texture = RES.getRes(CHAR_ATTRS[id].bgPath);
      this.charName.visible = true;
      this.charName.text = CHAR_ATTRS[id].name;
      this.charName.strokeColor = CHAR_ATTRS[id].nameColor;
      if (this.charName.width > DIALOG_SIZE_LUT.adv.nameWidth) {
        this.charName.text = CHAR_ATTRS[id].name.substring(0, ~~(DIALOG_SIZE_LUT.adv.nameWidth / this.charName.size) + 1);
      }
      this.cps = CHAR_ATTRS[id].cps;
      this.words = words;
      this.charWords.strokeColor = CHAR_ATTRS[id].wordsColor;
      this.charWords.text = '';
      this.createAnimate();
      return {check: this.checkAnimationEnd, exec: this.endAnimate};
    }

    public think(id: string, words: string) {
      this.visible = true;
      this.bg.texture = RES.getRes(CHAR_ATTRS[id].bgThinkPath);
      this.charName.visible = false;
      this.charName.strokeColor = CHAR_ATTRS[id].nameColor;
      this.cps = CHAR_ATTRS[id].cps;
      this.words = words;
      this.charWords.strokeColor = CHAR_ATTRS[id].wordsColor;
      this.charWords.text = '';
      this.createAnimate();
      return {check: this.checkAnimationEnd, exec: this.endAnimate};
    }
  }
}