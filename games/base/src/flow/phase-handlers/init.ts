import { Phase } from '@src/flow/types';
import { assetsLoader } from '@lib/assetsLoader/assetsLoader';
import { bundles } from '@assets/bundles';
import { IRootStore } from '@src/stores/types';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { gameSound } from '@src/stores/sound/GameSound';
import { splashScreenSoundConfig } from '@lib/sounds/splashScreenSoundPack';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';

export async function init({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.Preload> {
  const { dataStore, errorStore } = store;

  window.addEventListener('offline', errorStore.setConnectionError);

  await assetsLoader.init(bundles);
  const url = new URLSearchParams(window.location.search);
  const sessionId = url.get('sessionId');

  // i18n.changeLanguage(url.get('lng')?.toLowerCase() || 'en');

  if (sessionId) {
    dataStore.sessionId = sessionId;
  } else {
    throw new Error('No sessionId provided');
  }

  dataStore.lobbyUrl = url.get('lob') ?? '';

  if (gameSettingStore.isSoundEnabled && !gameSettingStore.isSplashSoundsLoaded) {
    await gameSound.loadGroupedSounds(splashScreenSoundConfig, 'sounds/high/');
    await gameSound.loadAmbienceSound();

    gameSettingStore.isSplashSoundsLoaded = true;
  }

  return Phase.Preload;
}
