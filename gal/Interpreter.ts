/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/22
 * Description:
 */
namespace GAL {
  export class Interpreter {
    private scripts: TScript[] = [];
    private pointer: number;
    private preRes = null;
    private preScripts: TScript[][] = [];
    private preOffset: number[] = [];

    private exec() {
      this.preRes = this.scripts[this.pointer]() || null;
    }

    public load(scripts: TScript[], preScripts?: TScript[], preOffset?: number) {
      if (preScripts) {
        this.preScripts.push(preScripts);
      } else if (this.scripts.length) {
        this.preScripts.push(this.scripts);
      }
      if (preOffset) {
        this.preOffset.push(preOffset);
      } else if (this.scripts.length) {
        this.preOffset.push(this.pointer);
      }
      this.scripts = scripts;
      this.pointer = -1;
    }

    public next() {
      if (this.preRes && this.preRes.check && this.preRes.exec) {
        if (!this.preRes.check()) {
          this.preRes.exec();
          return;
        }
        this.preRes = null;
      }
      
      if (this.pointer < this.length - 1) {
        this.pointer += 1;
        this.exec();
      } else {
        if (this.preScripts.length) {
          this.scripts = this.preScripts.pop();
          this.pointer = this.preOffset.pop();
          this.next();
        }
      }
    }

    public goto(line: number) {
      if (line >= this.length) {
        this.pointer = this.length;
      } else {
        this.pointer = line;
      }
      this.exec();
    }

    get current() {
      return this.pointer;
    }

    get length() {
      return this.scripts.length;
    }
  }
}
