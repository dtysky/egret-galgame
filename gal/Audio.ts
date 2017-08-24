/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/28
 * Description:
 */
namespace GAL {
  export class Audio {
    private multiple: boolean = false;
    private audio: {
      audio: egret.Sound,
      channel: egret.SoundChannel,
      position: number
    } = {
      audio: null,
      channel: null,
      position: 0
    };
    private loop: boolean;
    private defaultLoop: boolean;

    constructor(
      multiple: boolean = false,
      defaultLoop: boolean = false
    ) {
      this.multiple = multiple;
      this.defaultLoop = defaultLoop;
    }

    public play(src: string, loop?: boolean) {
      if (this.multiple) {
        // this.loop = loop === undefined ? loop : false;
        return;
      }
      this.loop = loop === undefined ? this.defaultLoop : loop;
      if (this.audio.channel) {
        this.audio.channel.stop();
      }
      this.audio.audio = RES.getRes(src);
      this.audio.channel = this.audio.audio.play(0, this.loop ? 0 : 1);
    }

    public pause() {
      if (this.multiple) {
        return;
      }
      this.audio.position = this.audio.channel.position;
      this.audio.channel.stop();
      this.audio.channel = null;
    }

    public resume() {
      if (this.multiple) {
        return;
      }
      this.audio.channel = this.audio.audio.play(this.audio.position, this.loop ? -1 : 1);
    }

    public stop() {
      if (this.multiple) {
        return;
      }
      this.audio.channel.stop();
    }

    public volume(v: number) {
      if (this.multiple) {
        return;
      }
      this.audio.channel.volume = v;
    }
  }
}
