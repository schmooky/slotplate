import { Phase } from '@src/flow/types';
import { handleShotResponse, network } from '@lib/nework/nework';
import { FSBonusShootResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { eventEmitter, FREE_SPIN_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';

export async function freeSpinBonusShot(): Promise<Phase.FreeSpinBonusIdle> {
  await new Promise<void>((resolve) => {
    eventEmitter.once(FREE_SPIN_EVENTS.questionSymbolShotRequest, ({ reel, row }) => {
      network
        .gameRequest<FSBonusShootResponse, { reel: number; row: number }>({
          requestType: 'freespinBonus',
          payload: { reel, row },
        })
        .then((response) => {
          if (response.status === RequestStatus.Done && response.data) {
            if (response.data) {
              handleShotResponse(response.data);
            }

            eventEmitter.emit(FREE_SPIN_EVENTS.showShootResult);

            eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
              resolve();
            });
          }
        });
    });
  });

  return Phase.FreeSpinBonusIdle;
}
