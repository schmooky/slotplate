import { Phase } from '@src/flow/types';
import { handleSpinResponse, network } from '@lib/nework/nework';
import { GameRoundResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { eventEmitter, REELS_EVENTS, SPIN_BUTTON_EVENTS } from '@lib/eventEmminer/events';
import { rootStore } from '@src/stores/RootStore';

export async function freeSpinSpin(): Promise<Phase.StopSpin> {
  const { dataStore } = rootStore;
  await new Promise<void>((resolve) => {
    eventEmitter.emit(REELS_EVENTS.startRotate);
    eventEmitter.emit(SPIN_BUTTON_EVENTS.decrementSpinBtnCounter, dataStore.freeSpinsCount - 1);

    network.gameRequest<GameRoundResponse>({ requestType: 'freespin' }).then((response) => {
      if (response.status === RequestStatus.Done) {
        if (response.data) {
          handleSpinResponse(response.data);
        }
        resolve();
      }
    });
  });

  return Phase.StopSpin;
}
