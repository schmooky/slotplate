import { Phase } from '@src/flow/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function idle({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.Idle> {
  console.log(store.balanceStore.allowedBets);
  await new Promise<void>((resolve) => { setTimeout(() => resolve(), 5000); });

  return Phase.Idle;
}
