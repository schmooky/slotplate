import { EventEmitter } from 'eventemitter3';

export const eventEmitter = new EventEmitter();

export const SHAKE_EVENTS = {
  testShake: 'testShake',
};

export const POPUPS_EVENTS = {
  showTest: 'showTest',
  hideTest: 'hideTest',
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
