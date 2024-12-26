import { GlobalSound } from '@slotplate/engine/sound';
import { SoundKey } from '@lib/sounds/soundsKeys';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { reaction } from 'mobx';
import { rootStore } from '@src/stores/RootStore';
import { ReelSymbol } from '@lib/config/config';
import { mainSoundConfig } from '@lib/sounds/mainSoundPack';
import { Phase } from '@src/flow/types';

export class GameSound extends GlobalSound {
  private userInteracted = false;
  protected disposers: (() => void)[] = [];
  protected ambientGainNode = 'ambientGainNode';
  protected fxGainNode = 'fxGainNode';
  private symbolSounds: Map<ReelSymbol, SoundKey> = new Map([
    ['high1', SoundKey.HiSymbol1],
    ['high2', SoundKey.HiSymbol2],
    ['high3', SoundKey.HiSymbol3],
    ['high4', SoundKey.HiSymbol4],
    ['high5', SoundKey.HiSymbol5],
    ['low1', SoundKey.LowSymbol],
    ['low2', SoundKey.LowSymbol],
    ['low3', SoundKey.LowSymbol],
    ['low4', SoundKey.LowSymbol],
    ['wild', SoundKey.Wild],
  ]);

  constructor() {
    super(gameSettingStore);
    this.initializeUserInteractionListener();
    this.createSettingsChangeSoundReaction();
  }

