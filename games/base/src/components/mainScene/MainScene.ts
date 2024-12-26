import { Container } from 'pixi.js';
import { Scene } from '@lib/SceneManager';
import { Background } from '@components/background/Background';
import { resizeObject } from '@slotplate/renderer';
import { GameUI } from '@components/gameUI/GameUI';
import { Reels } from '@components/reels/Reels';
import { Announcers } from '@components/modal/announcers/Announcers';
import { BigWin } from '@components/bigWin/BigWin';
import { GameShadow } from '@components/gameShadow/GameShadow';
import { ReelsPaytable } from '@components/reels/ReelsPaytable';
import { BuyFeature } from '@components/modal/buyFeature/BuyFeature';
import { ScreenAnimations } from '@components/screenAnimations/ScreenAnimations';
import { FreeSpinLayout } from '@components/freeSpinLayout/FreeSpinLayout';
import { Logo } from '@components/logo/Logo';
import { gameEventHandler } from '@lib/gameEventHandler/gameEventHandler';
import { eventEmitter, SHAKE_EVENTS } from '@lib/eventEmminer/events';
import { anticipationShake } from '@lib/utils/shakeUtils';

export class MainScene extends Container implements Scene {
  private readonly background = new Background();

  private readonly logo = new Logo();

  private readonly gameShadow = new GameShadow();

  private readonly bigWin = new BigWin();

  private readonly freeSpinLayout = new FreeSpinLayout();

  private readonly announcers = new Announcers();

  private readonly buyFeature = new BuyFeature();

  private readonly reels = new Reels();

  private readonly reelsPaytable = new ReelsPaytable();

  private readonly screenAnimations = new ScreenAnimations();

  private readonly gameUI = new GameUI();

  private readonly anticipationShakeContainer = new Container();

  constructor() {
    super();
    this.anticipationShakeContainer.addChild(this.background, this.logo, this.reels);

    this.addChild(
      this.anticipationShakeContainer,
      this.gameUI,
      this.freeSpinLayout,
      this.gameShadow,
      this.reelsPaytable,
      this.bigWin,
      this.announcers,
      this.buyFeature,
      this.screenAnimations,
    );

    window.addEventListener('pointerdown', (event: PointerEvent) => {
      if (event.button === 0) {
        gameEventHandler.onHidePopups();
      }
    });

    eventEmitter.on(SHAKE_EVENTS.playAnticipationShake, () => {
      anticipationShake(this.anticipationShakeContainer);
    });
  }

  onResize() {
    this.background.playBackgroundAnim(resizeObject.isPortrait);
    this.logo.onResize();
    this.gameShadow.onResize();
    this.bigWin.setBigWinPosition();
    this.freeSpinLayout.setFreeSpinPosition();
    this.announcers.setAnnouncerPosition();
    this.buyFeature.setBuyFeaturePosition();
    this.reels.onResize(resizeObject.isPortrait);
    this.gameUI.onResize();
    this.reelsPaytable.onResize();
  }
}
