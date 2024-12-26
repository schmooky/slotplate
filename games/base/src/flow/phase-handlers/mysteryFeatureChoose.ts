import { Phase } from '@src/flow/types';
import { eventEmitter, MYSTERY_FEATURE_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { handleSpinResponse, network } from '@lib/nework/nework';
import { GameRoundResponse, PositionResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { HintTextKeys } from '@components/hint/GameHint';
import { rootStore } from '@src/stores/RootStore';

export async function mysteryFeatureChoose(): Promise<Phase.CloningWild> {
  await new Promise<void>((resolve) => {
    rootStore.gameStatusStore.setHint(true, HintTextKeys.Question, 0);

    eventEmitter.once(MYSTERY_FEATURE_EVENTS.mysteryChosen, (reelIndex: number, rowIndex: number) => {
      network
        .gameRequest<GameRoundResponse, PositionResponse>({
          requestType: 'bonus',
          payload: { reel: reelIndex, row: rowIndex },
        })
        .then((response) => {
          if (response.status === RequestStatus.Done && response.data) {
            handleSpinResponse(response.data);
            eventEmitter.emit(MYSTERY_FEATURE_EVENTS.playQuestionSymbolChangeAnimation, reelIndex, rowIndex);
            eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
              resolve();
            });
          }
        });
    });
  });

  return Phase.CloningWild;
}
