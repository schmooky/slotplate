# create-slotplate

## 0.2.0

### Minor Changes

- [`81129db`](https://github.com/schmooky/slotplate/commit/81129dbae67c4add026125f3b81669eb941c3fa7) Thanks [@schmooky](https://github.com/schmooky)! - Add: in-page test bridge, inspector overlay, and Playwright behavior scenarios.

  - **TestBridge** on `window.__SLOTPLATE_TEST` when the URL has `?test=<id>` — script every server response, simulate offline, click Pixi nodes by `Container.label`, pause/resume the GSAP ticker, snapshot the canvas.
  - **Inspector overlay** with seven tabs (state / queue / a11y / history / transitions / rec / snap) and a **pop-out** into a separate browser tab via BroadcastChannel RPC.
  - **Recorder** captures every bridge call and exports a runnable `.spec.ts` from the inspector — zero-code authoring for QA.
  - **11 Playwright scenarios** (33 tests) covering happy path, network failure, autospin, replay, perf, a11y, locale matrix, and recorder. Auto-attached `bridge-dump.json` on every failure.
  - **Stub swap is automation-only**: humans opening `?test=...` in a normal browser see the full Pixi pipeline; Playwright (`navigator.webdriver === true`) gets `InstantTicker` + `StubReelsEngine` so the suite finishes in ~30s. Override with `&stubs=0` / `&stubs=1`.
  - **Auxiliary**: `pnpm test:catalog` (auto-generated `tests/scenarios/CATALOG.md`), `pnpm test:components` (`docs/COMPONENTS.md`), `pnpm test:contract` (gated on `RGS_API_URL`), `pnpm test:import-log` (server log → replay fixture), GitHub Actions `scenarios.yml`.
  - **Background system**: tiled `BackgroundLayer` with six Kenney prototype textures, swappable via `THEME.background`. Power-of-two PNGs, integer-pixel rounding, scaled by the shorter viewport edge so portrait and landscape match.
  - **Modals**: imperative `modals.alert()` / `confirm()` / `show()` API with Esc + backdrop dismiss.
  - **Balance contract pinned**: `WinShowPhase` no longer double-credits — `setBalance(response.balance)` is the post-win source of truth, with `tests/flow/balance-contract.test.ts` as a guard.
  - **Biome on `recommended`**: zero lint errors across `src/` + `tests/`. Architectural guards (`noRestrictedGlobals` for `setTimeout`, layered `noRestrictedImports`) preserved.
