// MockNetworkManager — offline fake server. Produces plausible responses
// so the client can render something during development. In production,
// swap for HttpNetworkManager / WebSocketNetworkManager / your custom
// adapter — the shapes stay the same; this class goes away.
//
// The mock is NOT the math. Do not extend it with paytable logic — the
// client has no business evaluating wins. For reproducible local math,
// run a real server in dev and point VITE_API_URL at it.

import type { SessionRequest, SessionResponse, SpinRequest, SpinResponse } from '@/domain/types';
import type { NetworkManager } from './types';

export interface MockNetworkOptions {
  symbolIds: readonly string[];
  columns: number;
  rows: number;
  /** Simulated latency for session/spin, in ms. Defaults to realistic values. */
  latency?: { session?: number; spin?: number };
  /** Simulated starting balance. Server will be authoritative in real adapters. */
  startingBalance?: number;
}

export class MockNetworkManager implements NetworkManager {
  private balance: number;
  private readonly latency: { session: number; spin: number };

  constructor(private readonly opts: MockNetworkOptions) {
    this.balance = opts.startingBalance ?? 100;
    this.latency = {
      session: opts.latency?.session ?? 650,
      spin: opts.latency?.spin ?? 480,
    };
  }

  async session(_req: SessionRequest): Promise<SessionResponse> {
    await wait(this.latency.session + jitter(180));
    return {
      sessionId: `mock-${Math.random().toString(36).slice(2, 10)}`,
      balance: this.balance,
      currency: 'USD',
      availableBets: [0.2, 0.5, 1, 2, 5, 10, 25, 50, 100],
      defaultBet: 1,
      columns: this.opts.columns,
      rows: this.opts.rows,
    };
  }

  async spin(req: SpinRequest): Promise<SpinResponse> {
    await wait(this.latency.spin + jitter(120));
    this.balance = Math.max(0, this.balance - req.bet);
    const pickSymbol = (): string => {
      const ids = this.opts.symbolIds;
      const id = ids[Math.floor(Math.random() * ids.length)];
      if (id === undefined) throw new Error('[MockNetworkManager] symbolIds is empty');
      return id;
    };
    const grid = Array.from({ length: this.opts.columns }, () => Array.from({ length: this.opts.rows }, pickSymbol));
    // No winlines from the mock — a real server would evaluate and return them.
    return { grid, totalWin: 0, winlines: [], balance: this.balance };
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => globalThis.setTimeout(r, ms));
}
function jitter(spread: number): number {
  return (Math.random() - 0.5) * spread * 2;
}
