import { Phase } from '@src/flow/types';
import { rootStore } from '@src/stores/RootStore';
import { AnnouncerTypes } from '@components/modal/announcers/types';
import { eventEmitter, REELS_EVENTS, SPIN_BUTTON_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { GameMode } from '@lib/nework/types';
import { gameSound } from '@src/stores/sound/GameSound';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { SoundKey } from '@lib/sounds/soundsKeys';

export async function freeSpinBonusIdle(): Promise<Phase.FreeSpinBonusShot | Phase.FreeSpinIdle | Phase.EndGame> {
  const { gameStatusStore, dataStore } = rootStore;
  await new Promise<void>((resolve) => {
    if (
      gameSettingStore.isMainSoundsLoaded &&
      !gameSound.isSoundPlaying(gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular)
    ) {
      gameSound.stopSound(SoundKey.MusicFreeSpin);
      gameSound.playSound(gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular);
    }
    if (gameStatusStore.isOnFSBonusMode) {
      if (dataStore.nextGameMode === GameMode.FreespinBonus) {
        resolve();
      } else {
        if (dataStore.nextGameMode === GameMode.Freespin) {
          rootStore.gameStatusStore.setHint(false);
          gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowFS);
        } else {
          rootStore.gameStatusStore.setHint(false);
          eventEmitter.emit(REELS_EVENTS.hideFSBonusObjects);
        }
        eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
          resolve();
        });
      }
    } else {
      gameStatusStore.setShowAnnouncer(true, AnnouncerTypes.ShowFSBonus);
      eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
        gameStatusStore.isOnFSBonusMode = true;
        eventEmitter.emit(SPIN_BUTTON_EVENTS.updateSpinBtnCounterWithoutAnimation, 5);
        resolve();
      });
    }
  });

  switch (dataStore.nextGameMode) {
    case GameMode.FreespinBonus: {
      return Phase.FreeSpinBonusShot;
    }
    case GameMode.Freespin: {
      return Phase.FreeSpinIdle;
    }
    default: {
      return Phase.EndGame;
    }
  }
}
