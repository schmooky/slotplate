import { AssetsStore } from '@src/stores/assets/AssetsStore';
import { StateMachineStore } from '@slotplate/engine/state-machine';
import { DataStore } from '@src/stores/data/DataStore';
import { GameBalanceStore } from '@src/stores/gameBalance/GameBalanceStore';
import { AutoplayStore } from '@slotplate/engine/autoplay';
import { BuyFeatureStore } from '@src/stores/buyFeature/buyFeatureStore';
import { ErrorStore } from '@src/stores/error/ErrorStore';
import { FreeRoundStore } from '@src/stores/freeRound/freeRoundStore';
import { StatusStore } from '@src/stores/status/StatusStore';

export interface IRootStore {
  assetsStore: AssetsStore;
  stateMachine: StateMachineStore<string, object>;
  dataStore: DataStore;
  balanceStore: GameBalanceStore;
  autoplayStore: AutoplayStore;
  statusStore: StatusStore;
  buyFeatureStore: BuyFeatureStore;
  errorStore: ErrorStore;
  freeRoundStore: FreeRoundStore;
}
