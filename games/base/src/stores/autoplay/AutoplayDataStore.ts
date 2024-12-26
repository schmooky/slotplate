import { action, makeObservable, observable } from 'mobx';
import { AutoplayStore } from '@slotplate/engine/autoplay';

export class AutoplayDataStore extends AutoplayStore {
  firstAutoPlay: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      firstAutoPlay: observable,
      setFirstAutoPlay: action.bound,
    });
  }

  setFirstAutoPlay(): void {
    this.firstAutoPlay = true;
  }
}
