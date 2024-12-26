import { LogData, LogLevel } from "./types.js";

export class Logger {
  private sessionId: string;

  protected _url =
    "https://kafka-api.geekslots.studio/topics/development-example";

  constructor(url: string) {
    this.url = url;
    this.sessionId = "";
  }

  public setSessionId(id: string): void {
    this.sessionId = id;
  }

  protected async log(
    data: object,
    level: LogLevel,
    url?: string
  ): Promise<void> {
    const body = {
      records: [{ value: { ...data, level } }],
    };
    fetch(url ?? this.url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    })
      .then()
      .catch((error) => {
        console.error(
          "@slotplate/log: Failed to send log due to a network error:",
          error
        );
      });
  }

  public logInfo<S>(data: LogData<S>): void {
    const { requestType, success, startMS, payload } = data;
    this.info({
      event: `api-${requestType}`,
      responseMS: Math.floor(Date.now() - startMS),
      session: {
        hostname: window.location?.hostname,
        referrer: Logger.getReferrer(),
        sessionId: this.sessionId ?? undefined,
      },
      payload,
      success,
    });
  }

  private static getReferrer(): string | undefined {
    let referer: string | undefined = "";

    try {
      referer = window?.frames?.top?.document?.referrer;
    } catch (e) {
      return "";
    }

    return referer;
  }

  /**
   * Logs message at Error level
   */
  public async error(data: object, url?: string) {
    this.log(data, LogLevel.Error, url);
  }

  /**
   * Logs message at Warn level
   */
  public async warn(data: object, url?: string) {
    this.log(data, LogLevel.Warn, url);
  }

  /**
   * Logs message at Info level
   */
  public async info(data: object, url?: string) {
    this.log(data, LogLevel.Info, url);
  }

  /**
   * Logs message at Debug level
   */
  public async debug(data: object, url?: string) {
    this.log(data, LogLevel.Debug, url);
  }

  /**
   * Provides URL for logging
   */
  public get url(): string {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
  }

  /**
   * Provides headers for logging - override it in game if
   * REST request different headers
   */
  protected get headers(): HeadersInit {
    return { "Content-Type": "application/vnd.kafka.json.v2+json" };
  }
}
