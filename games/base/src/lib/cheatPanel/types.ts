type FixedSizeArray<N extends number, T> = {
  // @ts-expect-error not sure how to fix this but the type still works if we just ignore the error
  // eslint-disable-next-line no-use-before-define
  readonly [k in Enumerate<N>]: T;
} & { length: N } & Readonly<T[]>;

// https://stackoverflow.com/a/63918062
type PrependNextNumber<A extends Array<unknown>> = A['length'] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNumber<A>, N>;
}[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

// CHANGE TO MODIFY ACCEPTABLE CHEAT
export const reelCount = 3;

type ReelCount = 5;

export type ReelsStopPositions = FixedSizeArray<ReelCount, number>;

type ReelFrame = {
  reelCollectionIndex: number;
  reelsPositions: ReelsStopPositions;
};

export interface CheatBody {
  inLoop: boolean;
  reelFrames: ReelFrame[];
}

export type Cheat = { label: string; onClick: (loop: boolean) => Promise<Response> };
