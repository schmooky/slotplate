import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  ErrorCode,
  ErrorText,
  findErrorCodeByErrorMessage,
  isErrorCodeSupported,
  ServerErrorMessage,
} from "./error.js";
import {
  ErrorDataType,
  IResponse,
  NotifyBalanceResponse,
  RequestStatus,
} from "./types.js";
import { getServerURLFromHref, getServerURLFromQuery } from "./utils.js";
import i18nNetwork from "./i18nNetwork.js";
import { Logger } from "./logger/logger.js";
import { isServerErrorMessage } from "./validators.js";

declare const SERVER_DOMAIN: string | undefined;

export class NetworkManager {
  protected serverDomain?: string =
    (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN || undefined;

  protected gameId?: string;

  protected url?: string;

  protected sessionId?: string;

  public connection?: HubConnection;

  protected resolves: Set<(value: IResponse | PromiseLike<IResponse>) => void> =
    new Set();

  public logger: Logger;

  protected notifyError: ErrorCode | null = null;

  constructor(
    protected urlLogger: string,
    protected lng = "en",
    protected onErrorCallback?: (error: IResponse) => void,
    protected onNotifyBalanceCallback?: (data: NotifyBalanceResponse) => void
  ) {
    this.logger = new Logger(urlLogger);
    this.setupLanguage(lng);
  }

  /**
   * Set up the language for the application.
   *
   * @param {string} lng - the language to set
   * @return {Promise<void>} a Promise that resolves once the language is set up
   */
  protected setupLanguage(lng: string): void {
    i18nNetwork.changeLanguage(lng);
  }

  private getConnection = (): void => {
    if (!this.url) throw new Error("No URL");
    this.connection = new HubConnectionBuilder()
      .withUrl(this.url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      // withAutomaticReconnect для корректной работы после разблокировки девайса на iOS/android
      .withAutomaticReconnect([0, 5000, 5000, 5000, 5000])
      .configureLogging(LogLevel.Information)
      .build();
  };

  public async start(options: {
    gameId: string;
    sessionId: string;
    url?: string;
  }): Promise<void> {
    this.init(options.gameId, options.sessionId, options.url);
    this.getConnection();
    this.subscribe();
    try {
      await this.connection?.start();
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.handleHubError(err);
      }
    }
  }

  protected init(gameId: string, sessionId: string, url?: string) {
    this.gameId = gameId;
    this.sessionId = sessionId;
    this.logger.setSessionId(sessionId);
    this.url = this.serverDomain
      ? getServerURLFromHref(
          `https://${this.serverDomain}`,
          this.gameId,
          this.sessionId
        )
      : getServerURLFromQuery(gameId) || url;
  }

  /**
   * Subscribe to WebSocket Notifications
   * ```mermaid
   * sequenceDiagram
   *   participant Server
   *   participant Client
   *   Server->>Client: NotifySessionClosed
   *   Note right of Client: Show 1001 Error
   *   Server->>Client: NotifyNewConnectionHasOpened
   *   Note right of Client: Show 1002 Error
   * ```
   */
  private subscribe = (): void => {
    if (!this.connection) {
      throw new Error("Atempting to get subscribe on broken connection.");
    }

    this.connection?.on("NotifyBalanceChanged", (data: NotifyBalanceResponse) =>
      this.onNotifyBalanceCallback?.(data)
    );

    this.connection.on("NotifySessionClosed", () => {
      this.notifyError = ErrorCode.NotifySessionClosed;
      this.onErrorCallback?.({
        status: RequestStatus.Error,
        errorData: {
          errorId: ErrorCode.NotifySessionClosed,
          header: i18nNetwork.t(`${ErrorCode.NotifySessionClosed}.header`)!,
          description: i18nNetwork.t(
            `${ErrorCode.NotifySessionClosed}.content`
          )!,
        },
      });
    });

    this.connection.on("NotifyNewConnectionHasOpened", () => {
      this.notifyError = ErrorCode.NotifyNewConnectionHasOpened;
      this.onErrorCallback?.({
        status: RequestStatus.Error,
        errorData: {
          errorId: ErrorCode.NotifyNewConnectionHasOpened,
          header: i18nNetwork.t(
            `${ErrorCode.NotifyNewConnectionHasOpened}.header`
          )!,
          description: i18nNetwork.t(
            `${ErrorCode.NotifyNewConnectionHasOpened}.content`
          )!,
        },
      });
      // принудительная остановка, чтобы не отработал withAutomaticReconnect,
      // после NotifyNewConnectionHasOpened Reconnect не нужен
      this.stop();
    });
  };

  /**
   * Sets a callback function to handle error notifications.
   *
   * @param {Function} handler - The callback function to handle error notifications.
   * @return {void}
   */
  public addErrorCallback(handler: (error: IResponse) => void): void {
    this.onErrorCallback = handler;
  }

  public async stop(): Promise<void> {
    try {
      await this.connection?.stop();
      this.connection = undefined;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.handleHubError(err);
      }
    }
  }

