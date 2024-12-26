const DEFAULT_SERVER = "dev.geekslots.studio";
const REVIEW_HOST = "review.geekslots.studio";

export const getSessionIdFromQuery = (): string | never => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get("sessionId");
  if (!sessionId) throw new Error("No Session ID in url");
  return sessionId;
};

export const getServerOverrideURL = (
  sessionId: string | null,
  serverOverride: string | null
): string => `${serverOverride}/slot?sessionId=${sessionId}`;

function isValidIP(str: string): boolean {
  const regex =
    // eslint-disable-next-line max-len
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(str);
}

export const getServerURLFromHref = (
  href: string,
  gameId: string,
  sessionId: string | null
): string => {
  const url = new URL(href);
  const isLocalhost = url.hostname === "localhost";
  const isReview = url.hostname === REVIEW_HOST;
  const isLocalHostByIp = isValidIP(url.hostname);

  url.pathname = `/api/${gameId}/slot`;
  url.search = `?sessionId=${sessionId}`;
  url.protocol = "wss:";

  if (isLocalhost || isReview || isLocalHostByIp) {
    url.hostname = DEFAULT_SERVER;
  }

  if (isLocalhost || isLocalHostByIp) {
    url.port = "";
  }

  return url.href;
};

export const getServerURLFromQuery = (gameId: string): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const queryGameId = urlParams.get("gameId") || gameId;
  const serverOverride = urlParams.get("gameServer");
  const sessionId = urlParams.get("sessionId");

  if (serverOverride) {
    return getServerOverrideURL(sessionId, serverOverride);
  }

  return getServerURLFromHref(window.location.href, queryGameId, sessionId);
};
