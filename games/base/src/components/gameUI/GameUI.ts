import { SmartContainer } from '@gambit/game-renderer';
import { Assets } from 'pixi.js';
import { SpinButton } from '@components/buttons/spinButton/SpinButton';
import { BuyButton } from '@components/buttons/buyButton/BuyButton';
import { reaction } from 'mobx';
import { rootStore } from '@src/stores/RootStore';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { Phase } from '@src/flow/types';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { SoundLoader } from '@lib/utils/soundLoader';
import { UI } from '@gambit/ui-pixi';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';
import { eventEmitter, SPIN_BUTTON_EVENTS } from '@lib/eventEmminer/events';

export class GameUI extends UI {
  private spinButton = new SpinButton();

  private buyButton = new BuyButton();

  private soundLoader = new SoundLoader();

  constructor() {
    super();
    const { balanceStore, dataStore, stateMachine, autoplayStore, freeRoundStore } = rootStore;

    this.createBetText(
      new SmartContainer({}),
      'ArchivoNarrow',
      `${dataStore.balanceFormatter.formatCurrency(balanceStore.visibleBet)}`,
      `${simpleLocalize.getTranslation('ui.bet.header')}`,
      () => {
        if (
          stateMachine.phase === Phase.BuyFeatureIdle ||
          rootStore.gameStatusStore.isBuyFeatureOpened ||
          rootStore.modalStatusStore.isModalWindowOpened
        ) {
          return;
        }

        gameSound.playSound(SoundKey.ButtonClick);
        rootStore.modalStatusStore.setBetModalVisible(true);
      },
    );
    this.createLastWinText(
      new SmartContainer({}),
      'ArchivoNarrow',
      `${dataStore.balanceFormatter.formatCurrency(balanceStore.lastWin)}`,
      `${simpleLocalize.getTranslation('ui.lastWin.header')}`,
    );
    this.createBalanceText(
      new SmartContainer({}),
      'ArchivoNarrow',
      `${dataStore.balanceFormatter.formatCurrency(balanceStore.visibleBalance)}`,
      Assets.cache.get('balanceIcon'),
    );
    this.createMenuButton(new SmartContainer({}), Assets.cache.get('menuIcon'), () => {
      if (
        stateMachine.phase === Phase.BuyFeatureIdle ||
        rootStore.gameStatusStore.isBuyFeatureOpened ||
        rootStore.modalStatusStore.isModalWindowOpened
      ) {
        return;
      }

      gameSound.playSound(SoundKey.ButtonClick);
      rootStore.modalStatusStore.setMenuVisible(true);
      AnalyticsManager.instance.logMenuClick();
    });
    this.createBetButton(new SmartContainer({}), Assets.cache.get('buttonBg'), Assets.cache.get('betIcon'), () => {
      if (
        stateMachine.phase === Phase.BuyFeatureIdle ||
        rootStore.gameStatusStore.isBuyFeatureOpened ||
        rootStore.modalStatusStore.isModalWindowOpened
      ) {
        return;
      }

      gameSound.playSound(SoundKey.ButtonClick);
      rootStore.modalStatusStore.setBetModalVisible(true);
    });
    this.createSoundButton(
      new SmartContainer({}),
      Assets.cache.get('soundOffIcon'),
      Assets.cache.get('soundOnIcon'),
      () => {
        if (stateMachine.phase === Phase.BuyFeatureIdle) {
          return;
        }

        gameSettingStore.setIsSoundsEnabled(!gameSettingStore.isSoundEnabled);
        if (gameSettingStore.isSoundEnabled && !gameSettingStore.isMainSoundsLoaded) {
          gameSettingStore.setIsLoadingSoundsInProgress(true);

          gameSound
            .loadMainWithAmbienceSounds()
            .then(() => {
              gameSettingStore.isMainSoundsLoaded = true;
              gameSound.playBackgroundMusic();
            })
            .catch((error) => {
              console.error('Error loading sounds:', error);
              gameSettingStore.isMainSoundsLoaded = false;
            })
            .finally(() => {
              gameSettingStore.setIsLoadingSoundsInProgress(false);
            });
        }
      },
      gameSettingStore.isSoundEnabled,
    );

    this.createTurboAutoplayUnion(
      new SmartContainer({}),
      Assets.cache.get('unionButtonBg'),
      {
        texture: Assets.cache.get('turboIcon'),
        onClickCallback: () => {
          if (
            stateMachine.phase === Phase.BuyFeatureIdle ||
            rootStore.gameStatusStore.isBuyFeatureOpened ||
            rootStore.modalStatusStore.isModalWindowOpened
          ) {
            return;
          }

          gameSound.restartSound(SoundKey.ButtonClick);
          gameSettingStore.setIsTurboMode(!gameSettingStore.isTurboMode);
          if (
            (!rootStore.gameStatusStore.isOnFSMode && !gameSound.isSoundPlaying(SoundKey.MusicFreeSpin)) ||
            (rootStore.gameStatusStore.isOnFSMode && rootStore.gameStatusStore.isOnFSBonusMode)
          ) {
            if (gameSettingStore.isTurboMode) {
              gameSound.stopSound(SoundKey.MusicRegular);
              gameSound.playSound(SoundKey.MusicFastPlay);
            } else {
              gameSound.stopSound(SoundKey.MusicFastPlay);
              gameSound.playSound(SoundKey.MusicRegular);
            }
          }
        },
      },
      {
        texture: Assets.cache.get('autoplayIcon'),
        onClickCallback: () => {
          if (
            stateMachine.phase === Phase.BuyFeatureIdle ||
            rootStore.gameStatusStore.isBuyFeatureOpened ||
            rootStore.modalStatusStore.isModalWindowOpened
          ) {
            return;
          }

          if (autoplayStore.isActive) {
            this.turboAutoplayUnion!.autoplayButton!.setEnabled(false);
            autoplayStore.stop();
          } else {
            gameSound.playSound(SoundKey.ButtonClick);
            rootStore.modalStatusStore.setAutoPlayModalVisible(true);
          }
        },
        fontFamily: 'ArchivoNarrow',
      },
    );

    this.turboAutoplayUnion?.turboButton.setIsActive(gameSettingStore.isTurboMode);
    this.turboAutoplayUnion!.autoplayButton.autoplayText.visible = true;

    this.createClock(new SmartContainer({}), 'ArchivoNarrow');

    this.soundLoader.renderable = false;

    this.addChild(this.spinButton);
    this.addChild(this.buyButton);
    this.addChild(this.soundLoader);

    reaction(
      () => gameSettingStore.isLoadingSoundsInProgress,
      (isLoadingSoundsInProgress) => {
        this.soundLoader.renderable = isLoadingSoundsInProgress;
      },
    );

    reaction(
      () => balanceStore.lastWin,
      (lastWin) => {
        this.lastWin?.setValueText(`${dataStore.balanceFormatter.formatCurrency(lastWin)}`);
      },
    );

    reaction(
      () => balanceStore.visibleBet,
      (visibleBet) => {
        this.betText?.setValueText(`${dataStore.balanceFormatter.formatCurrency(visibleBet)}`);
      },
    );

    reaction(
      () => balanceStore.visibleBalance,
      (visibleBalance) => {
        this.balance?.setValueText(`${dataStore.balanceFormatter.formatCurrency(visibleBalance)}`);
      },
    );

    reaction(
      () => gameSettingStore.isTurboMode,
      (isTurboMode) => {
        this.turboAutoplayUnion?.turboButton.setIsActive(isTurboMode);
      },
    );

    let firstSoundChange = true;
    reaction(
      () => gameSettingStore.isSoundEnabled,
      (isSoundEnabled) => {
        this.soundButton?.changeSoundTexture(isSoundEnabled);
        if (firstSoundChange) {
          firstSoundChange = false;
          AnalyticsManager.instance.logSoundInfo(isSoundEnabled);
        }
      },
    );

    reaction(
      () => stateMachine.phase,
      (phase) => {
        const isEnabled = phase === Phase.Idle;
        this.betButton!.setEnabled(isEnabled);
        this.menu!.setEnabled(isEnabled);
        this.turboAutoplayUnion!.autoplayButton!.setEnabled(isEnabled);
        this.spinButton.setEnabled(phase !== Phase.BuyFeatureIdle);

        if (autoplayStore.isActive) {
          this.turboAutoplayUnion!.autoplayButton!.alpha = 1;
          this.turboAutoplayUnion!.autoplayButton!.setEnabled(true);
        }

        this.buyButton.setIsEnabled(isEnabled);
        this.betText!.interactive = isEnabled;
      },
    );

    reaction(
      () => autoplayStore.isActive,
      (isActive) => {
        this.turboAutoplayUnion!.autoplayButton!.buttonImg.renderable = !isActive;
        this.turboAutoplayUnion!.autoplayButton!.autoplayText.renderable = isActive;

        eventEmitter.emit(SPIN_BUTTON_EVENTS.playStopAnim);

        if (!isActive && stateMachine.phase !== Phase.Idle) {
          this.turboAutoplayUnion!.autoplayButton!.setEnabled(false);
          eventEmitter.emit(SPIN_BUTTON_EVENTS.playIdleAnim, 'idle_regular');
        }
      },
    );

    reaction(
      () => autoplayStore.autoPlaySpinsLeft,
      (autoPlaySpinsLeft) => {
        this.turboAutoplayUnion!.autoplayButton!.autoplayText.text = autoPlaySpinsLeft;
      },
    );

    reaction(
      () => freeRoundStore.isOnCampaignState,
      (isOnCampaignState) => {
        this.lastWin!.renderable = !isOnCampaignState;
      },
    );
  }

  onResize(): void {
    this.buyButton.onResize();
    this.soundLoader.onResize();
  }
}
