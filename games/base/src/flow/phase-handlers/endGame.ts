import { Phase } from '@src/flow/types';
import {
  eventEmitter,
  FREE_SPIN_EVENTS,
  SPIN_BUTTON_EVENTS,
  STATE_MACHINE_EVENTS,
} from '@lib/eventEmminer/events';
import { rootStore } from '@src/stores/RootStore';
import { AnnouncerTypes } from '@components/modal/announcers/types';
import gsap from 'gsap';

const clearGame = (): void => {
  const { gameStatusStore, balanceStore, dataStore, freeRoundStore } = rootStore;

  if (rootStore.gameStatusStore.isOnFSMode) {
    gameStatusStore.isOnFSMode = false;

    eventEmitter.emit(
      SPIN_BUTTON_EVENTS.playIdleAnim,
      rootStore.autoplayStore.isActive ? 'spin_stop_idle' : 'idle_regular',
    );
  }

  gameStatusStore.isOnFSBonusMode = false;
  dataStore.fsBonusShootResult = null;
  gameStatusStore.isOnCWBonusMode = false;
  gameStatusStore.showCWLayout = false;
  balanceStore.setLastWin(dataStore.totalWin);
  balanceStore.actualize();
  freeRoundStore.setRoundsLeft(freeRoundStore.serverRoundsLeft);
};

const hideFreeSpinHandler = (): void => {
  if (rootStore.gameStatusStore.showFSLayout) {
    rootStore.gameStatusStore.showFSLayout = false;
    eventEmitter.emit(FREE_SPIN_EVENTS.hideFreeSpin);
  }
};

export async function endGame(): Promise<Phase.Idle | Phase.FreeRoundCampaign> {
  const { gameStatusStore, dataStore, freeRoundStore, errorStore, autoplayStore, modalStatusStore } = rootStore;

  await new Promise<void>((resolve) => {
    if ((gameStatusStore.isOnFSMode || gameStatusStore.isOnCWBonusMode) && dataStore.totalWin) {
      gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowTotalWin);

      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        resolve();
      });
    } else {
      resolve();
    }

    if (!errorStore.isInsufficientFunds) {
      clearGame();
      hideFreeSpinHandler();
    }
  });

  if ((autoplayStore.isActive || freeRoundStore.isOnCampaignState) && dataStore.totalWin) {
    await new Promise<void>((resolve) => {
      gsap.delayedCall(0.3, () => {
        resolve();
      });
    });
  }

  if (
    (freeRoundStore.isComplete || (!freeRoundStore.isOnCampaignState && freeRoundStore.campaignId)) &&
    !errorStore.isFreeRoundError
  ) {
    errorStore.setErrorId(0);
    return Phase.FreeRoundCampaign;
  }

  if (!modalStatusStore.showErrorModal && errorStore.isInsufficientFunds) {
    errorStore.isInsufficientFunds = false;
  }

  return Phase.Idle;
}
