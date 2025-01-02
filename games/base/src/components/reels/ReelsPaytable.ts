import { resizeObject, SmartContainer } from '@slotplate/renderer';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { ReelSymbol } from '@lib/config/config';
import { eventEmitter, POPUPS_EVENTS, REELS_EVENTS } from '@lib/events';
import { BitmapText, Container, Text, TextStyle } from 'pixi.js';
import { rootStore } from '@src/stores/RootStore';
import { multiplierData, symbolPaytableColors } from '@components/reels/symbolsPayline.config';
import { Reels } from '@components/reels/Reels';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';
import gsap from 'gsap';

export class ReelsPaytable extends SmartContainer {
  private displaySymbolContainer = new Container();

  private multiplierContainer = new Container();

  private priceContainer = new Container();

  private paytableSpine = Spine.from({
    skeleton: 'paytableData',
    atlas: 'paytableAtlas',
  });

  private displayedSymbolsCache = new Map<ReelSymbol, Spine>();

  private timeoutId: gsap.core.Tween | null = null;

  private commonPriceStyle = new TextStyle({
    fontFamily: 'MartianMono',
    fontSize: 40,
    fontWeight: '400',
    lineHeight: 48,
    stroke: '#aa1e1e',
  });

  constructor() {
    super({
      landscapeData: {
        viewportWidth: 1920,
        viewportHeight: 1080,
        align: 'center',
        valign: 'center',
      },
      portraitData: {
        viewportWidth: 1080,
        viewportHeight: 1920,
        align: 'center',
        valign: 'center',
        correctionOffsetY: -138,
      },
    });
    this.paytableSpine.addChild(this.displaySymbolContainer, this.multiplierContainer, this.priceContainer);
    this.addChild(this.paytableSpine);
    this.setupListeners();
  }

  private setupListeners() {
    eventEmitter.on(REELS_EVENTS.showSymbolPaytable, this.showSymbolPaytable);
    eventEmitter.on(REELS_EVENTS.hideSymbolPaytable, this.hideSymbolPaytable);
  }

  private showSymbolPaytable = (symbolName: ReelSymbol) => {
    AnalyticsManager.instance.logSymbolPaytableClick();
    eventEmitter.emit(POPUPS_EVENTS.showGameShadow);

    this.setPaytableAnimation(symbolName);
    this.setDisplaySymbol(symbolName);
    this.setPaytableMultipliers(symbolName);
    this.setPaytablePrices(symbolName);
    this.setPaytableVisiblity(true);
  };

  private setPaytableAnimation(symbolName: ReelSymbol) {
    let animationName: string;

    if (symbolName.startsWith('low')) {
      animationName = 'ls_low';
    } else if (symbolName.startsWith('high')) {
      const number = symbolName.slice(4);
      animationName = `ls_high_${number}`;
    } else {
      console.error(`Unknown symbol name: ${symbolName}`);
      return;
    }

    this.paytableSpine.state.setAnimation(0, animationName, true);
  }

  private setDisplaySymbol(symbolName: ReelSymbol) {
    let displaySymbol = this.displayedSymbolsCache.get(symbolName);

    if (!displaySymbol) {
      displaySymbol = Spine.from({
        skeleton: `${symbolName}Data`,
        atlas: symbolName.match('low') ? 'lowSymbolAtlas' : `${symbolName}Atlas`,
      });

      displaySymbol.state.setAnimation(0, Reels.getSymbolIdleAnim(displaySymbol), true);
      displaySymbol.position.set(symbolName === 'high4' ? -335 : -320, 60);

      this.displayedSymbolsCache.set(symbolName, displaySymbol);
      this.displaySymbolContainer.addChild(displaySymbol);
    }

    displaySymbol.visible = true;

    this.displayedSymbolsCache.forEach((symbol, key) => {
      if (key !== symbolName) {
        symbol.visible = false;
      }
    });
  }

