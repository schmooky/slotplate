import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function winLines({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.WinShow> {
  await new Promise<void>((resolve) => {
    if (store.dataStore.payLines.length > 0) {
      eventEmitter.emit(REELS_EVENTS.playWinLines);

      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  return Phase.WinShow;
}
