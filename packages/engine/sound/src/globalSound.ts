import { Howler } from "howler";
import { SoundPlayer } from "./SoundPlayer.js";
import { GainNodesConfig, IExtendedSound, SoundOptions } from "./types.js";
import { loadSound } from "./loadSound.js";

/**
 * Sound settings configuration.
 * @typedef {Object} SoundSettings
 * @property {boolean} isSoundEnabled - Indicates whether the sound is enabled.
 */
// todo rework interface
interface SoundSettings {
  isSoundEnabled: boolean;
  gainNodesVolume: { [key: string]: number };
}

/**
 * Manages global sound settings, including individual gain nodes and visibility state for muting.
 */
export class GlobalSound {
  protected settings: SoundSettings;

  protected gainNodes: Map<string, GainNode>;

  protected audioContext: AudioContext;

  protected sounds: Map<string, SoundPlayer> = new Map();

  /**
   * Initializes a new instance of the GlobalSound class.
   * @param {SoundSettings} settings - Sound settings including the initial mute state.
   */
  // todo rework constructor
  constructor(settings: SoundSettings) {
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.settings = settings;
    this.gainNodes = new Map();
    this.audioContext = Howler.ctx;
    this.addTabVisibilityHandler();
    this.updateMute();
  }

  /**
   * Loads sounds assets according provided config
   * @param {GainNodesConfig} config - Gain nodes sound options list.
   * @param {string} globalPath - Remote folder path.
   * @param onProgress - Calback which triggered on single file loaded.
   */
  public async loadGroupedSounds(
    config: GainNodesConfig,
    globalPath: string,
    onProgress?: (loadedSounds: string[]) => void
  ) {
    this.audioContext = Howler.ctx;

    const loadedSounds: string[] = [];
    const handleProgress = !onProgress
      ? undefined
      : (loadedSound: string) => {
          loadedSounds.push(loadedSound);
          onProgress(loadedSounds);
        };

    const promises = Object.entries(config).reduce<Promise<SoundPlayer>[]>(
      (current, [nodeName, soundsOptions]) => {
        return [
          ...current,
          ...soundsOptions.map((s) =>
            this.loadSound(globalPath + s.fileName, s, nodeName, handleProgress)
          ),
        ];
      },
      []
    );
    return Promise.all(promises);
  }

  /**
   * Loads sound assets according options and connects it to gain node.
   * @param {string} path - Remote file path.
   * @param {SoundOptions} sound - sound configuration options.
   * @param {string} nodeName - Gain node name.
   * @param onProgress - Calback which triggered on single file loaded.
   * @returns {Promise<void>[]} Promise<void>[].
   */
  public loadSound(
    path: string,
    sound: SoundOptions,
    nodeName: string,
    onProgress?: (loadedSound: string) => void
  ): Promise<SoundPlayer> {
    const loader = loadSound(path, sound);

    if (!this.gainNodes.has(nodeName)) {
      this.createGainNode(nodeName);
    }

    loader.then((loadSound: SoundPlayer) => {
      this.sounds.set(sound.soundName, loadSound);
      this.connectGainNode(loadSound, nodeName);
      if (onProgress) {
        onProgress(sound.soundName);
      }
    });

    return loader;
  }

  /**
   * Allows you to get `SoundPlayer` instance
   * @param {string} soundName - name of sound  you want to get.
   * @returns instance of `SoundPlayer` or undefined.
   */
  public getSound(soundName: string) {
    const sound = this.sounds.get(soundName);

    if (sound) {
      return sound;
    }
    // eslint-disable-next-line no-console
    console.error(`Unable to get ${soundName} as it wasn't loaded`);
  }

  /**
   * Checks if gain nodes have been created.
   * @returns {boolean} True if gain nodes are created, otherwise false.
   */
  public get areGainNodesCreated(): boolean {
    return this.gainNodes.size > 0;
  }

  /**
   * Creates gain nodes for each specified node name.
   * @param {string[]} nodeName - The names of nodes for which to create gain nodes.
   * @returns {boolean} True if gain nodes were successfully created, otherwise false.
   */
  public createGainNode(nodeName: string): boolean {
    if (!nodeName) return false;
    this.audioContext = Howler.ctx;
    const gainNode = this.audioContext.createGain();
    gainNode.connect(this.audioContext.destination);
    this.gainNodes.set(nodeName, gainNode);

    return true;
  }

