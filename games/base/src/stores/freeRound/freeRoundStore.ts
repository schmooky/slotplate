import { action, makeObservable, observable } from 'mobx';
import { FreeRoundCampaignResponse } from '@lib/nework/types';

export class FreeRoundStore {
  constructor() {
    makeObservable(this);
  }

  bet: number | null = null;

  validFrom: Date | null = null;

  validTo: Date | null = null;

  campaignId: string | null = null;

  roundsTotal: number | null = null;

  totalWin: number | null = null;

  serverRoundsLeft: number | null = null;

  @observable
  needToReloadGame = false;

  @observable
  isComplete = false;

  @observable
  roundsLeft: number | null = null;

  @observable
  isOnCampaignState = false;

  @observable
  wasCancelled = false;

  @action
  setWasCancelled(wasCancelled: boolean): void {
    this.wasCancelled = wasCancelled;
  }

  @action
  setRoundsLeft(roundsLeft: number | null): void {
    this.roundsLeft = roundsLeft;
  }

  @action
  setIsComplete(isComplete: boolean): void {
    this.isComplete = isComplete;
  }

  @action
  setIsOnCampaignState(newValue: boolean): void {
    this.isOnCampaignState = newValue;
  }

  @action
  setNeedToReloadGame(newValue: boolean): void {
    this.needToReloadGame = newValue;
  }

  setFreeRoundCampaign(freeRoundCampaign: FreeRoundCampaignResponse): void {
    this.bet = freeRoundCampaign.bet;
    this.validFrom = new Date(freeRoundCampaign.validFrom);
    this.validTo = new Date(freeRoundCampaign.validTo);
    this.campaignId = freeRoundCampaign.campaignId;
    this.roundsTotal = freeRoundCampaign.roundsTotal;
    this.totalWin = freeRoundCampaign.totalWin;
    this.serverRoundsLeft = freeRoundCampaign.roundsLeft;

    this.setIsComplete(freeRoundCampaign.isComplete);
  }

  clearFreeRoundCampaign(): void {
    this.bet = null;
    this.validFrom = null;
    this.validTo = null;
    this.campaignId = null;
    this.roundsTotal = null;
    this.totalWin = null;
    this.setIsComplete(false);
    this.setRoundsLeft(null);
    this.setIsOnCampaignState(false);
  }
}
