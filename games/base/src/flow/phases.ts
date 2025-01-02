import { Phase } from '@src/flow/types';
import { IRootStore } from '@src/stores/types';
import { init } from '@src/flow/phase-handlers/init';
import { preload } from '@src/flow/phase-handlers/preload';
import { idle } from '@src/flow/phase-handlers/idle';
import { PhaseHandlers } from '@slotplate/engine/state-machine';


export const phaseHandlers: PhaseHandlers<Phase, IRootStore> = {
  [Phase.Init]: init,
  [Phase.Preload]: preload,
  [Phase.Idle]: idle,
};
