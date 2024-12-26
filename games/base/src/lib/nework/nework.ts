import { RequestStatus } from '@slotplate/engine/network';
import { gameId } from '@lib/config/config';
import { rootStore } from '@src/stores/RootStore';
import { FSBonusShootResponse, GameMode, GameRoundResponse, GameSessionResponse } from '@lib/nework/types';
import { GameNetworkManager } from '@lib/nework/GameNetworkManager';

declare const GAME_ENV: unknown;

export const network = new GameNetworkManager(
  `https://kafka-api.geekslots.studio/topics/${GAME_ENV}-${gameId}`,
  new URLSearchParams(window.location.search).get('lng')?.toLowerCase() || 'en',
  (error) => {
    if (error.status === RequestStatus.Error) {
      rootStore.errorStore.setError(error.errorData);
    }
  },
  (data) => {
    rootStore.balanceStore.setServerBalance(data.balance);
    rootStore.balanceStore.setVisibleBalance(data.balance);
  },
);

export const handleSpinResponse = (response: GameRoundResponse): void => {
  const { dataStore, balanceStore, freeRoundStore } = rootStore;

  console.log(response);

  if (response.freeRoundCampaign) {
    freeRoundStore.setFreeRoundCampaign(response.freeRoundCampaign);
  }

  dataStore.setFrame(response.spinResult.frame, response.spinResult.finalFrame);
  dataStore.payLines = response.spinResult.paylines;
  dataStore.totalWin = response.totalWin;
  dataStore.win = response.spinResult.win;
  dataStore.cloningWildTransformations = response.spinResult.cloningWild;
  dataStore.cloningWildMultiplier = response.spinResult?.cloningWild?.multiplier;
  dataStore.high2Transformations = response.spinResult.shuffledSymbols?.shuffleResults;
  dataStore.setWildTransformations(response.spinResult.wildMimicrySymbols?.wildMimicryResults);
  dataStore.mysteryTriggerPosition = response.spinResult.bonusTrigger;
  dataStore.mysteryFeatureData = response.spinResult.bonusFeature;
  dataStore.nextGameMode = response.nextGameMode;
  dataStore.freeSpinsCount = response.freespins;
  balanceStore.setServerBet(response.bet);
  balanceStore.setServerBalance(response.balance);
};

export const handleSessionResponse = (response: GameSessionResponse): void => {
  const { dataStore, balanceStore, autoplayStore, buyFeatureStore, gameStatusStore, freeRoundStore } = rootStore;

  console.log(response);

  if (response.freeRoundCampaign) {
    freeRoundStore.setFreeRoundCampaign(response.freeRoundCampaign);
    freeRoundStore.setRoundsLeft(response.freeRoundCampaign.roundsLeft);
  }

  dataStore.payLines = response.round.spinResult.paylines;
  dataStore.payLinesForRules = Object.values(response.gameSettings.paylines);
  dataStore.setCurrency(response.currency);
  autoplayStore.init(response.gameSettings.availableAutoSpinCounts);
  balanceStore.parseSessionResponse(response.round.balance, response.round.bet, response.gameSettings.allowedBets);
  balanceStore.setLastWin(response.round.totalWin);
  dataStore.totalWin = response.round.totalWin;
  dataStore.setFrame(response.round.spinResult.frame, response.round.spinResult.finalFrame);
  dataStore.setSymbolPaytable(response.gameSettings.payTable);
  dataStore.rtp = response.gameSettings.rtp;
  buyFeatureStore.setBuyFeatures(response.buyFeatures);
  dataStore.mysteryTriggerPosition = response.round.spinResult.bonusTrigger;
  dataStore.mysteryFeatureData = response.round.spinResult.bonusFeature;
  dataStore.nextGameMode = response.startGameMode;
  dataStore.freeSpinsCount = response.round.freespins;
  gameStatusStore.isOnFSMode =
    response.startGameMode === GameMode.Freespin || response.startGameMode === GameMode.FreespinBonus;
  gameStatusStore.isOnFSBonusMode = response.startGameMode === GameMode.FreespinBonus;
  gameStatusStore.isOnCWBonusMode = response.startGameMode === GameMode.CloningWildBuyFeature;
  dataStore.fsBonusShootResult = response.round.freespinBonusFeature;
};

export const handleShotResponse = (response: FSBonusShootResponse): void => {
  const { dataStore, balanceStore } = rootStore;

  balanceStore.setServerBalance(response.balance);
  balanceStore.setServerBet(response.bet);
  dataStore.fsBonusShootResult = response;
  dataStore.nextGameMode = response.nextGameMode;
  dataStore.freeSpinsCount = response.totalNewFreespins;
  dataStore.hits = response.hits.sort((a, b) => a.hitNumber - b.hitNumber);
};
