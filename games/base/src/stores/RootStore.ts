import { AssetsStore } from '@src/stores/assets/AssetsStore';
import { IRootStore } from '@src/stores/types';
import { phaseHandlers } from '@src/flow/phases';
import { Phase } from '@src/flow/types';
import { StateMachineStore } from '@slotplate/engine/state-machine';
import { DataStore } from '@src/stores/data/DataStore';
import { GameBalanceStore } from '@src/stores/gameBalance/GameBalanceStore';
import { BuyFeatureStore } from '@src/stores/buyFeature/buyFeatureStore';
import { ErrorStore } from '@src/stores/error/ErrorStore';
import { FreeRoundStore } from '@src/stores/freeRound/freeRoundStore';
import { StatusStore } from '@src/stores/status/StatusStore';
import { AutoplayDataStore } from '@src/stores/autoplay/AutoplayDataStore';
import { IntegrationHandler, IntegrationMethods } from '@slotplate/engine/integration-api';

class RootStore implements IRootStore {
  assetsStore = new AssetsStore();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  stateMachine = new StateMachineStore(this, phaseHandlers, Phase.Init, true);

  dataStore = new DataStore();

  balanceStore = new GameBalanceStore();

  autoplayStore = new AutoplayDataStore();

  statusStore = new StatusStore();

  buyFeatureStore = new BuyFeatureStore();

  errorStore: ErrorStore = new ErrorStore(this);

  freeRoundStore = new FreeRoundStore();

  integrationApi: IntegrationHandler;

  constructor() {
    this.stateMachine.init();
    this.integrationApi = new IntegrationHandler([
      {
        method: IntegrationMethods.AutoplayStop,
        callback: () => {
          this.autoplayStore.stop();
        },
      },
    ]);
  }
}

export const rootStore = new RootStore();
