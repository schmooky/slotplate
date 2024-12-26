import { resizeObject, SmartContainer } from '@gambit/game-renderer';
import { orientation } from '@lib/utils/orientation';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export class Background extends SmartContainer {
  private readonly background = Spine.from({
    skeleton: 'bgData',
    atlas: 'bgAtlas',
  });

  private isPortrait = resizeObject.isPortrait;

  constructor() {
    super();
    this.background.state.setAnimation(0, `idle_${orientation()}`, true);
    this.addChild(this.background);
  }

  playBackgroundAnim(isPortrait: boolean): void {
    if (this.isPortrait !== isPortrait) {
      this.isPortrait = isPortrait;
      this.background.state.clearTracks();
      this.background.skeleton.setToSetupPose();
      this.background.state.setAnimation(0, `idle_${orientation()}`, true);
    }
  }
}
