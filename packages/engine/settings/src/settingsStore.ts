import { action, makeObservable, observable } from "mobx";
import { ISettingsStore } from "./types.js";

export class SettingsStore implements ISettingsStore {
  private readonly NODE_ENV: string;

  /**
   * Creates an instance of SettingsStore.
   * @param {string} gameId - The unique identifier for the game.
   * @param {string} NODE_ENV - The environment indicating the current mode of the application.
   */
  public constructor(
    private gameId: string,
    NODE_ENV: string = "development"
  ) {
    this.NODE_ENV = NODE_ENV;

    makeObservable(this, {
      isSoundEnabled: observable,
      isSpaceBarToSpin: observable,
      setIsSoundsEnabled: action.bound,
      setIsSpaceBarToSpin: action.bound,
    });

    this.loadSettings();
  }

  /** Flag indicating whether sound is enabled. */
  public isSoundEnabled = false;

  /** Flag indicating whether the spacebar triggers spin action. */
  public isSpaceBarToSpin = true;

  /**
   * Reads a value from local storage.
   * @template T - The type of the value to be readLocalStore.
   * @param {string} key - The key for the value in local storage.
   * @param {T} defaultValue - The default value to be returned if the key is not found.
   * @returns {T} The value retrieved from local storage.
   */
  public readLocalStore<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === "undefined") return defaultValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      if (this.NODE_ENV !== "production") console.error(err);
      return defaultValue;
    }
  }

  /**
   * Writes a value to local storage.
   * @param {string} key - The key for the value in local storage.
   * @param {boolean} value - The value to be written to local storage.
   */
  public writeLocalStore(key: string, value: boolean): void {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      if (this.NODE_ENV !== "production") console.error(err);
    }
  }

  /**
   * Sets the flag indicating whether sound is enabled.
   * @param {boolean} newValue - The new value for sound enablement.
   */
  public setIsSoundsEnabled(newValue: boolean): void {
    this.isSoundEnabled = newValue;
    this.writeLocalStore(`${this.gameId}-isSoundEnabled`, newValue);
  }

  /**
   * Sets the flag indicating whether the spacebar triggers spin action.
   * @param {boolean} newValue - The new value for spacebar action.
   */
  public setIsSpaceBarToSpin(newValue: boolean): void {
    this.isSpaceBarToSpin = newValue;
    this.writeLocalStore(`${this.gameId}-isSpaceBarToSpin`, newValue);
  }

  /**
   * Loads settings from local storage.
   */
  private loadSettings(): void {
    this.isSoundEnabled = this.readLocalStore(
      `${this.gameId}-isSoundEnabled`,
      this.isSoundEnabled
    );
    this.isSpaceBarToSpin = this.readLocalStore(
      `${this.gameId}-isSpaceBarToSpin`,
      this.isSpaceBarToSpin
    );
  }
}
