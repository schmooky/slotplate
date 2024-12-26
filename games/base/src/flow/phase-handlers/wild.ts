import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function wild({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.WinLines> {
  await new Promise<void>((resolve) => {
    if (store.dataStore.wildTransformations.length > 0) {
      eventEmitter.emit(REELS_EVENTS.wildTransformations, false);

      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  return Phase.WinLines;
}
