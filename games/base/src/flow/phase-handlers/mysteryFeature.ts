import { Phase } from '@src/flow/types';
import { eventEmitter, MYSTERY_FEATURE_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';
import { HintTextKeys } from '@components/hint/GameHint';

export async function mysteryFeature({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.MysterySpin> {
  const { mysteryTriggerPosition } = store.dataStore;

  await new Promise<void>((resolve) => {
    store.gameStatusStore.setHint(true, HintTextKeys.Mystery, 0);
    eventEmitter.emit(MYSTERY_FEATURE_EVENTS.playMysteryWinAnimation, mysteryTriggerPosition);

    eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
      store.gameStatusStore.setHint(false);
      resolve();
    });
  });

  return Phase.MysterySpin;
}
