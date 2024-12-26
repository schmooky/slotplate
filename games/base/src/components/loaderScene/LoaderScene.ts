import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { Container, FillGradient, Graphics, TextStyle } from 'pixi.js';
import { orientation } from '@lib/utils/orientation';
import { Scene } from '@lib/SceneManager';
import { rootStore } from '@src/stores/RootStore';
import { LoaderProgressBar } from './LoaderProgressBar';

export class LoaderScene extends Container implements Scene {
  private bgContainer = new SmartContainer({
    landscapeData: {
      viewportWidth: 1920,
      viewportHeight: 1080,
      align: 'center',
      valign: 'center',
    },
    portraitData: {
      viewportWidth: 1080,
      viewportHeight: 1920,
      align: 'center',
      valign: 'center',
    },
  });

  private mainContainer = new SmartContainer({
    landscapeData: {
      viewportWidth: 1920,
      viewportHeight: 1080,
      align: 'center',
      valign: 'center',
    },
    portraitData: {
      viewportWidth: 1080,
      viewportHeight: 1920,
      align: 'center',
      valign: 'center',
    },
  });

  private gambitLogo: Spine;

  private leftWall: Spine;

  private rightWall: Spine;

  private splashLogoPortrait: Spine;

  private splashLogoLandscape: Spine;

  private background: Spine;

  private high2: Spine;

  private high3: Spine;

  private darkOverlay: Graphics;

  private progressBar: LoaderProgressBar;

  private isPortrait = resizeObject.isPortrait;

  constructor() {
    super();

    this.createGameObjects();

    requestAnimationFrame(() => {
      this.onProgressCheck(rootStore.assetsStore.assetsProgress);
    });
  }

  private onProgressCheck(progress: number): void {
    if (progress !== 1) {
      this.progressBar.setProgress(progress);

      requestAnimationFrame(() => {
        this.onProgressCheck(rootStore.assetsStore.assetsProgress);
      });
    }
  }

  private createGameObjects() {
    this.initializeSpines();
    this.setSpinesVisibility(this.isPortrait);
    this.createDarkOverlay();

    const fillerGradient = new FillGradient(0, 7, 1812, 7);
    fillerGradient.addColorStop(0, 0xbdff00);
    fillerGradient.addColorStop(1, 0xdeff80);

    const filler = new Graphics().roundRect(0, 0, 1812, 14, 8).fill(fillerGradient);

    const bg = new Graphics().roundRect(0, 0, 1812, 14, 8).fill({
      color: 0x181b1c,
      alpha: 0.5,
    });

    this.progressBar = new LoaderProgressBar(
      new SmartContainer({
        landscapeData: {
          viewportWidth: 1920,
          viewportHeight: 1080,
          align: 'center',
          valign: 'bottom',
          correctionOffsetY: -68,
          correctionOffsetX: -906,
        },
        portraitData: {
          viewportWidth: 1080,
          viewportHeight: 1920,
          align: 'center',
          valign: 'bottom',
          correctionOffsetY: -68,
          correctionOffsetX: -486,
        },
      }),
      filler,
      bg,
      new TextStyle({ fill: 0xe6_e6_e6, fontSize: 34 }),
    );

    this.addObjectsToContainers();
  }

  private initializeSpines() {
    this.background = LoaderScene.createSpine('bgData', 'bgAtlas', `idle_${orientation()}`);

    this.high2 = LoaderScene.createSpine('high2Data', 'high2Atlas', 'idle_1');
    this.high2.scale = 2;
    this.high2.position.set(-140, 250);

    this.high3 = LoaderScene.createSpine('high3Data', 'high3Atlas', 'idle_1');
    this.high3.scale = 2;
    this.high3.position.set(160, 150);

    this.gambitLogo = LoaderScene.createSpine('gambitLogoData', 'splashScreenAtlas', 'idle');
    this.gambitLogo.y = this.isPortrait ? 500 : 300;

    this.leftWall = LoaderScene.createSpine('leftWallPortraitData', 'splashScreenAtlas', 'idle');
    this.leftWall.position.set(-542, 1125);

    this.rightWall = LoaderScene.createSpine('rightWallPortraitData', 'splashScreenAtlas', 'idle');
    this.rightWall.position.set(540, 1125);

    this.splashLogoPortrait = LoaderScene.createSpine('splashLogoPortraitData', 'splashScreenAtlas', 'idle');
    this.splashLogoPortrait.position.set(0, -500);

    this.splashLogoLandscape = LoaderScene.createSpine('splashLogoLandscapeData', 'splashScreenAtlas', 'idle');
    this.splashLogoLandscape.position.set(0, -45);
  }

  private static createSpine(skeleton: string, atlas: string, animation: string): Spine {
    const spine = Spine.from({ skeleton, atlas });
    spine.state.setAnimation(0, animation, true);
    return spine;
  }

  private addObjectsToContainers() {
    this.bgContainer.addChild(this.background, this.rightWall, this.leftWall);
    this.mainContainer.addChild(
      this.gambitLogo,
      this.splashLogoPortrait,
      this.splashLogoLandscape,
      this.high3,
      this.high2,
    );
    this.addChild(this.bgContainer, this.darkOverlay, this.mainContainer, this.progressBar);
  }

  private createDarkOverlay() {
    this.darkOverlay = new Graphics();
    this.darkOverlay
      .rect(0, 0, document.body.clientWidth, document.body.clientHeight)
      .fill(LoaderScene.createDarkGradient());
  }

  private updateDarkOverlay() {
    this.darkOverlay.clear();
    this.darkOverlay
      .rect(0, 0, document.body.clientWidth, document.body.clientHeight)
      .fill(LoaderScene.createDarkGradient());
  }

  private static createDarkGradient(): FillGradient {
    const w = document.body.clientWidth;
    const h = document.body.clientHeight;

    const darkGradient = new FillGradient(w / 2, 0, w / 2, h);
    darkGradient.addColorStop(0, {
      r: 12,
      g: 1,
      b: 31,
      a: 1,
    });
    darkGradient.addColorStop(1, {
      r: 12,
      g: 1,
      b: 31,
      a: 0.7,
    });

    return darkGradient;
  }

  onResize = () => {
    const { isPortrait } = resizeObject;

    this.updateDarkOverlay();

    if (this.isPortrait !== isPortrait) {
      this.isPortrait = isPortrait;

      this.gambitLogo.y = isPortrait ? 500 : 300;
      this.setSpinesVisibility(isPortrait);
      this.background.state.clearTracks();
      this.background.skeleton.setToSetupPose();
      this.background.state.setAnimation(0, `idle_${orientation()}`, true);

      if (this.progressBar) {
        this.progressBar.onResize(document.body.clientHeight > document.body.clientWidth);
      }
    }
  };

  private setSpinesVisibility(isPortrait: boolean) {
    this.high2.renderable = isPortrait;
    this.high3.renderable = isPortrait;
    this.leftWall.renderable = isPortrait;
    this.rightWall.renderable = isPortrait;
    this.splashLogoPortrait.renderable = isPortrait;
    this.splashLogoLandscape.renderable = !isPortrait;
  }
}
