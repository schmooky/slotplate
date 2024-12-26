import { Phase } from '@src/flow/types';
import { eventEmitter, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { GameMode } from '@lib/nework/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function winShow({
  store,
}: PhaseHandlerOptions<IRootStore>): Promise<
  Phase.EndGame | Phase.MysteryFeatureChoose | Phase.MysteryFeature | Phase.FreeSpinIdle | Phase.FreeSpinBonusIdle
> {
  const { dataStore, gameStatusStore, balanceStore } = store;
  const { win, nextGameMode, cloningWildMultiplier } = dataStore;

  await new Promise<void>((resolve) => {
    if (win > 0) {
      if (win / balanceStore.visibleBet >= 10 && !cloningWildMultiplier) {
        gameStatusStore.setShowBigWin(true);
      } else {
        gameStatusStore.setShowRegularWin(true);
      }

      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  balanceStore.setLastWin(dataStore.totalWin);

  switch (nextGameMode) {
    case GameMode.MysteryFeature: {
      return Phase.MysteryFeature;
    }
    case GameMode.MysteryFeatureChosen: {
      return Phase.MysteryFeatureChoose;
    }
    case GameMode.Freespin: {
      return Phase.FreeSpinIdle;
    }
    case GameMode.CloningWildBuyFeature: {
      return Phase.FreeSpinIdle;
    }
    case GameMode.FreespinBonus: {
      return Phase.FreeSpinBonusIdle;
    }
    default: {
      return Phase.EndGame;
    }
  }
}
