import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { resizeObject, SmartContainer } from '@gambit/game-renderer';
import { eventEmitter, FREE_SPIN_EVENTS, SPIN_BUTTON_EVENTS } from '@lib/eventEmminer/events';
import { rootStore } from '@src/stores/RootStore';

export class FreeSpinLayout extends SmartContainer {
  private topLeftSpine = FreeSpinLayout.createSpine('hudFSData');
  private topRightSpine = FreeSpinLayout.createSpine('hudFSData');
  private bottomLeftSpine = FreeSpinLayout.createSpine('hudFSData');
  private bottomRightSpine = FreeSpinLayout.createSpine('hudFSData');

  private topLeftSmoke = Spine.from({
    skeleton: 'fsSmokeData',
    atlas: 'fsSmokeAtlas',
  });

  private topRightSmoke = Spine.from({
    skeleton: 'fsSmokeData',
    atlas: 'fsSmokeAtlas',
  });

  private bottomLeftSmoke = Spine.from({
    skeleton: 'fsSmokeData',
    atlas: 'fsSmokeAtlas',
  });

  private bottomRightSmoke = Spine.from({
    skeleton: 'fsSmokeData',
    atlas: 'fsSmokeAtlas',
  });

  constructor() {
    super();

    this.setupListeners();
    this.setupContainers();
    this.setFreeSpinPosition();

    if (rootStore.gameStatusStore.isOnFSMode) {
      rootStore.gameStatusStore.showFSLayout = true;
      this.onShowFreeSpin();
    }
  }

  private static createSpine(skeleton: string): Spine {
    return Spine.from({
      skeleton,
      atlas: 'popupAtlas',
    });
  }

  private setupContainers() {
    this.addChild(
      this.topLeftSpine,
      this.topRightSpine,
      this.bottomLeftSpine,
      this.bottomRightSpine,
      this.topLeftSmoke,
      this.topRightSmoke,
      this.bottomLeftSmoke,
      this.bottomRightSmoke,
    );
  }

  private setupListeners = () => {
    eventEmitter.on(FREE_SPIN_EVENTS.showFreeSpin, this.onShowFreeSpin);
    eventEmitter.on(FREE_SPIN_EVENTS.hideFreeSpin, this.onHideFreeSpin);

    this.topLeftSpine.state.addListener({
      complete: (entry: TrackEntry) => {
        if (entry.animation?.name === 'show') {
          this.topLeftSpine.state.setAnimation(0, 'idle', true);
          this.topRightSpine.state.setAnimation(0, 'idle', true);
          this.bottomLeftSpine.state.setAnimation(0, 'idle', true);
          this.bottomRightSpine.state.setAnimation(0, 'idle', true);

          this.topLeftSmoke.state.setAnimation(0, 'idle', true);
          this.topRightSmoke.state.setAnimation(0, 'idle', true);
          this.bottomLeftSmoke.state.setAnimation(0, 'idle', true);
          this.bottomRightSmoke.state.setAnimation(0, 'idle', true);
        }
      },
    });
  };

  private onShowFreeSpin = () => {
    this.topLeftSpine.state.setAnimation(0, 'show');
    this.topRightSpine.state.setAnimation(0, 'show');
    this.bottomLeftSpine.state.setAnimation(0, 'show');
    this.bottomRightSpine.state.setAnimation(0, 'show');

    this.topLeftSmoke.state.setAnimation(0, 'show');
    this.topRightSmoke.state.setAnimation(0, 'show');
    this.bottomLeftSmoke.state.setAnimation(0, 'show');
    this.bottomRightSmoke.state.setAnimation(0, 'show');

    eventEmitter.emit(SPIN_BUTTON_EVENTS.playIdleAnim, 'idle_fs');
  };

  private onHideFreeSpin = () => {
    this.topLeftSpine.state.setAnimation(0, 'hide');
    this.topRightSpine.state.setAnimation(0, 'hide');
    this.bottomLeftSpine.state.setAnimation(0, 'hide');
    this.bottomRightSpine.state.setAnimation(0, 'hide');

    this.topLeftSmoke.state.setAnimation(0, 'hide');
    this.topRightSmoke.state.setAnimation(0, 'hide');
    this.bottomLeftSmoke.state.setAnimation(0, 'hide');
    this.bottomRightSmoke.state.setAnimation(0, 'hide');
  };

  setFreeSpinPosition() {
    const { isPortrait } = resizeObject;

    this.topLeftSpine.scale.y = -1;
    this.topLeftSpine.position.x = isPortrait ? 540 : 0;
    this.topLeftSpine.position.y = isPortrait ? 0 : -540;
    this.topLeftSpine.rotation = isPortrait ? -(Math.PI / 2) : Math.PI;

    this.topRightSpine.position.x = isPortrait ? 540 : 0;
    this.topRightSpine.position.y = isPortrait ? 0 : -540;
    this.topRightSpine.rotation = isPortrait ? Math.PI / 2 : 0;

    this.bottomLeftSpine.position.x = isPortrait ? -540 : 0;
    this.bottomLeftSpine.position.y = isPortrait ? 0 : 540;
    this.bottomLeftSpine.rotation = isPortrait ? -(Math.PI / 2) : Math.PI;

    this.bottomRightSpine.scale.y = -1;
    this.bottomRightSpine.position.x = isPortrait ? -540 : 0;
    this.bottomRightSpine.position.y = isPortrait ? 0 : 540;
    this.bottomRightSpine.rotation = isPortrait ? Math.PI / 2 : 0;

    this.topLeftSmoke.position.x = isPortrait ? -540 : -960;
    this.topLeftSmoke.position.y = isPortrait ? -960 : -540;
    this.topLeftSmoke.scale.set(isPortrait ? 1 : -1, 1);
    this.topLeftSmoke.rotation = isPortrait ? -(Math.PI / 2) : 0;

    this.topRightSmoke.position.x = isPortrait ? 540 : 960;
    this.topRightSmoke.position.y = isPortrait ? -960 : -540;
    this.topRightSmoke.scale.set(1, isPortrait ? -1 : 1);
    this.topRightSmoke.rotation = isPortrait ? -(Math.PI / 2) : 0;

    this.bottomLeftSmoke.position.x = isPortrait ? -540 : -960;
    this.bottomLeftSmoke.position.y = isPortrait ? 960 : 540;
    this.bottomLeftSmoke.scale.set(-1, isPortrait ? 1 : -1);
    this.bottomLeftSmoke.rotation = isPortrait ? -(Math.PI / 2) : 0;

    this.bottomRightSmoke.position.x = isPortrait ? 540 : 960;
    this.bottomRightSmoke.position.y = isPortrait ? 960 : 540;
    this.bottomRightSmoke.scale.set(1, isPortrait ? 1 : -1);
    this.bottomRightSmoke.rotation = isPortrait ? Math.PI / 2 : 0;
  }
}
