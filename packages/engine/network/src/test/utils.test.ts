import { getServerOverrideURL, getServerURLFromHref } from "../utils.js";

describe("test getServerURLFromHref function", () => {
  const arbitraryLinkWithSlash =
    "https://arbitary.domain/phoenix-feature-branch?sessionId=777&lng=EN&gameId=phoenix";
  const arbitraryLinkWithoutSlash =
    "https://arbitary.domain/phoenix-feature-branch/?sessionId=777&lng=EN&gameId=phoenix";
  const expectedArbitraryLink =
    "wss://arbitary.domain/api/phoenix/slot?sessionId=777";

  test("arbitrary link", () => {
    const result = [
      getServerURLFromHref(arbitraryLinkWithSlash, "phoenix", "777"),
      getServerURLFromHref(arbitraryLinkWithoutSlash, "phoenix", "777"),
    ].every((url) => url === expectedArbitraryLink);
    expect(result).toBe(true);
  });

  const reviewLink =
    "https://review.geekslots.studio/phoenix-feature-branch??sessionId=777&lng=EN&gameId=phoenix";

  const expectedServerReviewLink =
    "wss://dev.geekslots.studio/api/phoenix/slot?sessionId=777";

  test("review link", () => {
    const serverUrl = getServerURLFromHref(reviewLink, "phoenix", "777");
    const res = serverUrl === expectedServerReviewLink;
    expect(res).toBe(true);
  });
});

describe("test getServerOverrideURL function", () => {
  const overrideServerLinkWithoutSlash =
    "wss://server.override.studio/api/phoenix";
  const expectedOverrideServerLink =
    "wss://server.override.studio/api/phoenix/slot?sessionId=777";

  test("trailing / server override URL", () => {
    const result = [
      getServerOverrideURL("777", overrideServerLinkWithoutSlash),
    ].every((url) => url === expectedOverrideServerLink);
    expect(result).toBe(true);
  });
});
