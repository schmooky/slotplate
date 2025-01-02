import { eventEmitter, POPUPS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/events';
import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { BitmapText } from 'pixi.js';
import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import gsap from 'gsap';
import { rootStore } from '@src/stores/RootStore';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';

export class BigWin extends SmartContainer {
  private bigWin = BigWin.createSpine('bigWinData');
  private bigWinCoin = BigWin.createSpine('coinBigWinData');
  private cellPopup = BigWin.createSpine('cellPopupData');
  private glowUpBigWin = BigWin.createSpine('glowUpBigWinData');

  private topLeftSpine = BigWin.createSpine('hudBigWinData');
  private topRightSpine = BigWin.createSpine('hudBigWinData');
  private bottomLeftSpine = BigWin.createSpine('hudBigWinData');
  private bottomRightSpine = BigWin.createSpine('hudBigWinData');

  private bitMapText = new BitmapText({
    text: '0',
    style: { fontFamily: 'blueFont', fontSize: 54 },
  });

  private tweenObj = { value: 0 };

  private wasStopped = false;

  constructor() {
    super();
    this.createAnnouncerObjects();
    this.setupListeners();
    this.setupContainers();
    this.renderable = false;
  }

  private createAnnouncerObjects() {
    this.bitMapText.anchor.set(0.5);
    this.bitMapText.scale.y *= -1;

    this.bigWin.addSlotObject('numbers', this.bitMapText);
    this.setBigWinPosition();
  }

  private static createSpine(skeleton: string): Spine {
    return Spine.from({
      skeleton,
      atlas: 'popupAtlas',
    });
  }

  private setupListeners = () => {
    eventEmitter.on(POPUPS_EVENTS.showWinAnnouncer, this.onShowAnnouncer);
    eventEmitter.on(POPUPS_EVENTS.hideWinAnnouncer, () => {
      this.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(rootStore.dataStore.win);
      this.onHideAnnouncer();
    });

    this.bigWin.state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'show') {
          this.bigWin.state.setAnimation(0, 'idle', true);
          this.bigWinCoin.state.setAnimation(0, 'idle', true);
          this.cellPopup.state.setAnimation(0, 'big_win', true);
          this.topLeftSpine.state.setAnimation(0, 'idle', true);
          this.topRightSpine.state.setAnimation(0, 'idle', true);
          this.bottomLeftSpine.state.setAnimation(0, 'idle', true);
          this.bottomRightSpine.state.setAnimation(0, 'idle', true);
        }

        if (entry.animation?.name === 'hide') {
          this.renderable = false;
          rootStore.gameStatusStore.setShowBigWin(false);
          eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
        }
      },
    });
  };

  private setupContainers() {
    this.addChild(
      this.bigWin,
      this.bigWinCoin,
      this.cellPopup,
      this.glowUpBigWin,
      this.topLeftSpine,
      this.topRightSpine,
      this.bottomLeftSpine,
      this.bottomRightSpine,
    );
  }

  setBigWinPosition() {
    const { isPortrait } = resizeObject;

    this.bigWin.position.y = isPortrait ? -30 : 0;

    this.topLeftSpine.scale.y = -1;
    this.topLeftSpine.position.x = isPortrait ? 540 : 0;
    this.topLeftSpine.position.y = isPortrait ? 0 : -540;
    this.topLeftSpine.rotation = isPortrait ? -(Math.PI / 2) : Math.PI;

    this.topRightSpine.position.x = isPortrait ? 540 : 0;
    this.topRightSpine.position.y = isPortrait ? 0 : -540;
    this.topRightSpine.rotation = isPortrait ? Math.PI / 2 : 0;

    this.bottomLeftSpine.position.x = isPortrait ? -540 : 0;
    this.bottomLeftSpine.position.y = isPortrait ? 0 : 540;
    this.bottomLeftSpine.rotation = isPortrait ? -(Math.PI / 2) : Math.PI;

    this.bottomRightSpine.scale.y = -1;
    this.bottomRightSpine.position.x = isPortrait ? -540 : 0;
    this.bottomRightSpine.position.y = isPortrait ? 0 : 540;
    this.bottomRightSpine.rotation = isPortrait ? Math.PI / 2 : 0;
  }

  private onHideAnnouncer = () => {
    if (this.wasStopped) return;

    if (gameSound.isSoundPlaying(SoundKey.CountMoney)) {
      gameSound.stopSound(SoundKey.CountMoney);
    }

    this.wasStopped = true;
    gsap.killTweensOf(this.tweenObj);

    gsap.delayedCall(1, () => {
      this.bigWin.state.setAnimation(0, 'hide');
      this.bigWin.state.setAnimation(0, 'hide');
      this.bigWinCoin.state.setAnimation(0, 'hide');
      this.topLeftSpine.state.setAnimation(0, 'hide');
      this.topRightSpine.state.setAnimation(0, 'hide');
      this.bottomLeftSpine.state.setAnimation(0, 'hide');
      this.bottomRightSpine.state.setAnimation(0, 'hide');
      this.cellPopup.alpha = 0;
      eventEmitter.emit(POPUPS_EVENTS.hideGameShadow);
    });
  };

  private onShowAnnouncer = () => {
    this.wasStopped = false;
    this.renderable = true;
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);

    this.tweenObj.value = 0;

    this.bigWin.state.setAnimation(0, 'show');
    this.bigWinCoin.state.setAnimation(0, 'show');
    this.topLeftSpine.state.setAnimation(0, 'show');
    this.topRightSpine.state.setAnimation(0, 'show');
    this.bottomLeftSpine.state.setAnimation(0, 'show');
    this.bottomRightSpine.state.setAnimation(0, 'show');
    this.cellPopup.alpha = 1;

    gameSound.playSound(SoundKey.BigWin);

    gsap.to(this.tweenObj, {
      duration: 1.5,
      value: rootStore.dataStore.win,
      onStart: () => {
        gameSound.playSound(SoundKey.CountMoney);
      },
      onUpdate: () => {
        this.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(this.tweenObj.value);
      },
      onComplete: () => {
        gameSound.stopSound(SoundKey.CountMoney);
        this.tweenObj.value = 0;
        this.onHideAnnouncer();
      },
    });
  };
}
