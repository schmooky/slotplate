import { Phase } from '@src/flow/types';
import { IRootStore } from '@src/stores/types';
import { init } from '@src/flow/phase-handlers/init';
import { preload } from '@src/flow/phase-handlers/preload';
import { splash } from '@src/flow/phase-handlers/splash';
import { idle } from '@src/flow/phase-handlers/idle';
import { PhaseHandlers } from '@slotplate/engine/state-machine';
import { spin } from '@src/flow/phase-handlers/spin';
import { stopSpin } from '@src/flow/phase-handlers/stopSpin';
import { winLines } from '@src/flow/phase-handlers/winLines';
import { winShow } from '@src/flow/phase-handlers/winShow';
import { cloningWild } from '@src/flow/phase-handlers/cloningWild';
import { mysteryFeature } from '@src/flow/phase-handlers/mysteryFeature';
import { mysterySpin } from '@src/flow/phase-handlers/mysterySpin';
import { mysteryFeatureChoose } from '@src/flow/phase-handlers/mysteryFeatureChoose';
import { high2 } from '@src/flow/phase-handlers/high2';
import { wild } from '@src/flow/phase-handlers/wild';
import { freeSpinIdle } from '@src/flow/phase-handlers/freeSpinIdle';
import { freeSpinSpin } from '@src/flow/phase-handlers/freeSpinSpin';
import { freeSpinBonusShot } from '@src/flow/phase-handlers/freeSpinBonusShot';
import { freeSpinBonusIdle } from '@src/flow/phase-handlers/freeSpinBonusIdle';
import { endGame } from '@src/flow/phase-handlers/endGame';
import { buyFeatureIdle } from '@src/flow/phase-handlers/buyFeatureIdle';
import { freeRoundCampaign } from '@src/flow/phase-handlers/freeRoundCampaign';

export const phaseHandlers: PhaseHandlers<Phase, IRootStore> = {
  [Phase.Init]: init,
  [Phase.Preload]: preload,
  [Phase.Splash]: splash,
  [Phase.FreeRoundCampaign]: freeRoundCampaign,
  [Phase.Idle]: idle,
  [Phase.BuyFeatureIdle]: buyFeatureIdle,
  [Phase.Spin]: spin,
  [Phase.StopSpin]: stopSpin,
  [Phase.CloningWild]: cloningWild,
  [Phase.High2]: high2,
  [Phase.Wild]: wild,
  [Phase.WinLines]: winLines,
  [Phase.WinShow]: winShow,
  [Phase.MysteryFeature]: mysteryFeature,
  [Phase.MysterySpin]: mysterySpin,
  [Phase.MysteryFeatureChoose]: mysteryFeatureChoose,
  [Phase.FreeSpinIdle]: freeSpinIdle,
  [Phase.FreeSpinSpin]: freeSpinSpin,
  [Phase.FreeSpinBonusIdle]: freeSpinBonusIdle,
  [Phase.FreeSpinBonusShot]: freeSpinBonusShot,
  [Phase.EndGame]: endGame,
};
