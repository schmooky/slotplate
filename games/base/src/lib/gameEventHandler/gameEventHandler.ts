import { rootStore } from '@src/stores/RootStore';
import {
  eventEmitter,
  POPUPS_EVENTS,
  REELS_EVENTS,
  SPIN_BUTTON_EVENTS,
  STATE_MACHINE_EVENTS,
} from '@lib/eventEmminer/events';
import { Phase } from '@src/flow/types';
import { network } from '@lib/nework/nework';

export const gameEventHandler = {
  onBtnSpinClick: () => {
    eventEmitter.emit(SPIN_BUTTON_EVENTS.playSpinAnim);

    if (rootStore.gameStatusStore.isSymbolPaytableOpened) {
      eventEmitter.emit(REELS_EVENTS.hideSymbolPaytable);
    }

    if (rootStore.autoplayStore.isActive) {
      rootStore.autoplayStore.stop();
    } else {
      gameEventHandler.handleClick();
    }
  },
  onStartFreeRoundsClick: () => {
    const { freeRoundStore, balanceStore, modalStatusStore } = rootStore;

    modalStatusStore.setFRCModalVisible(false);
    freeRoundStore.setIsOnCampaignState(true);
    balanceStore.setVisibleBet(freeRoundStore.bet as number);

    network
      .gameRequest<
        unknown,
        { campaignId: string }
      >({ requestType: 'activateFreeRoundCampaign', payload: { campaignId: freeRoundStore.campaignId as string } })
      .then(() => {
        eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
      });
  },
  onHidePopups: () => {
    const { gameStatusStore } = rootStore;

    if (gameStatusStore.showRegularWin) {
      eventEmitter.emit(POPUPS_EVENTS.hideRegularWin);
    }

    if (gameStatusStore.showBigWin) {
      eventEmitter.emit(POPUPS_EVENTS.hideWinAnnouncer);
    }

    if (gameStatusStore.showAnnouncer) {
      eventEmitter.emit(POPUPS_EVENTS.hideAnnouncer);
    }

    if (gameStatusStore.showHint) {
      eventEmitter.emit(POPUPS_EVENTS.hideHint);
    }

    if (gameStatusStore.isSymbolPaytableOpened) {
      eventEmitter.emit(REELS_EVENTS.hideSymbolPaytable);
    }
  },
  handleClick: () => {
    const { stateMachine, gameStatusStore } = rootStore;

    switch (stateMachine.phase) {
      case Phase.Idle: {
        eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
        break;
      }

      case Phase.StopSpin: {
        eventEmitter.emit(REELS_EVENTS.slamStop);
        break;
      }

      case Phase.WinLines: {
        eventEmitter.emit(REELS_EVENTS.stopLines);
        break;
      }

      default: {
        if (gameStatusStore.showRegularWin) {
          eventEmitter.emit(POPUPS_EVENTS.hideRegularWin);
        }

        if (gameStatusStore.showBigWin) {
          eventEmitter.emit(POPUPS_EVENTS.hideWinAnnouncer);
        }

        if (gameStatusStore.showAnnouncer) {
          eventEmitter.emit(POPUPS_EVENTS.hideAnnouncer);
        }

        if (gameStatusStore.showHint) {
          eventEmitter.emit(POPUPS_EVENTS.hideHint);
        }

        break;
      }
    }
  },
};
