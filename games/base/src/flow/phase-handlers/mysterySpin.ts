import { Phase } from '@src/flow/types';
import { handleSpinResponse, network } from '@lib/nework/nework';
import { GameRoundResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { eventEmitter, REELS_EVENTS } from '@lib/eventEmminer/events';

export async function mysterySpin(): Promise<Phase.StopSpin> {
  await new Promise<void>((resolve) => {
    eventEmitter.emit(REELS_EVENTS.startRotate);

    network.gameRequest<GameRoundResponse>({ requestType: 'initBonus' }).then((response) => {
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