  private setPaytableMultipliers(symbolName: ReelSymbol) {
    const existingTexts = this.multiplierContainer.children as BitmapText[];

    multiplierData.forEach((data, key) => {
      const index = ['x5', 'x4', 'x3'].indexOf(key);

      if (index === -1) return;

      const bitmapText =
        existingTexts[index] || ReelsPaytable.createBitmapText(symbolName, key, data.y, data.letterSpacing);

      ReelsPaytable.updateMultiplierText(bitmapText, key, symbolName);

      if (!existingTexts[index]) {
        this.multiplierContainer.addChild(bitmapText);
      }
    });

    this.multiplierContainer.position.set(-150, -130);
  }

  private static updateMultiplierText(bitmapText: BitmapText, text: string, symbolName: ReelSymbol): void {
    bitmapText.text = text;
    bitmapText.visible = true;

    bitmapText.style.fontFamily = symbolName === 'high3' ? 'greenFont' : 'blueFont';
  }

  private static createBitmapText = (
    symbolName: ReelSymbol,
    text: string,
    y: number,
    letterSpacing: number = 10,
  ): BitmapText => {
    const bitmapText = new BitmapText({
      text,
      style: { fontFamily: symbolName === 'high3' ? 'greenFont' : 'blueFont', fontSize: 23, letterSpacing },
    });

    bitmapText.position.set(0, y);
    return bitmapText;
  };

  private setPaytablePrices(symbolName: ReelSymbol) {
    const { dataStore, balanceStore } = rootStore;
    const { symbolPaytable } = dataStore;
    const { visibleBet } = balanceStore;

    const isLowSymbol = symbolName.match(/low/);
    const symbolColors = symbolPaytableColors.get(isLowSymbol ? 'low' : symbolName)!;
    const { textColor } = symbolColors;

    const existingPrices = this.priceContainer.children as Text[];

    const price1 = existingPrices[0] || this.createPaytablePrice('', 0, -2, textColor);
    const price2 = existingPrices[1] || this.createPaytablePrice('', 0, 91, textColor);
    const price3 = existingPrices[2] || this.createPaytablePrice('', 0, 187, textColor);

    ReelsPaytable.updatePriceText(price1, symbolPaytable.get(symbolName)!.x5, visibleBet, textColor);
    ReelsPaytable.updatePriceText(price2, symbolPaytable.get(symbolName)!.x4, visibleBet, textColor);
    ReelsPaytable.updatePriceText(price3, symbolPaytable.get(symbolName)!.x3, visibleBet, textColor);

    this.priceContainer.position.set(212, -120);
    if (existingPrices.length === 0) {
      this.priceContainer.addChild(price1, price2, price3);
    }
  }

  private createPaytablePrice = (text: string, x: number, y: number, fillColor: string) => {
    const paytablePrice = new Text({
      text,
      style: this.commonPriceStyle,
    });

    paytablePrice.anchor.set(0.5, 0);
    paytablePrice.style.fill = fillColor;
    paytablePrice.position.set(x, y);
    return paytablePrice;
  };

  private static updatePriceText(price: Text, value: number, bet: number, fillColor: string): void {
    const { dataStore } = rootStore;
    price.text = `${dataStore.gameWinPreset.formatCurrency(value * bet)}`;
    price.style.fill = fillColor;
    price.visible = true;
  }

  private setPaytableVisiblity(visible: boolean): void {
    this.paytableSpine.visible = visible;

    if (this.timeoutId !== null) {
      gsap.killTweensOf(this.timeoutId);
    }

    if (visible) {
      this.timeoutId = gsap.delayedCall(0, () => {
        rootStore.gameStatusStore.isSymbolPaytableOpened = visible;
      });
      return;
    }

    rootStore.gameStatusStore.isSymbolPaytableOpened = visible;
  }

  private hideSymbolPaytable = (): void => {
    this.setPaytableVisiblity(false);

    this.displayedSymbolsCache.forEach((symbol) => {
      symbol.visible = false;
    });

    eventEmitter.emit(POPUPS_EVENTS.hideGameShadow);
  };

  onResize(): void {
    this.scale.set(resizeObject.isPortrait ? 0.95 : 1);
  }
}
