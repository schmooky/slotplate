import { BalanceStore } from '@slotplate/balance';
import { action, makeObservable, observable } from 'mobx';

export class GameBalanceStore extends BalanceStore {
  constructor() {
    super();
    makeObservable(this, {
      lastWin: observable,
      setLastWin: action.bound,
    });
  }

  lastWin = 0;

  setLastWin(lastWin: number) {
    this.lastWin = lastWin;
  }
}
