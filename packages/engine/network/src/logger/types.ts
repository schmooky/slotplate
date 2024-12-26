/**
 * Log levels used in games
 */
export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
}

export interface LogData<S = unknown> {
  requestType: string;
  success: boolean;
  startMS: number;
  payload: S | undefined;
}
