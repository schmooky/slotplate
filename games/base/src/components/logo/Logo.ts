import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine } from '@esotericsoftware/spine-pixi-v8';

export class Logo extends SmartContainer {
  private readonly logo = Spine.from({
    skeleton: 'logoData',
    atlas: 'logoAtlas',
  });

  constructor() {
    super({
      portraitData: {
        viewportWidth: 1080,
        viewportHeight: 1920,
        correctionOffsetY: -815,
      },
      landscapeData: {
        viewportWidth: 1920,
        viewportHeight: 1080,
        correctionOffsetX: -500,
        correctionOffsetY: -470,
      },
    });
    this.logo.state.setAnimation(0, 'idle', true);
    this.addChild(this.logo);
    this.onResize();
  }

  onResize() {
    this.logo.scale.set(resizeObject.isPortrait ? 1 : 0.9);
  }
}
