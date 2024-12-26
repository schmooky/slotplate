export type SimpleHandler = () => void;

export type PhaseDisposerType = (_disposer: SimpleHandler) => void;
export type PhaseTimeoutType = (_sec: number, _handler: SimpleHandler) => void;

export type PhaseHandlerOptions<S> = {
  store: S;
  setTimeout: PhaseTimeoutType;
  addDisposer: PhaseDisposerType;
};

export type PhaseHandler<T extends string, S extends object> = (
  _options: PhaseHandlerOptions<S>,
) => T | Promise<T>;

export type PhaseHandlers<T extends string, S extends object> = Record<
  T,
  PhaseHandler<T, S>
>;
