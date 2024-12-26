import { Container } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export class Paylines extends Container {
  private payline = Spine.from({
    skeleton: 'payLinesData',
    atlas: 'payLinesAtlas',
  });

  constructor() {
    super();
    this.addChild(this.payline);
  }

  playPaylineAnim(isPortrait: boolean, id: string): void {
    this.payline.state.setAnimation(0, `${isPortrait ? 'pt' : 'ls'}_payline${id}`);
  }

  clearState(): void {
    this.payline.state.clearTracks();
    this.payline.skeleton.setToSetupPose();
  }
}
