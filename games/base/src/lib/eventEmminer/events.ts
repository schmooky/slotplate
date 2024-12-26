import { EventEmitter } from 'eventemitter3';

export const eventEmitter = new EventEmitter();

export const SHAKE_EVENTS = {
  playAnticipationShake: 'playAnticipationShake',
  fsBonusShake: 'fsBonusShake',
  wildShake: 'wildShake',
};

export const POPUPS_EVENTS = {
  showWinAnnouncer: 'showWinAnnouncer',
  hideWinAnnouncer: 'hideWinAnnouncer',
  showRegularWin: 'showRegularWin',
  showLineWin: 'showLineWin',
  hideLineWin: 'hideLineWin',
  hideRegularWin: 'hideRegularWin',
  showAnnouncer: 'showAnnouncer',
  hideAnnouncer: 'hideAnnouncer',
  showHint: 'showInfoAnnouncer',
  hideHint: 'hideInfoAnnouncer',
  showGameShadow: 'showGameShadow',
  showBuyFeature: 'showBuyFeature',
  hideGameShadow: 'hideGameShadow',
};

export const CLONING_WILD_EVENTS = {
  multiplierFlight: 'multiplierFlight',
};

export const REELS_EVENTS = {
  startRotate: 'startRotate',
  stopRotate: 'stopRotate',
  slamStop: 'slamStop',
  playWinLines: 'playWinLines',
  cloningWildTransformations: 'cloningWildTransformations',
  wildTransformations: 'wildTransformations',
  showSymbolPaytable: 'showSymbolPaytable',
  hideSymbolPaytable: 'hideSymbolPaytable',
  stopLines: 'stopLines',
  showFSBonusObjects: 'showFSBonusObjects',
  hideFSBonusObjects: 'hideFSBonusObjects',
};

export const STATE_MACHINE_EVENTS = {
  changeState: 'changeState',
};

export const SPIN_BUTTON_EVENTS = {
  playSpinAnim: 'playSpinAnim',
  playIdleAnim: 'playFSIdle',
  playStopAnim: 'playStopAnim',
  decrementSpinBtnCounter: 'decrementSpinBtnCounter',
  updateSpinBtnCounterWithoutAnimation: 'updateSpinBtnCounterWithoutAnimation',
};

export const MYSTERY_FEATURE_EVENTS = {
  mysteryChosen: 'mysteryChosen',
  playMysteryWinAnimation: 'playMysteryWinAnimation',
  playQuestionSymbolChangeAnimation: 'playQuestionSymbolChangeAnimation',
  playAnticipationOnQuestionSymbol: 'playAnticipationOnQuestionSymbol',
};

export const SCREEN_EVENTS = {
  high2: 'high2',
  high3: 'high3',
};

export const FREE_SPIN_EVENTS = {
  showFreeSpin: 'showFreeSpin',
  hideFreeSpin: 'hideFreeSpin',
  questionSymbolShotRequest: 'questionSymbolShotRequest',
  showShootResult: 'showShootResult',
  aimShotAnimationStopped: 'aimShotAnimationStopped',
};
