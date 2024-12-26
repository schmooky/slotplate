import {
  CustomResponseType,
  ErrorCode,
  isSessionBase,
  NetworkManager,
  RequestStatus,
  sessionBaseSchema,
} from "../../index.js";
import "./window.mock";
/* eslint-disable */

const storeMock = {
  networkErrorStore: {
    rootStore: {},
    isReconnecting: false,
    error: null,
    errorId: null,
    setError: () => {},
    setIsReconnecting: (v: boolean) => {},
    clearError: () => {},
  },
  freeRoundCampaignStore: {
    rootStore: {},

    availability: true,
    active: true,
    showWinModal: true,
    needToReload: false,
    data: null,

    setAvailability: (value: boolean) => {},
    setActive: (value: boolean) => {},
    setData: (data: unknown) => {},
    setShowWinModal: (value: boolean) => {},
    setNeedToReload: (value: boolean) => {},
  },
};

const gameId = "phoenix";
const sessionId = "777";

describe("Tests of server domain override", () => {
  class NetworkHandlerTestWrapped extends NetworkManager {
    public getUrl(): string | undefined {
      return this["url"];
    }
  }

  test("server domain is undefined:", () => {
    (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN = undefined;
    window.location.href = "https://test.domain/phoenix-feature-branch";
    window.location.search = "sessionId=777&lng=EN&gameId=phoenix";

    const expectResult = "wss://test.domain/api/phoenix/slot?sessionId=777";
    const networkHandler = new NetworkHandlerTestWrapped("");
    networkHandler["init"](gameId, sessionId);

    const result = networkHandler.getUrl() === expectResult;
    expect(result).toBe(true);
  });

  const testsData = [
    {
      name: "prod.geekslots.studio",
      inputs: ["prod.geekslots.studio"],
      expect: "wss://prod.geekslots.studio/api/phoenix/slot?sessionId=777",
    },
    {
      name: "rc.geekslots.studio",
      inputs: ["rc.geekslots.studio"],
      expect: "wss://rc.geekslots.studio/api/phoenix/slot?sessionId=777",
    },
    {
      name: "stable.geekslots.studio",
      inputs: ["stable.geekslots.studio"],
      expect: "wss://stable.geekslots.studio/api/phoenix/slot?sessionId=777",
    },
    {
      name: "dev.geekslots.studio",
      inputs: ["dev.geekslots.studio"],
      expect: "wss://dev.geekslots.studio/api/phoenix/slot?sessionId=777",
    },
    {
      name: "games.winspinity.com",
      inputs: ["games.winspinity.com"],
      expect: "wss://games.winspinity.com/api/phoenix/slot?sessionId=777",
    },
    {
      name: "games.gambit.win",
      inputs: ["games.gambit.win"],
      expect: "wss://games.gambit.win/api/phoenix/slot?sessionId=777",
    },
  ];

  testsData.forEach((data) => {
    test(`${data.name}`, () => {
      const results = data.inputs.map((input) => {
        (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN = input;
        const networkHandler = new NetworkHandlerTestWrapped("");
        networkHandler["init"](gameId, sessionId);
        const result = networkHandler.getUrl() === data.expect;
        return result;
      });

      const result = results.every((v) => v);
      expect(result).toBe(true);
    });
  });

  test("Current url is https://review.geekslots.studio/phoenix-feature-branch, server domain override is dev.geekslots.studio ", () => {
    (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN =
      "dev.geekslots.studio";
    window.location.href =
      "https://review.geekslots.studio/phoenix-feature-branch";
    window.location.search = "sessionId=777&lng=EN&gameId=phoenix";

    const expectResult =
      "wss://dev.geekslots.studio/api/phoenix/slot?sessionId=777";
    const networkHandler = new NetworkHandlerTestWrapped("");
    networkHandler["init"](gameId, sessionId);
    const result = networkHandler.getUrl() === expectResult;
    expect(result).toBe(true);
  });

  test("Current url is localhost, server domine override is dev.geekslots.studio ", () => {
    (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN =
      "dev.geekslots.studio";
    window.location.href = "http://localhost:8080";
    window.location.search = "sessionId=777&lng=EN&gameId=phoenix";

    const expectResult =
      "wss://dev.geekslots.studio/api/phoenix/slot?sessionId=777";
    const networkHandler = new NetworkHandlerTestWrapped("");
    networkHandler["init"](gameId, sessionId);
    const result = networkHandler.getUrl() === expectResult;
    expect(result).toBe(true);
  });

  test("Current url is https://review.geekslots.studio/phoenix-feature-branch, server domain is not override ", () => {
    (window as Window & { SERVER_DOMAIN?: string }).SERVER_DOMAIN = undefined;
    window.location.href =
      "https://review.geekslots.studio/phoenix-feature-branch";
    window.location.search = "sessionId=777&lng=EN&gameId=phoenix";

    const expectResult =
      "wss://dev.geekslots.studio/api/phoenix/slot?sessionId=777";
    const networkHandler = new NetworkHandlerTestWrapped("");
    networkHandler["init"](gameId, sessionId);
    const result = networkHandler.getUrl() === expectResult;
    expect(result).toBe(true);
  });
});

describe("Tests of server requests", () => {
  class NetworkHandlerTestWrapped extends NetworkManager {
    public mockSessionResponse: any = {
      securityHash: "hash",
      currency: "usd",
      startGameMode: 1,
      isDemo: false,
      freeRoundCampaign: null,
      gameSettings: {
        allowedBets: [0.1, 0.2, 0.5, 1, 2],
        availableAutoSpinCounts: [25, 50, 100],
      },
      round: {
        roundId: "roundId",
        bet: 0.5,
        balance: 100,
        totalWin: 0,
        nextGameMode: 1,
        endedUtc: "2022-12-12T00:00:00.000Z",
        spinResult: {
          win: 0,
        },
      },
    };
    public connection: any = {
      invoke: (args: any) => {
        return new Promise((resolve) => {
          resolve(this.mockSessionResponse);
        });
      },
    };

    public logger: any = {
      logInfo: () => {},
    };
  }

  test("session response is valid", async () => {
    const networkHandler = new NetworkHandlerTestWrapped("");

    const { status } = await networkHandler.gameRequest<
      CustomResponseType<typeof sessionBaseSchema>
    >(
      {
        requestType: "session",
      },
      isSessionBase
    );

    expect(status === RequestStatus.Done).toBe(true);
  });

  test("session response is invalid", async () => {
    const networkHandler = new NetworkHandlerTestWrapped("");
    networkHandler.mockSessionResponse = {
      ...networkHandler.mockSessionResponse,
      startGameMode: "1",
    };
    const data = await networkHandler.gameRequest<
      CustomResponseType<typeof sessionBaseSchema>
    >(
      {
        requestType: "session",
      },
      isSessionBase
    );

    expect(data.status === RequestStatus.Error).toBe(true);
    if (data.status === RequestStatus.Error) {
      expect(data.errorData.errorId === ErrorCode.ValidationError).toBe(true);
    }
  });
});
