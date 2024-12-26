import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';
import { HintTextKeys } from '@components/hint/GameHint';

export async function cloningWild({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.High2> {
  await new Promise<void>((resolve) => {
    if (store.dataStore.cloningWildTransformations) {
      store.gameStatusStore.setHint(true, HintTextKeys.CloningWild, 0);
      eventEmitter.emit(REELS_EVENTS.cloningWildTransformations);

      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  return Phase.High2;
}
