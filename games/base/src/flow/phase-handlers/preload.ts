import { Phase } from '@src/flow/types';
import { assetsLoader } from '@lib/assetsLoader/assetsLoader';
import { GameBundle } from '@assets/bundles';

export async function preload(): Promise<Phase.Splash> {
  await assetsLoader.loadBundle(GameBundle.PRELOAD);
  return Phase.Splash;
}
