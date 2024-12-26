import { AssetsStore } from '@src/stores/assets/AssetsStore';
import { StateMachineStore } from '@slotplate/engine/state-machine';
import { DataStore } from '@src/stores/data/DataStore';
import { GameBalanceStore } from '@src/stores/gameBalance/GameBalanceStore';
import { AutoplayStore } from '@slotplate/engine/autoplay';
import { modalStatus } from '@slotplate/react-components';
import { BuyFeatureStore } from '@src/stores/buyFeature/buyFeatureStore';
import { ErrorStore } from '@src/stores/error/ErrorStore';
import { GameStatusStore } from '@src/stores/gameStatus/GameStatusStore';
import { FreeRoundStore } from '@src/stores/freeRound/freeRoundStore';
import { StatusStore } from '@src/stores/status/StatusStore';

export interface IRootStore {
  assetsStore: AssetsStore;
  stateMachine: StateMachineStore<string, object>;
  dataStore: DataStore;
  balanceStore: GameBalanceStore;
  autoplayStore: AutoplayStore;
  modalStatusStore: typeof modalStatus;
  statusStore: StatusStore;
  buyFeatureStore: BuyFeatureStore;
  errorStore: ErrorStore;
  gameStatusStore: GameStatusStore;
  freeRoundStore: FreeRoundStore;
}
