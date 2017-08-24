/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/20
 * Description:
 */
namespace GAL {
  export class NVLDialog extends Dialog {
    private bg: egret.Bitmap;
    private blocks: {
      container: egret.DisplayObjectContainer,
      charName: egret.TextField,
      charWords: egret.TextField,
      words: string,
      wordsLength: number,
      startTime: number,
      currentCursor: number
    }[] = [];
    private cps: number;
    private currentIndex = -1;
    private currentTop = 0;
    private testText = new egret.TextField();
    private innerX = 0;
    private innerY = 0;

    protected onAddToStage() {
      this.bg = new egret.Bitmap();
      this.bg.name = 'bg';
      this.bg.texture = RES.getRes(DIALOG_SIZE_LUT.nvl.bg);

      this.width = DIALOG_SIZE_LUT.nvl.width;
      this.height = DIALOG_SIZE_LUT.nvl.height;
      this.x = (this.stage.stageWidth - DIALOG_SIZE_LUT.nvl.width) / 2;
      this.y = (this.stage.stageHeight - DIALOG_SIZE_LUT.nvl.height) / 2;
      this.innerX = (DIALOG_SIZE_LUT.nvl.width - DIALOG_SIZE_LUT.nvl.innerWidth) / 2;
      this.innerY = (DIALOG_SIZE_LUT.nvl.height - DIALOG_SIZE_LUT.nvl.innerHeight) / 2;

      this.testText.width = DIALOG_SIZE_LUT.nvl.innerWidth - DIALOG_SIZE_LUT.nvl.wordsLeft;
      this.testText.size = DIALOG_SIZE_LUT.nvl.wordsSize;
      this.testText.lineSpacing = DIALOG_SIZE_LUT.nvl.wordsLineSpacing;
      this.addChild(this.bg);
      super.onAddToStage();
      this.reset();
    }

    protected animate = () => {
      const block = this.blocks[this.currentIndex];

      if (block.currentCursor === block.wordsLength) {
        this.endAnimate();
        return;
      }
      const duration = Date.now() - block.startTime;
      const currentCursor = ~~(duration * this.cps / 1000);
      if (currentCursor !== block.currentCursor) {
        block.charWords.text = block.words.substr(0, block.currentCursor);
        block.currentCursor = currentCursor;
      }
      requestAnimationFrame(this.animate);
    }

    protected createAnimate = () => {
      const block = this.blocks[this.currentIndex];

      block.currentCursor = 0;
      block.startTime = Date.now();
      block.wordsLength = block.words.length;
      this.animate();
    }

    protected endAnimate = () => {
      const block = this.blocks[this.currentIndex];

      block.currentCursor = block.wordsLength;
      block.charWords.text = block.words;
    }

    protected checkAnimationEnd = () => {
      const block = this.blocks[this.currentIndex];

      return block.currentCursor === block.wordsLength;
    }

    private calcBlockHeight(words: string) {
      this.testText.text = words;
      const height = this.testText.height;
      return height > DIALOG_SIZE_LUT.nvl.blockMinHeight ? height : DIALOG_SIZE_LUT.nvl.blockMinHeight;
    }

    private reset() {
      this.removeChildren();
      this.addChild(this.bg);
      this.addChild(this.touchIcon);
      this.blocks = [];
      this.currentTop = this.innerY;
      this.currentIndex = -1;
    }

    private outWords(id: string, words: string, withName: boolean = true) {
      let height = this.calcBlockHeight(words);
      if (this.currentTop + height >= DIALOG_SIZE_LUT.nvl.innerHeight) {
        this.reset();
      }

      this.visible = true;
      const block = {
        container: new egret.DisplayObjectContainer(),
        charName: new egret.TextField(),
        charWords: new egret.TextField(),
        words: words,
        wordsLength: words.length,
        startTime: 0,
        currentCursor: 0
      };

      this.cps = CHAR_ATTRS[id].cps;
      block.container.y = this.currentTop;

      block.words = words;
      block.charWords.size = DIALOG_SIZE_LUT.nvl.wordsSize;
      block.charWords.width = this.testText.width;
      block.charWords.lineSpacing = DIALOG_SIZE_LUT.nvl.wordsLineSpacing;
      block.charWords.x = this.innerX + DIALOG_SIZE_LUT.nvl.wordsLeft;
      block.charWords.stroke = 1;
      block.charWords.strokeColor = CHAR_ATTRS[id].wordsColor;
      block.charWords.text = '';

      if (withName) {
        block.charName.size = DIALOG_SIZE_LUT.nvl.nameSize;
        block.charName.width = DIALOG_SIZE_LUT.nvl.nameWidth;
        block.charName.stroke = 1;
        block.charName.strokeColor = CHAR_ATTRS[id].nameColor;
        block.charName.text = CHAR_ATTRS[id].name;
        block.charName.textAlign = egret.HorizontalAlign.LEFT;
        block.charName.x = this.innerX + DIALOG_SIZE_LUT.nvl.nameLeft;
        block.charWords.y = block.charName.height + DIALOG_SIZE_LUT.nvl.wordsTop;
        height += block.charWords.y;
        block.container.addChild(block.charName);
      }

      block.container.addChild(block.charWords);
      this.addChild(block.container);
      this.blocks.push(block);
      this.currentIndex += 1;
      this.currentTop += height + DIALOG_SIZE_LUT.nvl.blockSpacing;
      this.createAnimate();
      return {check: this.checkAnimationEnd, exec: this.endAnimate};
    }

    public say(id: string, words: string) {
      return this.outWords(id, words);
    }

    public think(id: string, words: string) {
      return this.outWords(id, words, false);
    }

    public hide() {
      super.hide();
      this.reset();
    }
  }
}
