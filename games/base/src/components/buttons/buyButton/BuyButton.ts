import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { rootStore } from '@src/stores/RootStore';
import { Button, ButtonContainer } from '@pixi/ui';
import { eventEmitter, POPUPS_EVENTS } from '@lib/events';
import { Phase } from '@src/flow/types';
import { FederatedPointerEvent, Rectangle } from 'pixi.js';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';

export class BuyButton extends SmartContainer {
  protected readonly buyButton = new ButtonContainer();

  private buyButtonSpine = Spine.from({
    skeleton: 'bfButtonData',
    atlas: 'bfButtonAtlas',
  });

  constructor() {
    super({
      portraitData: {
        valign: 'bottom',
        align: 'center',
        viewportHeight: 1920,
        viewportWidth: 1080,
        correctionOffsetY: -260,
        correctionOffsetX: 410,
      },
      landscapeData: {
        valign: 'center',
        align: 'left',
        viewportHeight: 1080,
        viewportWidth: 1920,
        correctionOffsetX: 135,
        correctionOffsetY: -50,
      },
    });

    const { stateMachine } = rootStore;

    this.buyButton.addChild(this.buyButtonSpine);

    this.addChild(this.buyButton);

    this.buyButtonSpine.state.setAnimation(0, 'idle', true);

    this.pointerEvents();

    this.buyButton.onPress.connect((button?: Button, event?: FederatedPointerEvent) => {
      if (
        event?.button === 0 &&
        stateMachine.phase === Phase.Idle &&
        !rootStore.modalStatusStore.isModalWindowOpened &&
        !rootStore.gameStatusStore.isBuyFeatureOpened
      ) {
        rootStore.gameStatusStore.isBuyFeatureOpened = true;
        this.playInAnimation();
        gameSound.playSound(SoundKey.BFButtons);
        eventEmitter.emit(POPUPS_EVENTS.showBuyFeature);
      }
    });

    this.onResize();
  }

  private pointerEvents = (): void => {
    this.buyButton.cursor = 'pointer';
    this.buyButton.hitArea = new Rectangle(-100, -100, 200, 200);
  };

  private playInAnimation(): void {
    this.buyButtonSpine.state.setAnimation(0, 'in', false);
    this.addAnimationListener('in', () => {
      this.playOutAnimation();
    });
  }

  private playOutAnimation(): void {
    this.buyButtonSpine.state.setAnimation(0, 'out', false);
    this.addAnimationListener('out', () => {
      this.buyButtonSpine.state.setAnimation(0, 'idle', true);
    });
  }

  private addAnimationListener(animationName: string, callback: () => void): void {
    const trackEntry = this.buyButtonSpine.state.getCurrent(0);
    if (trackEntry?.animation?.name === animationName) {
      trackEntry.listener = {
        complete: () => {
          callback();
        },
      };
    }
  }

  onResize(): void {
    this.buyButton.scale.set(resizeObject.isPortrait ? 0.75 : 1);
  }

  setIsEnabled(isEnabled: boolean): void {
    this.buyButton.enabled = isEnabled;
    this.buyButton.tint = isEnabled ? 0xffffff : 0x656565;
  }
}
