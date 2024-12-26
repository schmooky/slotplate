export interface IAutoplayStore {
  init(rounds: number[]): void;

  start(index: number): void;

  stop(): void;

  decreaseSpinsLeft(): void;

  readonly autoPlaySpinsLeft: number;

  readonly isActive: boolean;

  readonly autoPlayRounds: number[];
}
