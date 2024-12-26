export type SimpleHandler = () => void;
export type Nullable<T> = T | null;

export type IResponse<T = any> =
  | {
      data?: T;
      status: RequestStatus.Done;
    }
  | IErrorResponse;

export interface IErrorResponse {
  status: RequestStatus.Error;
  errorData: ErrorDataType;
}
export type ErrorDataType = {
  errorMessage?: string;
  header?: string;
  description?: string;
  button?: string;
  errorId?: number;
};

export enum RequestStatus {
  Done = "done",
  Error = "error",
}

export interface ErrorResponse {
  errorId: number | null;
  errorMessage: string | null;
}

export interface IErrorLocalized {
  header: string;
  content: string;
}

export interface FreeRoundCampaignResponse {
  campaignId: string;
  roundsTotal: number;
  roundsLeft: number;
  validFrom: string;
  validTo: string;
  bet: number;
  totalWin: number;
  isComplete: boolean;
}

export interface SpinResponse {
  win: number;
}

export interface RoundResponse {
  roundId: string;
  bet: number;
  balance: number;
  totalWin: number;
  nextGameMode: number;
  endedUtc: string;
  spinResult: SpinResponse;
}

export interface GameSettingsResponse {
  allowedBets: number[];
  availableAutoSpinCounts: number[];
}

export interface SessionResponse {
  securityHash: string;
  currency: string;
  startGameMode: number;
  isDemo: boolean;
  freeRoundCampaign: FreeRoundCampaignResponse;
  round: RoundResponse;
  gameSettings: GameSettingsResponse;
}

export interface NotifyBalanceResponse {
  balance: number;
  currency: string;
}
