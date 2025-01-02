import { AssetsStore } from '@src/stores/assets/AssetsStore';
import { StateMachineStore } from '@slotplate/engine/state-machine';
import { DataStore } from '@src/stores/data/DataStore';
import { GameBalanceStore } from '@src/stores/gameBalance/GameBalanceStore';
import { AutoplayStore } from '@slotplate/engine/autoplay';
import { BuyFeatureStore } from '@src/stores/buyFeature/buyFeatureStore';
import { ErrorStore } from '@src/stores/error/ErrorStore';
export interface IRootStore {
  assetsStore: AssetsStore;
  stateMachine: StateMachineStore<string, object>;
  dataStore: DataStore;
  balanceStore: GameBalanceStore;
  autoplayStore: AutoplayStore;
  buyFeatureStore: BuyFeatureStore;
  errorStore: ErrorStore;
}
