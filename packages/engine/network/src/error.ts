import z from "zod";
import { serverErrorMessageSchema } from "./baseSchemas.js";

// Это ошибка хаба и она приходит как эксепшен
// {“type”:7,“error”:“Connection closed with an error. HubException: Operation failed with error code 501. Error message: The session does not exist”}

// Это приходит как результат
// {“type”:3,“invocationId”:“1",“result”:{“errorId”:603,“errorMessage”:“The session has unfinished freespin for round. Use the freespin method instead.“}}

export enum ErrorText {
  SessionDoestNotExist = "Error message: Missing query parameter 'sessionId'",
  SessionExpiredOrClosed = "Error message: The session expired or closed",
  ConnectionLost = "Server timeout elapsed without receiving a message from the server.",
  WebSocketClosed = "WebSocket closed with status code: 1006 (no reason given).",
  WebSocketFailedToConnect = "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.",
}

/**
* @description
[1хх - 4хх] - Partner API errors
[5хх] - base game errors
[6xx] - game server errors (buy feature, bonus game, free rounds campaign, etc.)
[1ххх - 2xxx] - game client errors

[1xx - 9xx] - !!!always consider staying out of this range for new game client errors.
Please refer to complete spec for error codes in a link below.
* @link https://slots-broit.atlassian.net/wiki/spaces/SLOTSBROIT/pages/610172934
*
*
*/
export enum ErrorCode {
  PartnerUnexpected = 100,
  PartnerInvalidSignature = 101,
  PartnerDataFormat = 102,
  PartnerEmptyRequestBody = 103,
  PartnerIPAdressNotAllowed = 104,
  PartnerInvalidIntegration = 201,
  PartnerCurrencyNotFound = 202,
  PartnerJurisdictionNotSupported = 203,
  PartnerBalanceInvalid = 204,
  PartnerSessionDataTooLong = 205,
  PartnerRealityCheckTooLong = 206,
  PartnerPlayerInvalid = 207,
  PartnerGameInvalid = 208,
  PartnerAmountInvalid = 209,
  PartnerGameNotAllowedForOperation = 301,
  PartnerCurrencyNotSupportedForOperation = 302,
  PartnerPlayerBlocked = 303,
  PartnerLowBalance = 401, // duplicates 503
  PartnerInvalidSession = 402, // duplicates 501
  PartnerInconsistentData = 403,
  PartnerBonusNotFound = 404,
  PartnerTransactionInvalid = 406,
  PartnerRoundInvalid = 407,
  UnexpectedError = 500, //! TODO remove Error word
  SessionInvalid = 501,
  BetInvalid = 502,
  LowBalance = 503,
  PriceInvalid = 504,
  BetTransactionFailed = 505,
  WinTransactionFailed = 506,
  SessionCancelled = 507,
  UnexpectedGameError = 600, //! TODO remove Error word
  GameModeInvalid = 601,
  RoundInvalid = 602,
  InconsistentBet = 603,
  FeatureInvalid = 611,
  FeatureUnavailable = 612,
  FeatureAlreadyActivated = 613,
  BuyFeatureInvalid = 621,
  BuyFeatureUnavailable = 622,
  UninitializedBuyFeature = 623,
  FreeRoundCampaignNotFound = 631,
  FreeRoundCampaignIdMismatch = 632,
  FreeRoundCampaignNotActive = 633,
  FreeRoundCampaignAlreadyPlayed = 634,
  FreeRoundCampaignClosed = 635,
  FreeRoundCampaignBetMismatch = 636,
  FreeRoundCampaignUnavailable = 637,
  FreeRoundCampaignAlreadyActivated = 638,
  FreeRoundCampaignMethodRestricted = 639,
  FreeRoundCampaignCancelled = 640,
  NotifySessionClosed = 1001, // duplicates 501
  NotifyNewConnectionHasOpened = 1002,
  SessionDoesNotExist = 1003,
  ConnectionError = 1004, //! TODO remove Error word
  ValidationError = 1005, //! TODO remove Error word
}

const errorTextToErrorCodeMap: Record<string, ErrorCode> = {
  [ErrorText.SessionDoestNotExist]: ErrorCode.SessionDoesNotExist,
  [ErrorText.SessionExpiredOrClosed]: ErrorCode.NotifySessionClosed,
  [ErrorText.WebSocketClosed]: ErrorCode.ConnectionError,
  [ErrorText.WebSocketFailedToConnect]: ErrorCode.ConnectionError,
  [ErrorText.ConnectionLost]: ErrorCode.ConnectionError,
};

const reconnectExclusionList: ErrorCode[] = [
  ErrorCode.SessionInvalid,
  ErrorCode.NotifySessionClosed,
  ErrorCode.NotifyNewConnectionHasOpened,
  ErrorCode.SessionDoesNotExist,
];

const supportedErrorCodes = Object.values(ErrorCode).filter(
  (code): code is ErrorCode => !isNaN(Number(code))
);

export type ServerErrorMessage = z.infer<typeof serverErrorMessageSchema>;

export const isErrorCodeSupported = (
  errorCode: number
): errorCode is ErrorCode => {
  return supportedErrorCodes.includes(errorCode);
};

export const findErrorCodeByErrorMessage = (
  errorMessage: string
): ErrorCode | null => {
  for (const [errorText, errorCode] of Object.entries(
    errorTextToErrorCodeMap
  )) {
    if (errorMessage.trim().includes(errorText.trim())) {
      return errorCode;
    }
  }
  // trying to get the error code from the message
  // {"type":7,"error":"Connection closed with an error. HubException: Operation failed with error code 501."}
  const match = errorMessage.match(/\d+/);
  if (match) {
    const errorCode = parseInt(match[0], 10);
    if (errorCode in ErrorCode) {
      return errorCode as ErrorCode;
    }
  }
  return null;
};
