import SceneManager from '@lib/SceneManager';
import { Globals } from '@lib/Globals';
import { reaction } from 'mobx';
import { rootStore } from '@src/stores/RootStore';
import { Phase } from '@src/flow/types';
import { LoaderScene } from '@components/loaderScene/LoaderScene';
import { Application, WebGLRenderer } from 'pixi.js';
import { Stats } from 'pixi-stats';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);

PixiPlugin.registerPIXI(PIXI);

declare const GAME_ENV: string;

export class GameApplication {
  app: Application;

  private stats: unknown;

  constructor() {
    this.app = new Application();
    this.run();

    reaction(
      () => rootStore.stateMachine.phase,
      (phase) => {
        if (phase === Phase.Splash) {
          Globals.scene?.start(new LoaderScene());
        }
      },
    );
  }

  async run() {
    await this.app.init({
      resizeTo: document.body,
      resolution: window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      eventFeatures: {
        wheel: false,
      },
      premultipliedAlpha: false,
    });

    const rootElement = document.querySelector('#root');

    if (rootElement) {
      rootElement.append(this.app.canvas);
    } else {
      throw new Error('#root does not exist');
    }

    if (GAME_ENV === 'development') {
      this.stats = new Stats(this.app.renderer as WebGLRenderer);
    }

    Globals.scene = new SceneManager();

    this.app.stage.addChild(Globals.scene);
  }
}
