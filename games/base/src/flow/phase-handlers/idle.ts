import { Phase } from '@src/flow/types';
import { eventEmitter, REELS_EVENTS, SPIN_BUTTON_EVENTS, STATE_MACHINE_EVENTS } from '@lib/eventEmminer/events';
import { PhaseHandlerOptions } from '@slotplate/engine/state-machine';
import { IRootStore } from '@src/stores/types';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { gsap } from 'gsap';

let paylinesRepeatDelay: gsap.core.Tween;

export async function idle({ store }: PhaseHandlerOptions<IRootStore>): Promise<Phase.Spin | Phase.BuyFeatureIdle> {
  const { autoplayStore, gameStatusStore, freeRoundStore, dataStore } = store;

  await new Promise<void>((resolve) => {
    if (
      gameSettingStore.isMainSoundsLoaded &&
      !gameSound.isSoundPlaying(gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular)
    ) {
      gameSound.playBackgroundMusic();
    }

    if (autoplayStore.autoPlaySpinsLeft > 0) {
      autoplayStore.decreaseSpinsLeft();
      eventEmitter.emit(SPIN_BUTTON_EVENTS.playStopAnim);

      if (autoplayStore.autoPlaySpinsLeft === 0) {
        autoplayStore.stop();
      }

      resolve();
      return;
    }

    if (freeRoundStore.isOnCampaignState) {
      freeRoundStore.setRoundsLeft((freeRoundStore.roundsLeft as number) - 1);
      resolve();
      return;
    }

    if (dataStore.payLines.length > 0) {
      gameStatusStore.isPaylinesRepeat = true;
      paylinesRepeatDelay = gsap.delayedCall(1.5, () => {
        eventEmitter.emit(REELS_EVENTS.playWinLines);
      });
    }

    eventEmitter.once(STATE_MACHINE_EVENTS.changeState, () => {
      if (gameStatusStore.isPaylinesRepeat) {
        paylinesRepeatDelay.kill();
        eventEmitter.emit(REELS_EVENTS.stopLines);
      }

      resolve();
    });
  });

  if (gameStatusStore.isSymbolPaytableOpened) eventEmitter.emit(REELS_EVENTS.hideSymbolPaytable);

  if (gameStatusStore.isBuyFeatureOpened) return Phase.BuyFeatureIdle;

  return Phase.Spin;
}
