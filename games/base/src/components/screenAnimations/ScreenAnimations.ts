import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { eventEmitter, SCREEN_EVENTS } from '@lib/eventEmminer/events';

export class ScreenAnimations extends SmartContainer {
  private readonly high2 = Spine.from({
    skeleton: 'skipVfxH2',
    atlas: 'skipVfxAtlas',
  });

  constructor() {
    super();

    this.addChild(this.high2);
    this.high2.renderable = false;
    this.setupListeners();
  }

  private setupListeners(): void {
    eventEmitter.on(SCREEN_EVENTS.high2, () => {
      this.high2.renderable = true;
      this.high2.state.setAnimation(0, `${resizeObject.isPortrait ? 'pt' : 'ls'}`, false);
    });

    this.high2.state.addListener({
      complete: () => {
        this.high2.renderable = false;
      },
    });
  }
}
