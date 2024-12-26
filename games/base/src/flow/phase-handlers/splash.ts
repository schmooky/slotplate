import { Phase } from '@src/flow/types';
import { assetsLoader } from '@lib/assetsLoader/assetsLoader';
import { GameBundle } from '@assets/bundles';
import { Globals } from '@lib/Globals';
import { MainScene } from '@components/mainScene/MainScene';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { handleSessionResponse, network } from '@lib/nework/nework';
import { GameMode, GameSessionResponse } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';
import { TranslationService } from '@gambit/react-components';
import { reactTranslation } from '@src/reactComponents/reactModalWindows/utils/reactUtils';
import { gameSound } from '@src/stores/sound/GameSound';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';

export async function splash({
  store,
}: PhaseHandlerOptions<IRootStore>): Promise<
  | Phase.Idle
  | Phase.FreeRoundCampaign
  | Phase.MysteryFeatureChoose
  | Phase.MysteryFeature
  | Phase.FreeSpinIdle
  | Phase.FreeSpinBonusIdle
> {
  const { statusStore, dataStore, errorStore, assetsStore, freeRoundStore } = store;

  await Promise.all([
    new Promise<void>(async (resolve) => {
      if (gameSettingStore.isSoundEnabled) {
        gameSound.playAmbience();
        gameSound.playSound(SoundKey.MusicSplash);

        gameSound
          .loadMainWithAmbienceSounds()
          .then(() => {
            gameSettingStore.isMainSoundsLoaded = true;
          })
          .catch((error) => {
            console.error('Error loading sounds:', error);
            gameSettingStore.isMainSoundsLoaded = false;
          });
      }
      resolve();
    }),

    new Promise<void>((resolve) => {
      simpleLocalize.onTranslationsLoaded(() => {
        resolve();
      });
    }),
    network.gameRequest<GameSessionResponse>({ requestType: 'session' }).then((response) => {
      if (response.status === RequestStatus.Done && response.data) {
        handleSessionResponse(response.data);
      }
    }),
    assetsLoader.loadBundle(GameBundle.MAIN, (progress) => {
      assetsStore.assetsProgress = progress;
    }),
  ]);

  AnalyticsManager.instance.logGameLoaded();

  TranslationService.getInstance().addTranslations(reactTranslation());
  Globals.scene?.start(new MainScene());
  window.removeEventListener('offline', errorStore.setConnectionError);
  statusStore.setIsGameStarted(true);

  gameSound.stopSound(SoundKey.Ambience);
  gameSound.stopSound(SoundKey.MusicSplash);

  switch (dataStore.nextGameMode) {
    case GameMode.MysteryFeature: {
      return Phase.MysteryFeature;
    }
    case GameMode.MysteryFeatureChosen: {
      return Phase.MysteryFeatureChoose;
    }
    case GameMode.CloningWildBuyFeature:
    case GameMode.Freespin: {
      return Phase.FreeSpinIdle;
    }
    case GameMode.FreespinBonus: {
      return Phase.FreeSpinBonusIdle;
    }
    default: {
      if (freeRoundStore.campaignId) {
        return Phase.FreeRoundCampaign;
      }

      return Phase.Idle;
    }
  }
}
