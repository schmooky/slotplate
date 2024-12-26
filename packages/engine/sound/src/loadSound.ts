import { ExtendedHowl } from "./extendedHowl.js";
import { SoundPlayer } from "./SoundPlayer.js";
import { SoundOptions } from "./types.js";

export function loadSound(
  pathToSound: string,
  options: SoundOptions
): Promise<SoundPlayer> {
  return new Promise((resolve) => {
    const howl = new ExtendedHowl({
      src: pathToSound,
      autoplay: false,
      volume: options.volume || 1.0,
      loop: options.loop || false,
      onloaderror: (soundId: number, error: unknown) => {
        window.console.error(
          "sounds on load error: ",
          error,
          "path: ",
          pathToSound
        );
      },
    });
    howl.once("load", () => {
      resolve(new SoundPlayer(howl, { soundName: options.soundName }));
    });
  });
}
