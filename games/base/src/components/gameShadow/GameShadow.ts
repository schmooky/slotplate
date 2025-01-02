import { eventEmitter, POPUPS_EVENTS } from '@lib/events';
import { Container, Graphics } from 'pixi.js';

export class GameShadow extends Container {
  private gameShadow = new Graphics();

  constructor() {
    super();
    this.createGameShadow();
    eventEmitter.on(POPUPS_EVENTS.showGameShadow, this.onShowGameShadow);
    eventEmitter.on(POPUPS_EVENTS.hideGameShadow, this.onHideGameShadow);
  }

  private createGameShadow() {
    this.gameShadow.rect(0, 0, document.body.clientWidth, document.body.clientHeight).fill({
      color: 0x000000,
      alpha: 0.8,
    });

    this.renderable = false;
    this.addChild(this.gameShadow);
  }

  private onShowGameShadow = () => {
    this.renderable = true;
  };

  private onHideGameShadow = () => {
    this.renderable = false;
  };

  onResize = () => {
    this.gameShadow.clear();

    this.gameShadow.rect(0, 0, document.body.clientWidth, document.body.clientHeight).fill({
      color: 0x000000,
      alpha: 0.8,
    });
  };
}
