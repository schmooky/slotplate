import { eventEmitter, POPUPS_EVENTS } from '@lib/eventEmminer/events';
import { HintTextKeys } from '@components/hint/GameHint';

export class GameStatusStore {
  showRegularWin = false;

  showBigWin = false;

  showAnnouncer = false;

  isSymbolPaytableOpened = false;

  showHint = false;

  isOnFSMode = false;

  showFSLayout = false;

  showCWLayout = false;

  isOnFSBonusMode = false;

  isOnCWBonusMode = false;

  canIShot = true;

  isBuyFeatureOpened = false;

  isPaylinesRepeat = false;

  setShowRegularWin = (showRegularWin: boolean) => {
    if (showRegularWin) {
      eventEmitter.emit(POPUPS_EVENTS.showRegularWin);
    }

    this.showRegularWin = showRegularWin;
  };

  setShowBigWin = (showBigWin: boolean) => {
    if (showBigWin) {
      eventEmitter.emit(POPUPS_EVENTS.showWinAnnouncer);
    }

    this.showBigWin = showBigWin;
  };

  setShowAnnouncer = (showAnnouncer: boolean, type?: string) => {
    if (showAnnouncer) {
      eventEmitter.emit(POPUPS_EVENTS.showAnnouncer, type);
    }

    this.showAnnouncer = showAnnouncer;
  };

  // eslint-disable-next-line class-methods-use-this
  setHint = (
    showHint: boolean,
    textKey?: HintTextKeys,
    animationDuration: number = 3,
    hintStyleType: string = 'main',
  ) => {
    if (showHint) {
      eventEmitter.emit(POPUPS_EVENTS.showHint, textKey, animationDuration, hintStyleType);
    } else {
      eventEmitter.emit(POPUPS_EVENTS.hideHint);
    }
  };
}