  private initializeUserInteractionListener() {
    const onUserInteraction = () => {
      this.userInteracted = true;
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('User has interacted with screen');
          if (
            gameSettingStore.isSoundEnabled &&
            gameSettingStore.isMainSoundsLoaded &&
            rootStore.stateMachine.phase !== Phase.Splash
          ) {
            this.playAmbience();
            this.playCurrentPhaseSound();
          }
          if (
            gameSettingStore.isSoundEnabled &&
            gameSettingStore.isSplashSoundsLoaded &&
            rootStore.stateMachine.phase === Phase.Splash
          ) {
            this.playAmbience();
            this.playSound(SoundKey.MusicSplash);
          }
        });
      } else {
        console.log('User has interacted with screen');
        if (
          gameSettingStore.isSoundEnabled &&
          gameSettingStore.isMainSoundsLoaded &&
          rootStore.stateMachine.phase !== Phase.Splash
        ) {
          this.playAmbience();
          this.playCurrentPhaseSound();
        }
        if (
          gameSettingStore.isSoundEnabled &&
          gameSettingStore.isSplashSoundsLoaded &&
          rootStore.stateMachine.phase === Phase.Splash
        ) {
          this.playAmbience();
          this.playSound(SoundKey.MusicSplash);
        }
      }
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction);
    window.addEventListener('keydown', onUserInteraction);
  }

  public playSymbolSound(symbol: ReelSymbol): Promise<void> {
    return new Promise((resolve) => {
      if (!this.userInteracted) {
        resolve();
        return;
      }

      if (gameSettingStore.isMainSoundsLoaded) {
        const sound = this.symbolSounds.get(symbol);

        if (sound) {
          if (this.isSoundPlaying(sound)) {
            this.stopSound(sound);
            this.playSound(sound);
            resolve();
          } else {
            this.playSound(sound);
            resolve();
          }
        } else {
          console.warn(`Sound not found for symbol: ${symbol}`);
          resolve();
        }
      }
    });
  }

  playSound(key: SoundKey) {
    if (!this.userInteracted) return;

    if (
      (gameSettingStore.isMainSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded) ||
      (gameSettingStore.isSplashSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded)
    ) {
      console.log(key, 'Playing');
      this.getSound(key)?.play();
    }
  }

  restartSound(key: SoundKey) {
    if (!this.userInteracted) return;

    if (
      (gameSettingStore.isMainSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded) ||
      (gameSettingStore.isSplashSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded)
    ) {
      const sound = this.getSound(key);
      sound?.stop();
      sound?.play();
      console.log(key, 'Playing');
    }
  }

  playAmbience() {
    const maxRetries = 3;
    let retryCount = 0;

    const tryPlay = async () => {
      if (!this.userInteracted || !gameSettingStore.isAmbienceSoundLoaded) {
        return;
      }

      const ambienceSound = this.getSound(SoundKey.Ambience);

      if (ambienceSound) {
        this.playSound(SoundKey.Ambience);
      } else if (retryCount < maxRetries) {
        retryCount += 1;
        await this.loadAmbienceSound();
        await tryPlay();
      }
    };

    tryPlay();
  }

  playSounds(keys: SoundKey[]) {
    if (!this.userInteracted) return;

    if (gameSettingStore.isMainSoundsLoaded) {
      console.log(keys, 'Playing');
      keys.forEach((key) => this.getSound(key)?.play());
    }
  }

  stopSound(key: SoundKey) {
    if (!this.userInteracted) return;

    if (
      (gameSettingStore.isMainSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded) ||
      (gameSettingStore.isSplashSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded)
    ) {
      console.log(key, 'Stopped');
      this.getSound(key)?.stop();
    }
  }

  stopSounds(keys: SoundKey[]) {
    if (gameSettingStore.isMainSoundsLoaded) {
      console.log(keys, 'Stopped');
      keys.forEach((key) => this.getSound(key)?.stop());
    }
  }

  stopActiveSounds(
    keysToExclude: SoundKey[] = [
      SoundKey.Ambience,
      gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular,
    ],
  ) {
    if (
      (gameSettingStore.isMainSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded) ||
      (gameSettingStore.isSplashSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded)
    ) {
      (Object.keys(SoundKey) as Array<keyof typeof SoundKey>)
        .filter((key) => !keysToExclude.includes(SoundKey[key]))
        .forEach((key) => {
          if (!gameSettingStore.isSplashSoundsLoaded && SoundKey[key] === SoundKey.MusicSplash) {
            return;
          }

          try {
            const sound = this.getSound(SoundKey[key]);
            if (sound?.howl.playing()) {
              sound.stop();
              // TODO: удалить лог после того как пройдут тесты
              const { soundName } = sound as never;
              console.log(`Stopped sound: ${soundName ?? 'Unknown sound name'}`);
            }
          } catch (error) {
            console.log('Error stopping sound:', error);
          }
        });
    }
  }

  pauseSound(key: SoundKey) {
    if (gameSettingStore.isMainSoundsLoaded || gameSettingStore.isSplashSoundsLoaded) {
      this.getSound(key)?.howl.pause();
    }
  }

  isSoundPlaying = (key: SoundKey) => {
    if (gameSettingStore.isMainSoundsLoaded || gameSettingStore.isSplashSoundsLoaded) {
      return this.getSound(key)?.howl.playing();
    }
    return false;
  };

  setAmbientVolume(value: number) {
    this.setVolume(value, this.ambientGainNode);
  }

  setFXVolume(value: number) {
    this.setVolume(value, this.fxGainNode);
  }

  playBackgroundMusic() {
    if (
      (gameSettingStore.isMainSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded) ||
      (gameSettingStore.isSplashSoundsLoaded && gameSettingStore.isAmbienceSoundLoaded)
    ) {
      this.stopActiveSounds([]);
      this.playCurrentPhaseSound();
      this.playAmbience();
    }
  }

  playCurrentPhaseSound() {
    const { gameStatusStore } = rootStore;

    if (gameStatusStore.isOnFSMode && !gameStatusStore.isOnFSBonusMode) {
      this.playSound(SoundKey.MusicFreeSpin);
    } else {
      this.playSound(gameSettingStore.isTurboMode ? SoundKey.MusicFastPlay : SoundKey.MusicRegular);
    }
  }

  private createSettingsChangeSoundReaction(): void {
    this.disposers.push(
      reaction(
        () => gameSettingStore.isSoundEnabled,

        (enabled) => {
          this.updateMute();
          if (enabled) {
            this.setAmbientVolume(gameSettingStore.gainNodesVolume.ambientGainNode);
            this.setFXVolume(gameSettingStore.gainNodesVolume.fxGainNode);
          }
        },
      ),
      reaction(
        () => gameSettingStore.gainNodesVolume,
        (value) => {
          this.setAmbientVolume(value.ambientGainNode);
          this.setFXVolume(value.fxGainNode);
        },
      ),
    );
  }

  private async loadMainSounds() {
    return this.loadGroupedSounds(mainSoundConfig, 'sounds/high/');
  }

  async loadAmbienceSound(): Promise<void> {
    if (!gameSettingStore.isAmbienceSoundLoaded) {
      try {
        await this.loadSound(
          'sounds/high/sfx_b_ambience.mp3',
          {
            fileName: 'sfx_b_ambience.mp3',
            soundName: SoundKey.Ambience,
            loop: true,
            volume: 1,
          },
          'ambientGainNode',
        );
        gameSettingStore.isAmbienceSoundLoaded = true;
      } catch (error) {
        console.error('Error loading ambience sound:', error);
        gameSettingStore.isAmbienceSoundLoaded = false;
      }
    }
  }

  async loadMainWithAmbienceSounds() {
    try {
      await Promise.all([this.loadMainSounds(), this.loadAmbienceSound()]);
    } catch (error) {
      console.error('Error loading sounds:', error);
      throw error;
    }
  }

  dispose() {
    this.disposers.forEach((disposer) => disposer());
    this.disposers = [];
    return super.dispose();
  }
}

export const gameSound = new GameSound();
