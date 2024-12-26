import { Howl, SoundSpriteDefinitions } from "howler";

export type SimpleHandler = () => void;
export type Nullable<T> = T | null;
export type ResultHandler = () => true;

export interface IExtendedSound {
  _id: number;
  _node?: AudioBufferSourceNode | MediaElementAudioSourceNode;
}

export interface IExtendedHowl extends Howl {
  _webAudio: boolean;
  _sounds: IExtendedSound[];
  _sprite: SoundSpriteDefinitions;
}

export interface SoundOptions {
  fileName: string;
  soundName: string;
  loop: boolean;
  volume?: number;
}

export type GainNodesConfig = Record<string, SoundOptions[]>;

// Tracing
export enum SoundTracingEvent {
  Pause = "sound-tracing:pause",
  Play = "sound-tracing:play",
  PlayError = "sound-tracing:play-error",
  Stop = "sound-tracing:stop",
  End = "sound-tracing:end",
  Fade = "sound-tracing:fade",
}
