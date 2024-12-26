import { action, makeObservable } from 'mobx';
import { BuyFeature } from '@lib/nework/types';

export class BuyFeatureStore {
  constructor() {
    makeObservable(this);
  }

  currentBetIndex = 0;

  fsData: BuyFeature[] = [];

  currentFSCoefIndex = 0;

  @action
  setCurrentFSCoefIndex(newState: number): void {
    this.currentFSCoefIndex = newState;
  }

  setCurrentBetIndex(newValue: number): void {
    this.currentBetIndex = newValue;
  }

  setBuyFeatures(buyFeatureData: BuyFeature[]): void {
    this.fsData = buyFeatureData.filter((feature) => feature.type === 'Freespins');
  }
}
