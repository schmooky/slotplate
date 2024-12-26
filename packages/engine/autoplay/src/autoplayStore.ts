import { observable, action, makeObservable } from "mobx";
import { IAutoplayStore } from "./types.js";

/**
 * The store for managing autoplay functionality.
 */
export class AutoplayStore implements IAutoplayStore {
  /** An array containing the number of rounds for autoplay. */
  public autoPlayRounds: number[] = [];

  /** The number of spins left for autoplay. */
  public autoPlaySpinsLeft = 0;

  /** Indicates whether autoplay is activated */
  public isActive = false;

  constructor() {
    makeObservable(this, {
      autoPlayRounds: observable,
      isActive: observable,
      autoPlaySpinsLeft: observable,
      init: action.bound,
      start: action.bound,
      stop: action.bound,
      decreaseSpinsLeft: action.bound,
    });
  }

  /**
   * Initializes autoplay options with data from the server.
   *
   * @param {number[]} rounds - Array of available rounds.
   */
  public init(rounds: number[]): void {
    this.autoPlayRounds = rounds;
  }

  /**
   * A method to start the autoPlay feature at a specific index.
   *
   * @param {number} index - The index at which to start the autoPlay feature.
   */
  public start(index: number): void {
    if (!Number.isInteger(index) || index < 0) {
      throw new Error("Index must be a non-negative integer");
    }

    const autoPlaySpinsLeft = this.autoPlayRounds[index];
    if (!autoPlaySpinsLeft) {
      throw new Error("Autoplay rounds not found");
    }

    this.autoPlaySpinsLeft = autoPlaySpinsLeft;
    this.isActive = true;
    this.decreaseSpinsLeft();
  }

  /**
   * Stops autoplay.
   */

  public stop(): void {
    this.isActive = false;
    this.autoPlaySpinsLeft = 0;
  }

  public decreaseSpinsLeft(): void {
    if (this.autoPlaySpinsLeft) {
      --this.autoPlaySpinsLeft;
    }
  }
}
