import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { resizeObject, SmartContainer } from '@slotplate/renderer';
import {
  eventEmitter,
  FREE_SPIN_EVENTS,
  POPUPS_EVENTS,
  REELS_EVENTS,
  SPIN_BUTTON_EVENTS,
  STATE_MACHINE_EVENTS,
} from '@lib/events';
import { BitmapText, Container, TextStyle } from 'pixi.js';
import { CustomCircularProgressBar } from '@lib/utils/CustomCircularProgressBar';
import gsap from 'gsap';
import { AnnouncerTypes } from '@components/modal/announcers/types';
import { rootStore } from '@src/stores/RootStore';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';

export class Announcers extends SmartContainer {
  private announcerContainer = new Container();

  private freeSpinSpine = Spine.from({
    skeleton: 'announcersData',
    atlas: 'buyFeatureDataAtlas',
  });

  private circularProgressBar = new CustomCircularProgressBar({
    backgroundColor: 0x676666,
    backgroundAlpha: 1,
    lineWidth: 6,
    fillColor: 0x01e461,
    fillAlpha: 1,
    radius: 25,
    value: 100,
    cap: 'butt',
    initialTime: 5,
    textStyle: new TextStyle({
      dropShadow: true,
      fill: '#25ff4e',
      fontFamily: 'MartianMono',
      fontSize: 30,
      fontVariant: 'small-caps',
      fontWeight: 'bold',
      stroke: '#aa1e1e',
    }),
    onComplete: this.onHideAnnouncer.bind(this),
  });

  private fsCountText = new BitmapText({
    text: '0',
    style: { fontFamily: 'greenFont', fontSize: 70 },
  });

  private totalWinText = new BitmapText({
    text: '0',
    style: { fontFamily: 'greenFont', fontSize: 70 },
  });

  // Управляет задержкой в секундах перед началом анимации 'hide' после завершения цикла анимации 'idle'
  private hideAnimationDelay = 0;

  private startHide = false;

  constructor() {
    super();
    this.setupText();
    this.setupContainers();
    this.setupListeners();
    this.setAnnouncerPosition();
    this.renderable = false;

    this.addChild(this.announcerContainer);
  }

  private setupText() {
    this.fsCountText.anchor.set(1, 1.5);
    this.fsCountText.pivot.set(-120, 0);
    this.totalWinText.anchor.set(0.5, 1.5);
  }

  private setupContainers() {
    this.circularProgressBar.position.set(170, 335);
    this.freeSpinSpine.addChild(this.circularProgressBar);
    this.freeSpinSpine.addSlotObject('txt_total_win', this.totalWinText);
    this.freeSpinSpine.addSlotObject('txt_x10', this.fsCountText);
    this.announcerContainer.addChild(this.freeSpinSpine);
  }

  private setupListeners() {
    eventEmitter.on(POPUPS_EVENTS.showAnnouncer, (type: string) => {
      this.startHide = false;

      switch (type) {
        case AnnouncerTypes.ShowFSBonus: {
          this.onShowFSBonus();
          break;
        }

        case AnnouncerTypes.ShowTotalWin: {
          this.onShowTotalWin();
          break;
        }

        case AnnouncerTypes.ShowMystery: {
          this.onShowMystery();
          break;
        }

        case AnnouncerTypes.ShowFS: {
          this.onShowFS();
          break;
        }

        default: {
          break;
        }
      }
    });

    eventEmitter.on(POPUPS_EVENTS.hideAnnouncer, () => {
      this.hideAnimationDelay = 0.001;
      this.onHideAnnouncer();
    });

    this.freeSpinSpine.state.addListener({
      complete: (entry: TrackEntry) => {
        const animationName = entry.animation?.name;
        if (!animationName) return;

        if (animationName.startsWith('show_')) {
          const idleAnimation = animationName.replace('show_', 'idle_');
          this.freeSpinSpine.state.setAnimation(0, idleAnimation, true);
        }

        if (animationName.startsWith('idle_')) {
          if (!this.hideAnimationDelay) return;
          this.onHideAnnouncer();
        }

        if (animationName === 'hide_you_won') {
          const { dataStore, gameStatusStore } = rootStore;

          if (gameStatusStore.isOnFSBonusMode) {
            eventEmitter.emit(REELS_EVENTS.hideFSBonusObjects);
            eventEmitter.emit(SPIN_BUTTON_EVENTS.updateSpinBtnCounterWithoutAnimation, dataStore.freeSpinsCount);
            gameStatusStore.isOnFSBonusMode = false;
          } else {
            eventEmitter.emit(SPIN_BUTTON_EVENTS.updateSpinBtnCounterWithoutAnimation, dataStore.freeSpinsCount);
            rootStore.gameStatusStore.showFSLayout = true;
            eventEmitter.emit(FREE_SPIN_EVENTS.showFreeSpin);
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          }
          rootStore.gameStatusStore.canIShot = true;
        }

        if (animationName === 'hide_welcome') {
          eventEmitter.emit(REELS_EVENTS.showFSBonusObjects);
          gameSound.playSound(SoundKey.WelcomeBonusFSPopupEnd);
          eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
        }

        if (animationName === 'hide_mistery' || animationName === 'hide_total_win') {
          eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
        }
      },
    });
  }

