import { Phase } from '@src/flow/types';
import {
  eventEmitter,
  FREE_SPIN_EVENTS,
  SPIN_BUTTON_EVENTS,
  STATE_MACHINE_EVENTS,
} from '@lib/eventEmminer/events';
import { rootStore } from '@src/stores/RootStore';
import { AnnouncerTypes } from '@components/modal/announcers/types';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';

export async function freeSpinIdle(): Promise<Phase.FreeSpinSpin> {
  const { gameStatusStore } = rootStore;
  await new Promise<void>((resolve) => {
    if (gameStatusStore.isOnFSMode || gameStatusStore.isOnCWBonusMode) {
      if (!gameStatusStore.isOnCWBonusMode && !gameStatusStore.showFSLayout) {
        eventEmitter.emit(FREE_SPIN_EVENTS.showFreeSpin);
        gameStatusStore.showFSLayout = true;
      }

      if (gameStatusStore.isOnCWBonusMode && !gameStatusStore.showCWLayout) {
        eventEmitter.emit(SPIN_BUTTON_EVENTS.playIdleAnim, 'idle_fs');
        gameStatusStore.showCWLayout = true;
        gameSound.playSound(gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular);
      }

      if (
        gameSettingStore.isMainSoundsLoaded &&
        !gameStatusStore.isOnCWBonusMode &&
        !gameSound.isSoundPlaying(SoundKey.MusicFreeSpin)
      ) {
        gameSound.playBackgroundMusic();
      }

      resolve();
    } else {
      gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowFS);
      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        gameStatusStore.isOnFSMode = true;
        if (gameSettingStore.isMainSoundsLoaded && !gameStatusStore.isOnCWBonusMode) {
          gameSound.playBackgroundMusic();
        }
        resolve();
      });
    }
  });

  return Phase.FreeSpinSpin;
}
