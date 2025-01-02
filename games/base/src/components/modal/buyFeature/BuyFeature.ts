import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { BitmapText, Graphics, Text, TextStyle } from 'pixi.js';
import { Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8';
import { eventEmitter, POPUPS_EVENTS, STATE_MACHINE_EVENTS } from '@lib/events';
import { rootStore } from '@src/stores/RootStore';
import { ButtonConfig, buttonPositionConfig, buttonsConfig } from '@components/modal/buyFeature/buyFeatureConfig';
import { BuyFeatureRequest, BuyFeatureResponse, GameMode } from '@lib/nework/types';
import { RequestStatus } from '@slotplate/engine/network';
import { gameSound } from '@src/stores/sound/GameSound';
import { SoundKey } from '@lib/sounds/soundsKeys';

export class BuyFeature extends SmartContainer {
  private buyFeatureStore = rootStore.buyFeatureStore;
  private balanceStore = rootStore.balanceStore;
  private dataStore = rootStore.dataStore;

  private buyFeature = Spine.from({
    skeleton: 'buyFeatureData',
    atlas: 'buyFeatureDataAtlas',
  });

  private currencyStyles = new TextStyle({
    fill: '#00ffc6',
    fontFamily: 'MartianMono',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    stroke: {
      color: '#7cff95',
      width: 1,
    },
  });

  private fsBetText = new Text({
    text: `${this.dataStore.defaultFormatter.formatCurrency(
      this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]!,
    )}`,
    style: this.currencyStyles,
  });

  private fsTotalText = new Text({
    text: `${this.dataStore.defaultFormatter.formatCurrency(
      this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]! *
        this.buyFeatureStore.fsData[this.buyFeatureStore.currentFSCoefIndex]!.price,
    )}`,
    style: this.currencyStyles,
  });

  private fsCoefText = new BitmapText({
    text: `x${this.buyFeatureStore.fsData[this.buyFeatureStore.currentFSCoefIndex]!.spins}`,
    style: { fontFamily: 'greenFont', fontSize: 60 },
  });

  private readonly mainTrackIndex = 0;

  private readonly buttonTrackIndex = 1;

  private buttons: { [buttonName: string]: Graphics } = {};

  private static CAN_CHANGE_STATE = false;

  constructor() {
    super();
    this.createButtons();
    this.setupListeners();
    this.addChild(this.buyFeature);
    this.setupTextElements();
    this.setBuyFeaturePosition();
    this.renderable = false;
  }

  private createButtons(): void {
    buttonsConfig.forEach((buttonConfig: ButtonConfig) => {
      const button = new Graphics();
      button.clear();
      button.rect(-500, -640, 950, 520);
      button.fill({ color: 0x000000, alpha: 0 });
      button.interactive = true;
      button.cursor = 'pointer';
      BuyFeature.setButtonPosition(buttonConfig, button);
      this.handleButtonClick(buttonConfig, button);
      this.buttons[buttonConfig.name] = button;
      this.buyFeature.addChild(button);
    });
  }

  private handleButtonClick(buttonConfig: ButtonConfig, button: Graphics): void {
    button.on('pointerup', (event) => {
      if (event.button === 0) {
        const coefLimit = this.buyFeatureStore.fsData.length - 1;
        const betIndexLimit = this.balanceStore.allowedBets.length - 1;

        switch (buttonConfig.name) {
          case 'btnRightArrowCoefFS': {
            this.updateCoef(1, coefLimit, this.fsCoefText, this.fsTotalText);
            return;
          }
          case 'btnLeftArrowCoefFS': {
            this.updateCoef(-1, coefLimit, this.fsCoefText, this.fsTotalText);
            return;
          }
          case 'btnRightArrowBetFS': {
            this.updateBet(1, betIndexLimit, this.fsBetText, this.fsTotalText);
            return;
          }
          case 'btnLeftArrowBetFS': {
            this.updateBet(-1, betIndexLimit, this.fsBetText, this.fsTotalText);
            return;
          }
          default: {
            this.setAnimationOnClick(buttonConfig);
            break;
          }
        }
      }
    });
  }

  private updateCoef(direction: number, limit: number, coefText: BitmapText, totalText: Text): void {
    const coefArray = this.buyFeatureStore.fsData;

    const currentCoef = this.buyFeatureStore.currentFSCoefIndex;

    if ((direction > 0 && currentCoef < limit) || (direction < 0 && currentCoef > 0)) {
      this.buyFeatureStore.setCurrentFSCoefIndex(currentCoef + direction);
      coefText.text = `x${coefArray[this.buyFeatureStore.currentFSCoefIndex]!.spins}`;
      totalText.text = `${this.dataStore.defaultFormatter.formatCurrency(
        this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]! *
          coefArray[this.buyFeatureStore.currentFSCoefIndex]!.price,
      )}`;

      gameSound.restartSound(SoundKey.BFButtons);
    }
  }

  private updateBet(direction: number, limit: number, betText: Text, totalText: Text): void {
    const { currentBetIndex } = this.buyFeatureStore;

    if ((direction > 0 && currentBetIndex < limit) || (direction < 0 && currentBetIndex > 0)) {
      this.buyFeatureStore.setCurrentBetIndex(currentBetIndex + direction);

      const currentBet = this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]!;
      const currentFeaturePrice = this.buyFeatureStore.fsData[this.buyFeatureStore.currentFSCoefIndex]!.price;

      betText.text = `${this.dataStore.defaultFormatter.formatCurrency(currentBet)}`;
      totalText.text = `${this.dataStore.defaultFormatter.formatCurrency(currentBet * currentFeaturePrice)}`;

      gameSound.restartSound(SoundKey.BFButtons);
    }
  }

  private static setButtonPosition(buttonConfigObject: ButtonConfig, button: Graphics): void {
    const commonProperties = {
      width: 100,
      height: 100,
    };
    const config = buttonPositionConfig.get(buttonConfigObject.name)!;

    button.x = config.x;
    button.y = config.y;
    button.width = config.width ?? commonProperties.width;
    button.height = config.height ?? commonProperties.height;
  }

  private setAnimationOnClick(buttonConfig: ButtonConfig): void {
    const animations = buttonConfig.clickAnimationNames;
    if (!animations) return;

    animations.forEach((element) => {
      const trackIndex = element.match('btn') ? this.buttonTrackIndex : this.mainTrackIndex;
      this.buyFeature.state.setAnimation(trackIndex, element, false);
    });
  }

  private setupTextElements() {
    this.buyFeature.addSlotObject('txt_x10_fs', this.fsCoefText);
    this.buyFeature.addSlotObject('bet_txt_fs', this.fsBetText);
    this.buyFeature.addSlotObject('total_txt_fs2', this.fsTotalText);
    this.setTextPosition();
  }

  setBuyFeaturePosition() {
    const { isPortrait } = resizeObject;
    this.buyFeature.position.set(isPortrait ? 25 : 0, isPortrait ? -100 : 0);
  }

  private setTextPosition() {
    this.fsCoefText.anchor.set(0.5, 1.5);
    this.fsBetText.anchor.set(0.5);
    this.fsTotalText.anchor.set(0.5);
  }

  private setupListeners() {
    eventEmitter.on(POPUPS_EVENTS.showBuyFeature, this.onShowBuyFeature);

    this.buyFeature.state.addListener({
      start: (entry: TrackEntry) => {
        const animationName = entry.animation?.name;
        if (!animationName) return;

        if (animationName === 'show') {
          gameSound.playSound(SoundKey.SwitchBFWindow);
        }

        if (animationName === 'hide') {
          const buttonClose = this.buyFeature.children[0]!;
          buttonClose.cursor = 'default';
          buttonClose.interactive = false;

          gameSound.playSound(SoundKey.CloseBF);
        }

        if (animationName === 'btn_buy_ckick') {
          const buttonBuy = this.buyFeature.children[1]!;
          buttonBuy.cursor = 'default';
          buttonBuy.interactive = false;

          this.buyFeatureRequestHandler();
        }
      },

      complete: (entry: TrackEntry) => {
        const animationName = entry.animation?.name;
        if (!animationName) return;

        if (animationName === 'btn_buy_ckick') {
          this.buyFeature.state.setAnimation(this.mainTrackIndex, 'hide');
          this.buyFeature.state.setAnimation(this.buttonTrackIndex, 'btn_buy_hide');
        }

        if (animationName === 'show') {
          this.buyFeature.state.setAnimation(this.mainTrackIndex, 'idle', true);
        }

        if (animationName.includes('btn_buy_show')) {
          this.buyFeature.state.setAnimation(this.buttonTrackIndex, 'btn_buy_idle', true);
        }

        if (animationName === 'hide') {
          this.renderable = false;
          rootStore.gameStatusStore.isBuyFeatureOpened = false;
          eventEmitter.emit(POPUPS_EVENTS.hideGameShadow);

          if (BuyFeature.CAN_CHANGE_STATE) {
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          } else {
            BuyFeature.CAN_CHANGE_STATE = true;
          }
          this.resetBuyFeatureData();
        }
      },
    });
  }

  private resetBuyFeatureData(): void {
    this.buyFeatureStore.currentFSCoefIndex = 0;
    this.buyFeatureStore.currentBetIndex = this.balanceStore.allowedBets.indexOf(this.balanceStore.visibleBet);

    this.fsCoefText.text = `x${this.buyFeatureStore.fsData[this.buyFeatureStore.currentFSCoefIndex]!.spins}`;
    this.fsBetText.text = `${this.dataStore.defaultFormatter.formatCurrency(
      this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]!,
    )}`;
    this.fsTotalText.text = `${this.dataStore.defaultFormatter.formatCurrency(
      this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]! *
        this.buyFeatureStore.fsData[this.buyFeatureStore.currentFSCoefIndex]!.price,
    )}`;
  }

  private buyFeatureRequestHandler(): void {
    BuyFeature.CAN_CHANGE_STATE = false;

    const selectedData = this.buyFeatureStore.fsData;
    const selectedCoefIndex = this.buyFeatureStore.currentFSCoefIndex;
    const selectedBonus = selectedData[selectedCoefIndex]!;

    rootStore.balanceStore.setVisibleBet(this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]!);
    rootStore.balanceStore.setVisibleBalance(
      this.balanceStore.visibleBalance -
        this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]! * selectedBonus.price,
    );

    network
      .gameRequest<BuyFeatureResponse, BuyFeatureRequest>({
        requestType: 'purchase',
        payload: {
          buyFeatureId: selectedBonus.id,
          bet: this.balanceStore.allowedBets[this.buyFeatureStore.currentBetIndex]!,
        },
      })
      .then((response) => {
        if (response.status === RequestStatus.Done && response.data) {
          console.log(response.data);
          rootStore.dataStore.nextGameMode = response.data.nextGameMode;

          if (response.data.freespins > 0) {
            rootStore.dataStore.freeSpinsCount = response.data.freespins;
          }

          if (response.data.nextGameMode === GameMode.Freespin) {
            rootStore.gameStatusStore.isOnFSMode = true;
          }

          if (BuyFeature.CAN_CHANGE_STATE) {
            eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
          }
        }

        BuyFeature.CAN_CHANGE_STATE = true;
      });
  }

  private onShowBuyFeature = () => {
    const buttonClose = this.buyFeature.children[0]!;
    buttonClose.cursor = 'pointer';
    buttonClose.interactive = true;

    const buttonBuy = this.buyFeature.children[1]!;
    buttonBuy.cursor = 'pointer';
    buttonBuy.interactive = true;

    BuyFeature.CAN_CHANGE_STATE = true;
    this.renderable = true;
    this.resetBuyFeatureData();
    this.buyFeature.state.setAnimation(this.mainTrackIndex, 'show');
    this.buyFeature.state.setAnimation(this.buttonTrackIndex, 'btn_buy_show');
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);
    gameSound.playSound(SoundKey.OpenBFPopup);
    eventEmitter.emit(STATE_MACHINE_EVENTS.changeState);
  };
}
