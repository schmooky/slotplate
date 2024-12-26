import { action, makeObservable, observable } from 'mobx';

export class StatusStore {
  constructor() {
    makeObservable(this, {
      isGameStarted: observable,
      setIsGameStarted: action,
    });
  }

  isGameStarted = false;

  setIsGameStarted(newValue: boolean): void {
    this.isGameStarted = newValue;
  }
}
