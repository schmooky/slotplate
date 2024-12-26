import { ServerSymbols } from '@lib/config/config';

export interface GameSettingsResponse {
  allowedBets: number[];
  availableAutoSpinCounts: number[];
}

export interface FreeRoundCampaignResponse {
  bet: number;
  campaignId: string;
  isComplete: boolean;
  roundsLeft: number;
  roundsTotal: number;
  totalWin: number;
  validFrom: string;
  validTo: string;
}

export interface PositionResponse {
  reel: number;
  row: number;
}

export interface PaylinesResponse {
  line: Array<number | null>;
  lineId: string;
  value: number | null;
  valueWithBonus: number | null;
}

export interface TransformationsResponse {
  symbol: ServerSymbols;
  position: PositionResponse;
}

export interface WildTransformationResponse {
  position: PositionResponse[];
  transformations: TransformationsResponse[];
}

export interface CloningWildResponse {
  position: PositionResponse;
  transformations: TransformationsResponse[];
  multiplier: number;
}

export interface ShuffledSymbolsResponse {
  shuffleResults: CloningWildResponse[];
}

export interface WildMimicryResultsResponse {
  transformationNumber: number;
  transformedSymbolsPositions: TransformationsResponse[];
  wildSymbolPositions: PositionResponse[];
}

export interface WildMimicrySymbolsResponse {
  wildMimicryResults?: WildMimicryResultsResponse[];
}

export interface UserSelectResponse {
  symbol: ServerSymbols;
  position: PositionResponse;
}

export interface BonusFeatureResponse {
  maskSymbol: string;
  positions: PositionResponse[];
  userSelect: UserSelectResponse;
}

export enum GameMode {
  None = 0,
  Regular = 1,
  Freespin = 2,
  FreespinBonus = 3,
  MysteryFeature = 4,
  MysteryFeatureChosen = 5,
  CloningWildBuyFeature = 6,
}

export interface BuyFeature {
  id: string;
  type: 'Freespins' | 'CloningWild';
  name: string;
  spins: number;
  price: number;
}

export interface BuyFeatureRequest {
  buyFeatureId: string;
  bet: number;
}

export interface BuyFeatureResponse {
  cloningWildSpins: number;
  freespins: number;
  isBuyFeatureAvailable: boolean;
  nextGameMode: GameMode;
  freeRoundCampaign: FreeRoundCampaignResponse;
}

export interface GameSpinResult {
  bonusFeature: BonusFeatureResponse;
  bonusTrigger: PositionResponse;
  cloningWild: CloningWildResponse;
  frame: ServerSymbols[][];
  finalFrame: ServerSymbols[][];
  newFreespins: number;
  newFsActivationPoints: number;
  paylines: PaylinesResponse[];
  shuffledSymbols: ShuffledSymbolsResponse;
  wildMimicrySymbols: WildMimicrySymbolsResponse;
  win: number;
}

export interface HitResponse {
  hitNumber: number;
  freespinsWon: number;
  position: PositionResponse;
}

export interface FSBonusShootResponse {
  balance: number;
  hits: HitResponse[];
  hitsRemaining: number;
  nextGameMode: number;
  totalNewFreespins: number;
  bet: number;
}

export interface GameRoundResponse {
  balance: number;
  bet: number;
  freeRoundCampaign: FreeRoundCampaignResponse;
  freespinBonusFeature: FSBonusShootResponse;
  freespins: number;
  nextGameMode: GameMode;
  spinResult: GameSpinResult;
  totalWin: number;
}

export interface ChangeBetResponse {
  bet: number;
  freespinActivationCounter: number;
}

export interface ServerSymbolsPayTable {
  [serverSymbolName: string]: Record<string, number>;
}

interface Paylines {
  [lineNumber: number]: number[];
}

interface BangBangGameSettings extends GameSettingsResponse {
  payTable: ServerSymbolsPayTable;
  paylines: Paylines;
  rtp: number;
}

export interface GameSessionResponse {
  buyFeatures: BuyFeature[];
  currency: string;
  freeRoundCampaign: FreeRoundCampaignResponse;
  gameSettings: BangBangGameSettings;
  isDemo: boolean;
  round: GameRoundResponse;
  securityHash: string;
  startGameMode: GameMode;
}
