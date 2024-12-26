import { TRANSLATION_KEY } from '@slotplate/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';

export const reactTranslation = (): Map<TRANSLATION_KEY, string> => {
  const map = new Map<TRANSLATION_KEY, string>();

  map.set(TRANSLATION_KEY.menuOptionsSound, simpleLocalize.getTranslation('menu.options.sound'));
  map.set(TRANSLATION_KEY.menuOptionsSpace, simpleLocalize.getTranslation('menu.options.spacebar'));
  map.set(TRANSLATION_KEY.menuOptionsFastplay, simpleLocalize.getTranslation('menu.options.turbo'));
  map.set(TRANSLATION_KEY.menuOptionsReturnToLobby, simpleLocalize.getTranslation('menu.options.returnToLobby'));
  map.set(TRANSLATION_KEY.menuAutoplayRounds, simpleLocalize.getTranslation('menu.autoplay.rounds'));
  map.set(TRANSLATION_KEY.menuAutoplaySpinBet, simpleLocalize.getTranslation('menu.autoplay.spinBet'));
  map.set(TRANSLATION_KEY.menuAutoplayTotalBet, simpleLocalize.getTranslation('menu.autoplay.totalBet'));
  map.set(TRANSLATION_KEY.menuAutoplayFastplay, simpleLocalize.getTranslation('menu.autoplay.turbo'));
  map.set(TRANSLATION_KEY.modalAutospinButton, simpleLocalize.getTranslation('modal.autoplay.button'));
  map.set(TRANSLATION_KEY.menuPaytableHeader, simpleLocalize.getTranslation('menu.paytable.header'));
  map.set(TRANSLATION_KEY.menuPaytableBet, simpleLocalize.getTranslation('menu.paytable.bet'));
  map.set(TRANSLATION_KEY.menuPaytableCurrency, simpleLocalize.getTranslation('menu.paytable.currency'));
  map.set(TRANSLATION_KEY.menuRulesHeader, simpleLocalize.getTranslation('menu.rules.header'));
  map.set(TRANSLATION_KEY.modalAutospinHeader, simpleLocalize.getTranslation('modal.autoplay.header'));
  map.set(TRANSLATION_KEY.modalBetHeader, simpleLocalize.getTranslation('modal.bet.header'));
  map.set(TRANSLATION_KEY.modalSupportWarningHeader, simpleLocalize.getTranslation('modal.supportWarning.header'));
  map.set(TRANSLATION_KEY.modalSupportWarningContent, simpleLocalize.getTranslation('modal.supportWarning.content'));
  map.set(TRANSLATION_KEY.modalServerErrorHeader, simpleLocalize.getTranslation('modal.serverError.header'));
  map.set(TRANSLATION_KEY.modalServerErrorContent, simpleLocalize.getTranslation('modal.serverError.content'));
  map.set(TRANSLATION_KEY.modalConnectionErrorHeader, simpleLocalize.getTranslation('modal.connectionError.header'));
  map.set(TRANSLATION_KEY.modalConnectionErrorContent, simpleLocalize.getTranslation('modal.connectionError.content'));
  map.set(
    TRANSLATION_KEY.modalInsufficientFundsUnFilledButton,
    simpleLocalize.getTranslation('modal.insufficientFunds.unFilledButton'),
  );
  map.set(TRANSLATION_KEY.modalSessionErrorHeader, simpleLocalize.getTranslation('modal.sessionError.header'));
  map.set(TRANSLATION_KEY.modalSessionErrorContent, simpleLocalize.getTranslation('modal.sessionError.content'));
  map.set(TRANSLATION_KEY.modalSWRErrorHeader, simpleLocalize.getTranslation('modal.swrError.header'));
  map.set(TRANSLATION_KEY.modalSWRErrorContent, simpleLocalize.getTranslation('modal.swrError.content'));

  map.set(TRANSLATION_KEY.infoAnnouncerFreeRounds, simpleLocalize.getTranslation('infoAnnouncer.freeRounds'));
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignNoButton,
    simpleLocalize.getTranslation('modal.freeRoundCampaign.noButton'),
  );
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignYesButton,
    simpleLocalize.getTranslation('modal.freeRoundCampaign.yesButton'),
  );
  map.set(TRANSLATION_KEY.modalFreeRoundCampaignPlay, simpleLocalize.getTranslation('modal.freeRoundCampaign.play'));
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignRounds,
    simpleLocalize.getTranslation('modal.freeRoundCampaign.rounds'),
  );
  map.set(TRANSLATION_KEY.modalFreeRoundCampaignTime, simpleLocalize.getTranslation('modal.freeRoundCampaign.time'));
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignWinContent,
    simpleLocalize.getTranslation('modal.freeRoundCampaignWin.content'),
  );
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignWinCancelled,
    simpleLocalize.getTranslation('modal.freeRoundCampaignWin.cancelled'),
  );
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignWinFinished,
    simpleLocalize.getTranslation('modal.freeRoundCampaignWin.finished'),
  );
  map.set(
    TRANSLATION_KEY.modalFreeRoundCampaignWinTapText,
    simpleLocalize.getTranslation('modal.freeRoundCampaignWin.tap'),
  );
  return map;
};
