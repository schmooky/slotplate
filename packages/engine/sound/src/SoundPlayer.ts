import { ExtendedHowl } from "./extendedHowl.js";
import { SoundTracingEvent } from "./types.js";

export class SoundPlayer {
  protected defaultDuration: number;

  public howl: ExtendedHowl;

  protected soundName?: string;

  constructor(howl: ExtendedHowl, options?: { soundName?: string }) {
    this.defaultDuration = 1000;
    this.howl = howl;
    this.soundName = options?.soundName;

    this.addTracingEvents();
  }

  public play(isPlaying: boolean = false): void {
    if (!this.howl.playing() || isPlaying) {
      this.howl.play();
    }
  }

  /**
   * Smooth sound volume fading
   * @param {number} duration - fade out duration in milliseconds.
   * @param {boolean} pause - determine whether sound should be stopped or paused
   */
  public fadeOut(duration: number = this.defaultDuration, pause = false): void {
    if (!this.howl.playing()) {
      this.howl.stop();
    } else {
      this.howl.fade(1, 0, duration);
      this.howl.once("fade", () =>
        pause ? this.howl.pause() : this.howl.stop()
      );
    }
  }

  /**
   * Smooth increase in sound volume
   * @param {number} duration - fade out duration in milliseconds.
   */
  public fadeIn(duration: number = this.defaultDuration): void {
    if (!this.howl.playing()) {
      this.howl.play();
    }
    this.howl.fade(0, 1, duration);
  }

  public stop(): void {
    this.howl.stop();
  }

  private addTracingEvents() {
    if (!this.soundName)
      // eslint-disable-next-line no-console
      return console.error(
        "%c@slotplate/network: Can't trace howl without soundName",
        "font-weight:bold;color:red;"
      );

    if (window.location.search.indexOf("sound-tracing=true") === -1) return;

    this.howl.on("pause", (id) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.Pause, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
          },
        })
      );
    });

    this.howl.on("play", (id) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.Play, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
          },
        })
      );
    });

    this.howl.on("playerror", (id, error) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.PlayError, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
            error,
          },
        })
      );
    });

    this.howl.on("stop", (id) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.Stop, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
          },
        })
      );
    });

    this.howl.on("end", (id) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.End, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
          },
        })
      );
    });

    this.howl.on("fade", (id) => {
      window.dispatchEvent(
        new CustomEvent(SoundTracingEvent.Fade, {
          detail: {
            soundName: this.soundName,
            id,
            time: Date.now(),
          },
        })
      );
    });
  }
}
