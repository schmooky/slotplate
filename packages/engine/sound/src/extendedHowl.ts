import type { HowlOptions, SoundSpriteDefinitions } from "howler";
import { Howl } from "howler";
import { IExtendedHowl, IExtendedSound } from "./types.js";

export class ExtendedHowl extends Howl implements IExtendedHowl {
  public _webAudio!: boolean;

  public _sounds!: IExtendedSound[];

  public _sprite!: SoundSpriteDefinitions;

  private get sprite(): SoundSpriteDefinitions {
    return this._sprite;
  }

  public get webAudio(): boolean {
    return this._webAudio;
  }

  public get sounds(): IExtendedSound[] {
    return this._sounds;
  }

  public hasSprite = (spriteKey: string | number): boolean =>
    this.sprite[spriteKey] !== undefined;

  public hasLoop = (spriteKey: string | number): boolean => {
    const sprite = this.sprite[spriteKey];
    return sprite?.length === 3 && !!this.sprite[3];
  };
}
