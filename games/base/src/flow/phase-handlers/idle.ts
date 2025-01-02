import { Phase } from '@src/flow/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';

export async function idle({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.Spin | Phase.BuyFeatureIdle> {
  await new Promise<void>((resolve) => {
    if (false) {
      resolve();
      return;
    }
  });

  return Phase.Spin;
}
