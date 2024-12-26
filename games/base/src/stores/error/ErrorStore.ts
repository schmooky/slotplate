import { action, computed, makeObservable, observable } from 'mobx';
import { IRootStore } from '@src/stores/types';
import { i18nNetwork } from '@slotplate/engine/network';

export type ErrorDataType = {
  errorMessage?: string;
  header?: string;
  description?: string;
  button?: string;
  errorId?: number;
};

export class ErrorStore {
  constructor(private rootStore: IRootStore) {
    makeObservable(this);
  }

  @observable errorHeader = '';

  @observable errorMessage = '';

  @observable errorId = 0;

  isInsufficientFunds = false;

  @action
  setError(newValue: ErrorDataType): void {
    return;
    this.errorHeader = newValue.header as string;
    this.errorMessage = newValue.description as string;
    this.rootStore.modalStatusStore.setShowErrorModal(true);
  }

  @action
  setErrorId(newValue: number): void {
    this.errorId = newValue;
  }

  @computed
  get isFreeRoundError(): boolean {
    return this.errorId === 634 || this.errorId === 635 || this.errorId === 640;
  }

  setConnectionError = (): void => {
    this.setError({
      header: i18nNetwork.t(`${1004}.header`),
      description: i18nNetwork.t(`${1004}.content`),
      errorId: 1004,
    });
  };
}
