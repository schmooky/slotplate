import { gsap } from "gsap";
import { action, makeObservable, observable } from "mobx";
import { PhaseHandlers, SimpleHandler } from "./types.js";

export class StateMachineStore<T extends string, S extends object> {
  public phase: T | undefined = undefined;

  protected phaseDisposers: (() => void)[] = [];

  protected phaseResets: (() => void)[] = [];

  protected phaseHandlers: PhaseHandlers<T, S>;

  protected store: S;

  protected initPhase: T;

  protected onError?: (error: Error) => void;

  protected debug: boolean;

  constructor(
    store: S,
    handlers: PhaseHandlers<T, S>,
    initPhase: T,
    debug: boolean = false,
    onError?: (error: Error) => void
  ) {
    this.store = store;
    this.phase = undefined;
    this.debug = debug;
    this.onError = onError;

    makeObservable(this, {
      phase: observable,
      setPhaseName: action,
    });

    this.phaseHandlers = { ...handlers };
    this.initPhase = initPhase;
  }

  public init() {
    this.setNextPhase(this.initPhase);
  }

  public phaseTimeout(timeoutSec: number, handler: SimpleHandler): void {
    const delayHandler = gsap.delayedCall(timeoutSec, handler);
    this.phaseDisposers.push(() => {
      delayHandler.kill();
    });
  }

  public addPhaseDisposer(disposer: SimpleHandler): void {
    this.phaseDisposers.push(disposer);
  }

  public setPhaseName(phase: T): void {
    this.phase = phase;
  }

  protected setNextPhase(phase: T): void {
    this.setPhaseName(phase);
    this.executePhase();
  }

  protected async executePhase() {
    if (!this.phase) {
      const error = new Error(
        "@slotplate/state-machine: Can't execute on a null phase"
      );
      if (this.onError) {
        this.onError(error);
      } else {
        throw error;
      }
      return; // Early return if phase is undefined to prevent further execution
    }

    try {
      const result = this.phaseHandlers[this.phase]({
        store: this.store,
        setTimeout: this.phaseTimeout.bind(this) as SimpleHandler,
        addDisposer: this.addPhaseDisposer.bind(this) as SimpleHandler,
      });

      if (!result) {
        throw new Error("Result is corrupted!");
      }

      let nextPhase: T;

      if (typeof result === "string") {
        nextPhase = result;
      } else {
        nextPhase = await result;
      }

      if (this.debug) {
        window.console.groupEnd();
        window.console.group(`STATE: ${nextPhase}`);
      }

      this.disposeCurrentPhase();

      this.setNextPhase(nextPhase);
    } catch (error) {
      if (this.onError) {
        this.onError(error as Error);
      } else {
        throw error;
      }
    }
  }

  protected disposeCurrentPhase(): void {
    while (this.phaseDisposers.length > 0) {
      const disposer = this.phaseDisposers.pop();
      if (disposer) {
        disposer();
      }
    }
  }
}
