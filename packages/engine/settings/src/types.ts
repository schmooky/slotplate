export interface ISettingsStore {
  readonly isSoundEnabled: boolean;
  readonly isSpaceBarToSpin: boolean;

  readLocalStore<T>(key: string, defaultValue: T): T;
  writeLocalStore(key: string, value: boolean): void;
  setIsSoundsEnabled(newValue: boolean): void;
  setIsSpaceBarToSpin(newValue: boolean): void;
}
