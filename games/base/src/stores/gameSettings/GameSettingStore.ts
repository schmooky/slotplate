import { SettingsStore } from '@slotplate/engine/settings';
import { gameId } from '@lib/config/config';
import { action, makeObservable, observable } from 'mobx';

export class GameSettingStore extends SettingsStore {
  isTurboMode = this.readLocalStore(`${gameId}-isTurboMode`, false);

  isMainSoundsLoaded = false;

  isSplashSoundsLoaded = false;

  isLoadingSoundsInProgress = false;

  isAmbienceSoundLoaded = false;

  gainNodesVolume = {
    ambientGainNode: 1,
    fxGainNode: 1,
  };

  constructor() {
    super(gameId);

    makeObservable(this, {
      isTurboMode: observable,
      gainNodesVolume: observable,
      isLoadingSoundsInProgress: observable,
      setIsTurboMode: action,
      setIsLoadingSoundsInProgress: action,
    });
  }

  setIsTurboMode(isTurboMode: boolean) {
    this.isTurboMode = isTurboMode;
    this.writeLocalStore(`${gameId}-isTurboMode`, isTurboMode);
  }

  setIsLoadingSoundsInProgress(newValue: boolean) {
    this.isLoadingSoundsInProgress = newValue;
  }
}

export const gameSettingStore = new GameSettingStore();
