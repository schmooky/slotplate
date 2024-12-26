import { NetworkManager, RequestStatus, IResponse } from '@slotplate/engine/network';
import { rootStore } from '@src/stores/RootStore';

export class GameNetworkManager extends NetworkManager {
  async gameRequest<T, S = undefined>(
    request: {
      requestType: string;
      payload?: S;
    },
    validator?: (response: unknown) => response is T,
  ): Promise<IResponse<T>> {
    const response = await super.gameRequest(request, validator);

    const { errorStore, autoplayStore, freeRoundStore, modalStatusStore } = rootStore;

    if (response.status === RequestStatus.Error) {
      errorStore.setErrorId(response.errorData.errorId as number);
      errorStore.isInsufficientFunds = response.errorData.errorId === 401 || response.errorData.errorId === 503;

      if (errorStore.isFreeRoundError) {
        freeRoundStore.setNeedToReloadGame(true);

        freeRoundStore.setIsOnCampaignState(false);

        if (response.errorData.errorId === 640) {
          freeRoundStore.setWasCancelled(true);
        }

        modalStatusStore.setFRCInfoPanelVisible(false);
        modalStatusStore.setFRCWinModalVisible(true);
      } else {
        errorStore.setError(response.errorData);
        autoplayStore.stop();
      }

      if (!errorStore.isInsufficientFunds && !errorStore.isFreeRoundError) {
        throw new Error('Server Error');
      }
    }

    return response;
  }
}
