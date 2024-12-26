import React from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '@src/stores/RootStore';
import { gameRuleElements } from '@src/reactComponents/reactModalWindows/gameElements';
import { modalStatus, ReactUI } from '@slotplate/react-components';
import { Paytable } from '@src/reactComponents/reactModalWindows/paytable/paytable';
import { eventEmitter, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { gameEventHandler } from '@lib/gameEventHandler/gameEventHandler';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';

export const ReactModalWindows = observer(() => {
  const {
    balanceStore,
    dataStore,
    autoplayStore,
    freeRoundStore,
    errorStore,
  } = rootStore;

  return <ReactUI
    betModal={{
      allowedBets: balanceStore.allowedBets,
      currentBet: balanceStore.visibleBet,
      currentDisplayBet: dataStore.defaultFormatter.formatCurrency(balanceStore.visibleBet),
      setCurrentBet: (currentBet: number): Promise<void> => new Promise<void>((resolve) => {
        balanceStore.setVisibleBet(currentBet);
        resolve();
      }),
    }}
    autoPlayModal={{
      autoPlayRounds: autoplayStore.autoPlayRounds,
      startAutoPlay: (value) => {
        const { setFirstAutoPlay, autoPlayRounds } = rootStore.autoplayStore;

        AnalyticsManager.instance.logAutoplayInfo(false, autoPlayRounds[value]!);
        setFirstAutoPlay();
        autoplayStore.start(value);
        eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
      },
    }}
    freeRoundModal={{
      frcRoundsLeft: `${freeRoundStore.roundsLeft}`,
      frcValidTo: `${new Date(freeRoundStore.validTo ?? '').toLocaleString()}, GMT`,
      startFreeRounds: () => {
        gameEventHandler.onStartFreeRoundsClick();
      },
    }}
    freeRoundModalWin={{
      frcTotalWin: freeRoundStore.totalWin ? dataStore.defaultFormatter.formatCurrency(freeRoundStore.totalWin as number) : '0',
      frcWasCancelled: freeRoundStore.wasCancelled,
      needReloadGame: freeRoundStore.needToReloadGame,
      onEndCb: () => {
        freeRoundStore.clearFreeRoundCampaign();

        if (!errorStore.isFreeRoundError) {
          eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
        }
      },
    }}
    freeRoundCampaignInfo={{
      frcRoundsLeft: freeRoundStore.roundsLeft as number,
      frcRoundsTotal: freeRoundStore.roundsTotal as number,
    }}
    menu={{
      options: {
        sound: {
          soundChecked: !gameSettingStore.isSoundEnabled,
          onSoundCheckedChange: (change) => {
            gameSettingStore.setIsSoundsEnabled(!change);

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
        },
        spaceBar: {
          spaceBarChecked: gameSettingStore.isSpaceBarToSpin,
          onSpaceBarCheckedChange: (change: boolean) => {
            gameSettingStore.setIsSpaceBarToSpin(change);
            gameSound.restartSound(SoundKey.ButtonClick);
          },
        },
        fastPlay: {
          fastPlayChecked: gameSettingStore.isTurboMode,
          onFastPlayCheckedChange: (change: boolean) => {
            gameSound.restartSound(SoundKey.ButtonClick);
            gameSettingStore.setIsTurboMode(change);
            if (
              (!rootStore.gameStatusStore.isOnFSMode && !gameSound.isSoundPlaying(SoundKey.MusicFreeSpin)) ||
              (rootStore.gameStatusStore.isOnFSMode && rootStore.gameStatusStore.isOnFSBonusMode)
            ) {
              if (change) {
                gameSound.stopSound(SoundKey.MusicRegular);
                gameSound.playSound(SoundKey.MusicFastPlay);
              } else {
                gameSound.stopSound(SoundKey.MusicFastPlay);
                gameSound.playSound(SoundKey.MusicRegular);
              }
            }
          },
        },
        lobbyUrl: dataStore.lobbyUrl,
      },
      autoplay: {
        bet: {
          currentBet: balanceStore.visibleBet,
          betFormatter: dataStore.defaultFormatter.formatCurrency.bind(dataStore.defaultFormatter),
          totalBetFormatter: dataStore.defaultFormatter.formatCurrency.bind(dataStore.defaultFormatter),
          setCurrentBet: (currentBet: number) => {
            balanceStore.setVisibleBet(currentBet);
          },
          allowedBets: balanceStore.allowedBets,
        },
        autoPlay: {
          autoPlayRounds: autoplayStore.autoPlayRounds,
          startAutoplay: (value) => {
            const { setFirstAutoPlay, autoPlayRounds } = rootStore.autoplayStore;

            AnalyticsManager.instance.logAutoplayInfo(true, autoPlayRounds[value]!);
            setFirstAutoPlay();
            modalStatus.setMenuVisible(false);
            autoplayStore.start(value);
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          },
        },
        fastPlay: {
          isFastPlayMode: gameSettingStore.isTurboMode,
          setIsFastPlayMode: (change: boolean) => {
            gameSettingStore.setIsTurboMode(change);
          },
        },
      },
      paytable: {
        elements: [<Paytable key={'paytable'} />],
        currentDisplayBet: dataStore.withoutCurrency.formatCurrency(balanceStore.visibleBet),
        currency: dataStore.defaultFormatter.currencyAffix,
      },
      rules: {
        elements: gameRuleElements(),
      },
    }}
  />;
});
