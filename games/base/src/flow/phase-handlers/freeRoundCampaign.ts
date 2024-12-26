import { Phase } from '@src/flow/types';
import { IRootStore } from '@src/stores/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { eventEmitter, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { reaction } from 'mobx';

export async function freeRoundCampaign({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.Idle> {
  const { modalStatusStore, freeRoundStore } = store;

  await new Promise<void>((resolve) => {
    if (freeRoundStore.isComplete) {
      modalStatusStore.setFRCInfoPanelVisible(false);
      modalStatusStore.setFRCWinModalVisible(true);
    } else {
      modalStatusStore.setFRCModalVisible(true);
    }

    reaction(
      () => modalStatusStore.showFRCInfoAnnouncer,
      (showFRCInfoAnnouncer) => {
        if (showFRCInfoAnnouncer) {
          resolve();
          freeRoundStore.clearFreeRoundCampaign();
          eventEmitter.off(STATE_MACHINE_EVENTS.changeState);
        }
      },
    );

    eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
      resolve();
    });
  });

  return Phase.Idle;
}
