# egret-galgame
An extension for egret engine.

## Description

白鹭游戏引擎的一个GAL插件，使用可参见[B站七夕游戏《Double;7》技术剖析](http://dtysky.moe/article/Skill-2017_06_12_a)和用其实现的游戏[《Double;7》](https://www.bilibili.com/blackboard/double7.html)，具体代码请自行F12然后将代码格式化后查看，使用基本如下：  

```ts
export const interpreter = new GAL.Interpreter();
export const scene = new GAL.Scene(interpreter);
export const branch = new GAL.Branch();
export const bgm = new GAL.Audio(false, true);
export const text = new GAL.Text();
export const boy = new GAL.Character('npc.boy', '少年', 'boy', 0x0078a4, 0x0078a4, cps, false, false);

this.stage.addChild(scene);
boy.addToScene(scene);
branch.addToScene(scene);
text.addToScene(scene);

const intro = [
    () => scene.with(600, 'fade').then(() => next()).toMode('NVL').at(370).create('home'),
    () => boy.think('什么...我是主角？'),
    () => boy.think('开什么玩笑，当主人公岂不是会很累...我可没那么多精力。'),
    () => boy.think('蛤？还是让我当，我...'),
    () => branch.open([
      {
        content: '搞什么玩意，我就是不想当怎么着了？',
        callback: () => {
          scene.with().toMode('ADV');
          interpreter.next();
        }
      },
      {
        content: '没办法，看来还是逃不过命运啊~',
        callback: () => {
          scene.with().toMode('ADV');
          interpreter.next();
        }
      }
    ]),
    () => boy.say('...不对，我是和谁在说话？');
]

scene.bindTouchEvent();
interpreter.load(intro);
interpreter.next();

```

License

Copyright © 2017, 戴天宇, Tianyu Dai (dtysky < dtysky@outlook.com >). All Rights Reserved. This project is free software and released under the MIT License.
