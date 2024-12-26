import { action, computed, makeObservable, observable } from "mobx";

/**
 * Store for balance management.
 */
export class BalanceStore {
  constructor() {
    makeObservable(this, {
      serverBalance: observable,
      serverBet: observable,
      visibleBalance: observable,
      visibleBet: observable,
      allowedBets: observable,
      setServerBalance: action.bound,
      setServerBet: action.bound,
      setVisibleBalance: action.bound,
      setVisibleBet: action.bound,
      betIndex: computed,
    });
  }

  public serverBalance = 0;

  public serverBet = 0;

  public visibleBalance = 0;

  public visibleBet = 0;

  public allowedBets: number[] = [];

  public parseSessionResponse(
    balance: number,
    bet: number,
    allowedBets: number[],
  ): void {
    this.allowedBets = allowedBets;
    this.setServerBalance(balance);
    this.setServerBet(bet);
    this.actualize();
  }

  public setServerBalance(balance: number): void {
    this.serverBalance = balance;
  }

  public setServerBet(bet: number): void {
    this.serverBet = bet;
  }

  public setVisibleBalance(balance: number): void {
    this.visibleBalance = balance;
  }

  public setVisibleBet(bet: number): void {
    this.visibleBet = bet;
  }

  public setServerBetFromIndex(index: number): void {
    this.setServerBet(this.allowedBets[index]!);
  }

  public get betIndex(): number {
    return this.allowedBets.indexOf(this.serverBet);
  }

  public actualize() {
    this.setVisibleBalance(this.serverBalance);
    this.setVisibleBet(this.serverBet);
  }
}
