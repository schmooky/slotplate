import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { GameMode } from '@lib/nework/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function stopSpin({
  store,
}: PhaseHandlerOptions<IRootStore>): Promise<Phase.CloningWild | Phase.EndGame | Phase.MysteryFeatureChoose> {
  const { errorStore, dataStore } = store;

  await new Promise<void>((resolve) => {
    eventEmitter.emit(REELS_EVENTS.stopRotate);

    eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
      resolve();
    });
  });

  let returnedPhase: Phase;

  if (errorStore.isInsufficientFunds || errorStore.isFreeRoundError) {
    returnedPhase = Phase.EndGame;
  } else if (dataStore.nextGameMode === GameMode.MysteryFeatureChosen) {
    returnedPhase = Phase.MysteryFeatureChoose;
  } else {
    returnedPhase = Phase.CloningWild;
  }

  return returnedPhase;
}
