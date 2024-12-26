import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS } from '@lib/eventEmminer/events';
import { handleSpinResponse, network } from '@lib/nework/nework';
import { GameRoundResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function spin({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.StopSpin> {
  const { balanceStore } = store;

  await new Promise<void>((resolve) => {
    eventEmitter.emit(REELS_EVENTS.startRotate);
    balanceStore.setLastWin(0);

    if (!store.freeRoundStore.isOnCampaignState) {
      balanceStore.setVisibleBalance(balanceStore.visibleBalance - balanceStore.visibleBet);
    }

    network
      .gameRequest<
        GameRoundResponse,
        { bet: number }
      >({ requestType: 'spin', payload: { bet: store.balanceStore.visibleBet } })
      .then((response) => {
        if (response.status === RequestStatus.Done && response.data) {
          handleSpinResponse(response.data);
        }

        resolve();
      });
  });

  return Phase.StopSpin;
}
