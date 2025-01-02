import { SmartContainer } from '@slotplate/renderer';
import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { Button, ButtonContainer } from '@pixi/ui';
import { eventEmitter, SPIN_BUTTON_EVENTS } from '@lib/events';
import { gameEventHandler } from '@lib/gameEventHandler/gameEventHandler';
import { rootStore } from '@src/stores/RootStore';
import { BitmapText, Circle, FederatedPointerEvent } from 'pixi.js';

export class SpinButton extends SmartContainer {
  protected readonly spinButton = new ButtonContainer();

  private bitMapText = new BitmapText({
    text: '5',
    style: { fontFamily: 'greenFont', fontSize: 45 },
  });

  constructor() {
    super({
      portraitData: {
        valign: 'bottom',
        align: 'center',
        viewportHeight: 1920,
        viewportWidth: 1080,
        correctionOffsetY: -300,
      },
      landscapeData: {
        valign: 'center',
        align: 'right',
        viewportHeight: 1080,
        viewportWidth: 1920,
        correctionOffsetX: -175,
        correctionOffsetY: 50,
      },
    });

    this.spinButton.addChild(
      Spine.from({
        skeleton: 'spinButtonData',
        atlas: 'spinButtonAtlas',
      }),
    );

    this.spinButton.onPress.connect((button?: Button, event?: FederatedPointerEvent) => {
      if (event?.button === 0) {
        gameEventHandler.onBtnSpinClick();
      }
    });

    this.spinButton.hitArea = new Circle(0, 0, 125);

    this.addChild(this.spinButton);

    (this.spinButton.children[0] as Spine).state.setAnimation(
      0,
      `idle_${rootStore.gameStatusStore.isOnFSMode ? 'fs' : 'regular'}`,
      true,
    );

    eventEmitter.on(SPIN_BUTTON_EVENTS.playSpinAnim, () => {
      (this.spinButton.children[0] as Spine).state.setAnimation(
        1,
        `spin_${rootStore.gameStatusStore.isOnFSMode ? 'fs' : 'reguar'}`,
      );
    });

    eventEmitter.on(SPIN_BUTTON_EVENTS.playStopAnim, () => {
      if (rootStore.gameStatusStore.isOnFSMode) return;

      (this.spinButton.children[0] as Spine).state.clearTracks();
      (this.spinButton.children[0] as Spine).skeleton.setToSetupPose();
      (this.spinButton.children[0] as Spine).state.setAnimation(3, 'spin_stop');
    });

    eventEmitter.on(SPIN_BUTTON_EVENTS.playIdleAnim, (animationName: string) => {
      if (animationName === 'idle_regular' && rootStore.gameStatusStore.isOnFSMode) return;

      (this.spinButton.children[0] as Spine).state.clearTracks();
      (this.spinButton.children[0] as Spine).skeleton.setToSetupPose();
      (this.spinButton.children[0] as Spine).state.setAnimation(0, animationName, true);
    });

    this.addSpinButtonCounter();
    this.setupListeners();
  }

  private addSpinButtonCounter(): void {
    this.bitMapText.anchor.set(0.5, 1.4);
    this.bitMapText.text = SpinButton.getCounterValue();
    (this.spinButton.children[0] as Spine).addSlotObject('numb', this.bitMapText);
  }

  private setupListeners() {
    (this.spinButton.children[0] as Spine).state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'spin_stop') {
          (this.spinButton.children[0] as Spine).state.setAnimation(0, 'spin_stop_idle');
        }
      },
    });
    eventEmitter.on(SPIN_BUTTON_EVENTS.decrementSpinBtnCounter, this.decrementCounter);
    eventEmitter.on(SPIN_BUTTON_EVENTS.updateSpinBtnCounterWithoutAnimation, (newValue: number) => {
      this.bitMapText.text = newValue;
    });
  }

  private decrementCounter = (newCount: number) => {
    this.bitMapText.text = newCount;
  };

  private static getCounterValue(): string {
    const { isOnFSMode, isOnFSBonusMode, isOnCWBonusMode } = rootStore.gameStatusStore;
    const { freeSpinsCount, cwSpinsCount, fsBonusShootResult } = rootStore.dataStore;
    const hitsRemainingInitCount = '5';

    if (isOnFSMode && !isOnFSBonusMode) {
      return `${freeSpinsCount}`;
    }

    if (isOnFSBonusMode) {
      return fsBonusShootResult ? `${fsBonusShootResult.hitsRemaining}` : hitsRemainingInitCount;
    }

    if (isOnCWBonusMode) {
      return `${cwSpinsCount}`;
    }

    return '';
  }

  public setEnabled(isEnabled: boolean): void {
    this.spinButton.interactive = isEnabled;
    this.spinButton.alpha = isEnabled ? 1 : 0.75;
  }
}
