# slotplate

Opinionated boilerplate for slot games built on [`pixi-reels`](https://github.com/schmooky/pixi-reels).

```bash
npm create slotplate my-slot
cd my-slot
pnpm install
pnpm dev
```

## What's in this repo

```
slotplate/
├── bin.js              create-slotplate CLI — what `npm create` runs
├── template/           the boilerplate copied into new projects
└── docs/               Astro + Starlight docs site, deployed to slotplate.dev
```

- The **root package** is `create-slotplate`. It is what people install.
- The **template** is the project you get. It is opinionated: MobX stores, FSM phase handlers, pure domain, GSAP-driven timing, `pixi-reels` behind one presenter, agent rules committed.
- The **docs** site lives in `docs/` and deploys independently. It reads `../template/` at build time so code examples never drift.

## Principles

1. Domain imports nothing from pixi or mobx.
2. Time is owned by the FSM; no `setTimeout` in game code — use `ticker.schedule`.
3. Views present state; presenters don't decide *when*.
4. State mutates only through actions.
5. Every subsystem is `Disposable`; teardown cascades.
6. Fail loud — no silent catches, no untyped escape hatches.
7. One composition root.
8. `pixi-reels` sits behind one presenter.
9. Paytables and reelstrips are data, not code.
10. Every phase is a file; every file is testable without a canvas.
11. The docs exist to be read by humans AND agents.

See [docs/src/content/docs/principles.mdx](docs/src/content/docs/principles.mdx) for the long-form versions.

## Working in this repo

```bash
pnpm install                  # bootstraps root + docs (template is independent)
pnpm dev                      # serves docs site at http://localhost:4321
pnpm build                    # builds docs/dist (Astro + sitemap + llms.txt)
pnpm lint                     # biome on docs/
pnpm test:cli                 # scaffolds the CLI into a temp dir as a smoke test
```

The `template/` directory is the scaffold output, not a workspace member —
its lockfile and node_modules stay independent so the scaffolded project
resolves cleanly. `cd template && pnpm install` to work on it directly.

## Releasing

Releases are managed by [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset                # describe your change (patch / minor / major)
git add .changeset/*.md && git commit -m "feat: describe it"
git push                      # PR + merge to main
```

When a PR with a `.changeset/*.md` lands on `main`, `release.yml` opens a
**"Version Packages"** PR. Merging that PR triggers `pnpm release`, which
publishes `create-slotplate` to npm. See [`.changeset/README.md`](.changeset/README.md).

Snapshot previews ship from any non-main branch with a pending changeset:
`pnpm dlx create-slotplate@<branch-name> my-app`.

## Contributing

- Open an issue before a large PR.
- One logical change per PR.
- Run `pnpm changeset` when the change is user-visible.
- `docs/` deploys on merge to `main`.

## License

MIT
