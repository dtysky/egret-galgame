/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 2017/6/20
 * Description:
 */
namespace GAL {
  export type TMode = 'ADV' | 'NVL';
  export interface ILayers {
    bg: egret.DisplayObjectContainer;
    text: egret.DisplayObjectContainer;
    chars: egret.DisplayObjectContainer;
    dialog: egret.DisplayObjectContainer;
    branch: egret.DisplayObjectContainer;
  }
  export type TGrid = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  export const MAX_GRID = 6;
  export type TCharSize = 'exSmall' | 'small' | 'middle' | 'large' | 'exLarge';
  export const CHAR_SIZE_LUT = {
    scale: {
      exSmall: .2,
      small: .6,
      middle: 1,
      large: 1.6,
      exLarge: 2
    },
    yOffset: {
      exSmall: 32,
      small: 64,
      middle: 84,
      large: 96,
      exLarge: 128
    },
    initFromOffset: {
      exSmall: .1,
      small: .2,
      middle: .3,
      large: .4,
      exLarge: .4
    }
  };
  export type TSPScriptResult = {check: () => boolean, exec: () => void};
  export type TScript = () => any | TSPScriptResult;
  export const CHAR_ATTRS: {
    [id: string]: {
      name: string,
      nameColor: number,
      wordsColor: number,
      bgPath: string,
      bgThinkPath: string,
      cps: number
    }
  } = {};
  export const DIALOG_SIZE_LUT = {
    touchIcon: {
      bg: 'elements.touch',
      width: 64,
      right: 12,
      bottom: 12
    },
    adv: {
      width: 540,
      height: 287,
      nameLeft: 128,
      nameSize: 28,
      nameWidth: 256,
      nameTop: 42,
      wordsLeft: 30,
      wordsTop: 112,
      wordsWidth: 480,
      wordsSize: 24,
      wordsLineSpacing: 8
    },
    nvl: {
      bg: 'dialog.nvl',
      width: 540,
      height: 960,
      innerWidth: 460,
      innerHeight: 720,
      nameWidth: 256,
      nameSize: 28,
      nameLeft: 0,
      wordsLeft: 0,
      wordsTop: 18,
      wordsSize: 24,
      wordsLineSpacing: 4,
      blockSpacing: 32,
      blockMinHeight: 32
    }
  };
  export type TTransitionType = 'fade' | 'movefade' | 'normal' | 'none' | 'dissolve';
  export interface ITransition {
    duration: number;
    type: TTransitionType;
  }
  export interface ITransform {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    alpha?: number;
  }
  export interface IAnimation {
    duration: number;
    func: (t: number) => number;
  }
  export type TDirection = 'left' | 'right' | 'top' | 'bottom';
  export interface ITextATTRS {
    size?: number;
    textAlign?: string;
    lineSpacing?: number;
    width?: number;
    height?: number;
    x?: number | egret.HorizontalAlign;
    y?: number;
    rotation?: number;
    color?: number;
    strokeColor?: number,
    glowColor?: number
  }
  export interface IText extends ITextATTRS {
    text: string;
  }
  export interface IBranch {
    content?: string;
    bg?: string;
    transform?: ITextATTRS;
    callback: (index?: number, content?: string) => void;
  }
  export const BRANCH_ATTRS = {
    branchWidth: 420,
    branchAligh: egret.HorizontalAlign.RIGHT,
    textWidth: 420,
    textX: 0,
    textY: null,
    branchPadding: 8,
    color: 0xffffff,
    fontSize: 22,
    lineSpace: 6,
    branchSpace: 12,
    textAlign: egret.HorizontalAlign.CENTER,
    bg: 'elements.button',
    mask: 'dialog.nvl'
  };
  export interface IMapArea {
    name: string;
    resKey: string;
    visible: boolean;
    x: number;
    y: number;
    scripts: (name?: string) => void;
  }
}
