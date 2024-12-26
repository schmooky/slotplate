import { Phase } from '@src/flow/types';
import { eventEmitter, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { rootStore } from '@src/stores/RootStore';
import { GameMode } from '@lib/nework/types';

export async function buyFeatureIdle(): Promise<Phase.Idle | Phase.FreeSpinIdle | Phase.EndGame> {
  const { dataStore, errorStore, balanceStore } = rootStore;

  await new Promise<void>((resolve) => {
    eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
      resolve();
    });
  });

  if (dataStore.nextGameMode === GameMode.Freespin || dataStore.nextGameMode === GameMode.CloningWildBuyFeature) {
    balanceStore.setLastWin(0);
    return Phase.FreeSpinIdle;
  }

  return errorStore.isInsufficientFunds ? Phase.EndGame : Phase.Idle;
}
