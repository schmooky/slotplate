import { CLONING_WILD_EVENTS, eventEmitter, POPUPS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { BitmapText, Container } from 'pixi.js';
import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import gsap from 'gsap';
import { rootStore } from '@src/stores/RootStore';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';

export class RegularWin extends Container {
  public regularWin = Spine.from({
    skeleton: 'regularWinData',
    atlas: 'cloningWildAtlas',
  });

  public bitMapText = new BitmapText({
    text: '0',
    style: { fontFamily: 'blueFont', fontSize: 27 },
  });

  private tweenObj = { value: 0 };

  private wasStopped = false;

  constructor() {
    super();

    this.createAnnouncerObjects();
    this.setupListeners();
    this.renderable = false;
  }

  private createAnnouncerObjects() {
    this.regularWin.addSlotObject('numb', this.bitMapText);

    this.bitMapText.position.set(0, 50);
    this.bitMapText.anchor.set(0.5);
    this.bitMapText.scale.y *= -1;

    const slot = this.regularWin.skeleton.findSlot('numb');
    if (slot) {
      slot.bone.y = this.bitMapText.style.fontSize;
    }

    this.addChild(this.regularWin);
  }

  private setupListeners = () => {
    eventEmitter.on(POPUPS_EVENTS.showRegularWin, this.onShowRegularWin);
    eventEmitter.on(POPUPS_EVENTS.showLineWin, this.onShowLineWin);

    eventEmitter.on(POPUPS_EVENTS.hideRegularWin, () => {
      if (this.wasStopped) return;

      const { win, cloningWildMultiplier } = rootStore.dataStore;
      this.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(
        cloningWildMultiplier ? win / cloningWildMultiplier : win,
      );
      this.onHideRegularWin();
    });

    eventEmitter.on(POPUPS_EVENTS.hideLineWin, () => {
      this.onHideLineWin();
    });

    this.regularWin.state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'show') {
          this.regularWin.state.setAnimation(0, 'idle', true);
        }

        if (entry.animation?.name === 'show_repeat') {
          this.regularWin.state.setAnimation(0, 'idle_repeat');
        }

        if (entry.animation?.name === 'idle_repeat') {
          this.wasStopped = true;
          this.regularWin.state.setAnimation(0, 'hide_repeat');
        }

        if (entry.animation?.name === 'hide') {
          if (
            rootStore.dataStore.cloningWildMultiplier &&
            rootStore.dataStore.win / rootStore.balanceStore.visibleBet >= 10
          ) {
            this.renderable = false;
            rootStore.gameStatusStore.setShowRegularWin(false);
            rootStore.gameStatusStore.setShowBigWin(true);
          } else {
            this.renderable = false;
            rootStore.gameStatusStore.setShowRegularWin(false);
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          }
        }
        if (entry.animation?.name === 'hide_repeat') {
          this.renderable = false;
        }
        if (entry.animation?.name === 'on_x2') {
          this.regularWin.state.setAnimation(0, 'hide');
          gameSound.stopSounds([SoundKey.RegularWinStart, SoundKey.RegularWinLoop]);
          gameSound.playSound(SoundKey.RegularWinStop);
        }
      },
    });
  };

  private onHideRegularWin = () => {
    if (this.wasStopped) return;

    if (gameSound.isSoundPlaying(SoundKey.CountMoney)) {
      gameSound.stopSound(SoundKey.CountMoney);
    }

    this.wasStopped = true;
    gsap.killTweensOf(this.tweenObj);

    gsap.delayedCall(1, () => {
      if (rootStore.dataStore.cloningWildMultiplier) {
        rootStore.gameStatusStore.setHint(false);
        eventEmitter.emit(CLONING_WILD_EVENTS.multiplierFlight);
      } else {
        rootStore.gameStatusStore.setHint(false);
        this.regularWin.state.setAnimation(0, 'hide');
        gameSound.stopSounds([SoundKey.RegularWinStart, SoundKey.RegularWinLoop]);
        gameSound.playSound(SoundKey.RegularWinStop);
      }
    });
  };

  private onHideLineWin = () => {
    if (this.wasStopped) return;
    this.wasStopped = true;
    this.regularWin.state.setAnimation(0, 'hide_repeat');
  };

  private onShowLineWin = (lineWin: number) => {
    this.wasStopped = false;
    this.renderable = true;
    this.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(lineWin);
    this.regularWin.state.setAnimation(0, 'show_repeat');
  };

  private onShowRegularWin = () => {
    const { cloningWildMultiplier, win } = rootStore.dataStore;
    this.wasStopped = false;
    this.renderable = true;

    this.tweenObj.value = 0;

    const currentWin = cloningWildMultiplier ? win / cloningWildMultiplier : win;

    gameSound.playSounds([SoundKey.RegularWinStart, SoundKey.RegularWinLoop]);

    this.regularWin.state.setAnimation(0, 'show');
    gsap.to(this.tweenObj, {
      duration: 1.5,
      value: currentWin,
      onStart: () => {
        gameSound.playSound(SoundKey.CountMoney);
      },
      onUpdate: () => {
        this.bitMapText.text = rootStore.dataStore.withoutCurrency.formatCurrency(this.tweenObj.value);
      },
      onComplete: () => {
        gameSound.stopSound(SoundKey.CountMoney);
        this.tweenObj.value = 0;
        this.onHideRegularWin();
      },
    });
  };
}