  /**
   * Connects a SoundPlayer to a specific gain node by name. This method explicitly disconnects the sound
   * from the default `Howler.masterGain` by connecting it to a custom gain node, allowing for individual
   * control over the volume of this sound separate from the global Howler volume control. This is particularly
   * useful when you need to manage the volume of specific sounds independently, such as in a complex audio
   * application where sounds may need to be grouped or have their volumes adjusted dynamically without affecting
   * the global volume set by Howler.
   *
   * @param {SoundPlayer} soundPlayer - The SoundPlayer to connect.
   * @param {string} nodeName - The name of the gain node to connect to.
   * @returns {boolean} True if the connection was successful, otherwise false. The connection might fail if the
   * specified gain node does not exist or if the SoundPlayer's underlying Howl object is not using Web Audio API
   * (which is necessary for this kind of manipulation).
   */
  public connectGainNode(soundPlayer: SoundPlayer, nodeName: string): boolean {
    const gainNode = this.gainNodes.get(nodeName);
    if (!gainNode || !soundPlayer.howl.webAudio) {
      return false;
    }

    soundPlayer.howl.sounds.forEach((sound: IExtendedSound) => {
      if (sound._node) {
        // Disconnects the sound from the Howler.masterGain node, which is the default routing for all sounds.
        sound._node.disconnect();
        // Connects the sound to the specified custom gain node for independent volume control.
        sound._node.connect(gainNode);
      }
    });
    return true;
  }

  public setVolume(volume: number, nodeName?: string): void {
    if (this.areGainNodesCreated && nodeName) {
      this.setNodeVolume(volume, nodeName);
    } else {
      this.setHowlerVolume(volume);
    }
  }

  /**
   * Sets the volume for a specific gain node or globally for Howler.
   * @param {number} volume - The volume level to set (0.0 to 1.0).
   * @param {string} [nodeName] - Optional. The name of the gain node to set volume for.
   */
  protected setNodeVolume(volume: number, nodeName: string): void {
    if (this.gainNodes.size > 0) {
      const gainNode = this.gainNodes.get(nodeName);
      if (gainNode) {
        gainNode.gain.value = volume;
      }
    }
  }

  /**
   * Sets the volume  for Howler.
   * @param {number} volume - The volume level to set (0.0 to 1.0).
   */
  // eslint-disable-next-line class-methods-use-this
  protected setHowlerVolume(volume: number): void {
    const resultValue = Math.min(1, Math.max(0, volume));
    if (!Number.isNaN(resultValue)) Howler.volume(resultValue);
  }

  /**
   * Adds an event listener for the visibility change event to handle muting.
   */
  protected addTabVisibilityHandler(): void {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  /**
   * Updates the mute for sound.
   */
  public updateMute(): void {
    if (this.areGainNodesCreated) {
      return this.updateNodesMute();
    }
    this.updateHowlerMute();
  }

  // eslint-disable-next-line class-methods-use-this
  protected isTabVisible() {
    return document.visibilityState === "visible";
  }

  /**
   * Handles the browser tab visibility change event.
   */
  protected onVisibilityChange(): void {
    if (this.isTabVisible()) {
      // for resume sounds in Safari IOS,
      // for some reason when user collapse browser and open it again this.audioContext.state return "interrupted" first
      // and after few moments it setted to "suspendent"
      // resuming audio from "interrupted" state causing "Failed to start the audio device" exception and it is impossible to resume audio after that
      // tried to subscribe on audioContext.statechange but it causes unexpected behavior on other platforms;
      setTimeout(() => this.audioContext.resume(), 200);
    } else {
      this.audioContext.suspend();
    }
  }

  /**
   * Updates the mute for gain nodes. State based on the visibility of the tab and sound settings.
   */
  protected updateNodesMute(): void {
    const shouldBeMuted = !this.isTabVisible() || !this.settings.isSoundEnabled;

    this.gainNodes.forEach((gainNode, nodeName) => {
      if (shouldBeMuted) {
        // eslint-disable-next-line no-param-reassign
        gainNode.gain.value = 0;
      } else {
        // eslint-disable-next-line no-param-reassign
        gainNode.gain.value = this.settings.gainNodesVolume[nodeName] as number;
      }
    });
  }

  /**
   * Updates the mute for Howler. State based on the visibility of the tab and sound settings.
   */
  protected updateHowlerMute(): void {
    const shouldBeMuted = !this.isTabVisible() || !this.settings.isSoundEnabled;
    Howler.mute(shouldBeMuted);
  }

  /**
   * Disposes the instance by closing the AudioContext and clearing resources. Closes the AudioContext asynchronously,
   * then removes the visibility change listener and clears gain nodes. Ensures clean up of audio and event resources
   * to prevent memory leaks.
   *
   * @returns {Promise<void>} A promise that resolves after the AudioContext has closed and resources have been cleaned.
   */
  public dispose(): Promise<void> {
    return this.audioContext.close().then(() => {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.gainNodes.clear();
    });
  }
}
