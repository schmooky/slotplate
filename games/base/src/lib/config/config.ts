export const gameId = 'bang-bang';

export const serverSymbols = ['A', 'B', 'C', 'D', 'E', 'K', 'L', 'M', 'N', 'R', 'S', 'Q', 'W', 'T'] as const;

export const SYMBOL_NAMES = [
  'high1',
  'high2',
  'high3',
  'high4',
  'high5',
  'low1',
  'low2',
  'low3',
  'low4',
  'cloningWild',
  'question',
  'questionGold',
  'wild',
  'scatter',
] as const;

export type ReelSymbol = (typeof SYMBOL_NAMES)[number];

export type ServerSymbols = (typeof serverSymbols)[number];

export const symbolsMap = new Map<ServerSymbols, ReelSymbol>([
  ['A', 'high1'],
  ['B', 'high2'],
  ['C', 'high3'],
  ['D', 'high4'],
  ['E', 'high5'],
  ['K', 'low1'],
  ['L', 'low2'],
  ['M', 'low3'],
  ['N', 'low4'],
  ['R', 'cloningWild'],
  ['S', 'questionGold'],
  ['Q', 'question'],
  ['W', 'wild'],
  ['T', 'scatter'],
]);