  private onShowFSBonus = () => {
    this.renderable = true;
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);
    this.hideAnimationDelay = 1;
    this.freeSpinSpine.state.setAnimation(0, 'show_welcome', false);
  };

  private onShowTotalWin = () => {
    this.renderable = true;
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);
    gameSound.playSound(SoundKey.TotalWin);
    this.freeSpinSpine.state.setAnimation(0, 'show_total_win', false);
    const totalWinTextValue = rootStore.dataStore.defaultFormatter.formatCurrency(rootStore.dataStore.totalWin);
    this.totalWinText.text = totalWinTextValue;
    Announcers.updateFontSize(this.totalWinText, totalWinTextValue);
    this.circularProgressBar.start();
  };

  private onShowMystery = () => {
    this.renderable = true;
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);
    gameSound.playSound(SoundKey.PopUpMystery);
    this.hideAnimationDelay = 1;
    this.freeSpinSpine.state.setAnimation(0, 'show_mistery', false);
  };

  private onShowFS = () => {
    rootStore.gameStatusStore.canIShot = false;
    this.renderable = true;
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);
    gameSound.playSound(SoundKey.PopUpFS);
    this.freeSpinSpine.state.setAnimation(0, 'show_you_won', false);
    this.fsCountText.text = rootStore.dataStore.freeSpinsCount;
    this.circularProgressBar.start();
  };

  setAnnouncerPosition() {
    const { isPortrait } = resizeObject;

    this.announcerContainer.scale.set(isPortrait ? 0.9 : 1);
    this.announcerContainer.position.set(isPortrait ? 25 : 0, isPortrait ? -40 : 0);
  }

  private static updateFontSize(textObject: BitmapText, value: string): void {
    if (value.length > 10) {
      textObject.style.fontSize = 40;
    } else if (value.length > 9) {
      textObject.style.fontSize = 50;
    } else if (value.length > 8) {
      textObject.style.fontSize = 60;
    } else {
      textObject.style.fontSize = 70;
    }
  }

  private onHideAnnouncer() {
    if (this.startHide) return;
    this.startHide = true;

    gsap.delayedCall(this.hideAnimationDelay, () => {
      const currentAnimationName = this.freeSpinSpine.state.getCurrent(0)?.animation?.name;
      const hideAnim = currentAnimationName!.startsWith('idle_')
        ? currentAnimationName!.replace('idle_', 'hide_')
        : currentAnimationName!.replace('show_', 'hide_');

      if (hideAnim) {
        this.freeSpinSpine.state.setAnimation(0, hideAnim, false);
        this.circularProgressBar.stop();
        this.hideAnimationDelay = 0;
        eventEmitter.emit(POPUPS_EVENTS.hideGameShadow);
        rootStore.gameStatusStore.setShowAnnouncer(false);
      } else {
        throw new Error("Can't find announcing hide anim");
      }
    });
  }
}