  /**
   * A function that sends a game request with optional payload data,
   * validates the response, and returns a promise with the response data.
   *
   * @param {Object} request - An object containing the requestType and optional payload data.
   * @param {Function} [validator] - An optional function to validate the response.
   * @return {Promise<IResponse>} A promise that resolves with the response data.
   */

  public async gameRequest<T, S = undefined>(
    request: { requestType: string; payload?: S },
    validator?: (response: unknown) => response is T
  ): Promise<IResponse<T>> {
    return new Promise((resolve) => {
      this.resolves.add(resolve);
      const startMS = Date.now();
      let success = false;
      const args: [string, ...any[]] = request.payload
        ? [request.requestType, request.payload]
        : [request.requestType];
      this.connection!.invoke.apply(this.connection, args)
        .then((response) => {
          success = this.handleResponse<T>(response as T, resolve, validator);
          this.resolves.delete(resolve);
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            this.handleHubError(
              this.connection?.state === "Reconnecting"
                ? new Error(ErrorText.ConnectionLost)
                : error,
              resolve
            );
            this.resolves.delete(resolve);
          }
        })
        .finally(() => {
          this.logger.logInfo<S>({
            requestType: request.requestType,
            success,
            startMS,
            payload: request.payload,
          });
        });
    });
  }

  private handleResponse<T>(
    response: T,
    resolve: (value: IResponse | PromiseLike<IResponse>) => void,
    validator: ((response: unknown) => response is T) | undefined
  ): boolean {
    if (isServerErrorMessage(response)) {
      this.handleResponseError(response, resolve);
      return false;
    }
    if (!validator) {
      resolve({ data: response, status: RequestStatus.Done });
      return true;
    }

    if (validator(response)) {
      resolve({ data: response, status: RequestStatus.Done });
      return true;
    }

    resolve({
      errorData: {
        errorId: ErrorCode.ValidationError,
        header: i18nNetwork.t(`${ErrorCode.ValidationError}.header`)!,
        description: i18nNetwork.t(`${ErrorCode.ValidationError}.content`)!,
      },
      status: RequestStatus.Error,
    });
    return false;
  }

  protected handleResponseError = (
    response: ServerErrorMessage,
    resolve: (value: IResponse | PromiseLike<IResponse>) => void
  ) => {
    const errorId = isErrorCodeSupported(response.errorId)
      ? response.errorId
      : ErrorCode.UnexpectedError;

    const errorData: ErrorDataType = {
      errorId: response.errorId,
    };

    if (isErrorCodeSupported(response.errorId)) {
      errorData.header = i18nNetwork.t(`${errorId}.header`)!;
      errorData.description = i18nNetwork.t(`${errorId}.content`)!;
    } else {
      errorData.errorMessage = response.errorMessage!;
    }

    resolve({
      errorData,
      status: RequestStatus.Error,
    });
  };

  protected handleHubError = (
    error: Error,
    resolve?: (value: IResponse | PromiseLike<IResponse>) => void
  ): void => {
    const errorData = error.message.match(/\d{3}/) || [500];
    const errorId = findErrorCodeByErrorMessage(error.message) || +errorData[0];
    const resolveData = {
      errorData: {
        errorMessage: error.message,
        header: i18nNetwork.t(`${errorId}.header`)!,
        description: i18nNetwork.t(`${errorId}.content`)!,
        errorId,
      },
      status: RequestStatus.Error,
    };

    if (resolve) {
      resolve(resolveData);
    } else {
      this.onErrorCallback?.(resolveData);
    }
  };
}
