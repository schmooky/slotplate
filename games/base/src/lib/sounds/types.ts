import { SoundKey } from '@lib/sounds/soundsKeys';

export interface SoundPack {
  fileName: string;
  soundName: SoundKey;
  loop: boolean;
  volume: number;
  isAmbient?: boolean;
}
