# Changesets

This folder is the source of truth for `create-slotplate` releases. Changesets reads `.md` files in this directory, decides the next version bump, regenerates `CHANGELOG.md`, and publishes to npm.

## Quick reference

| Action | Command |
|--------|---------|
| Add a new changeset (run this in your PR) | `pnpm changeset` |
| See what would be released | `pnpm changeset:status` |
| Apply pending changesets locally (CI does this in the version PR) | `pnpm version-packages` |
| Publish (CI does this on merge of the version PR) | `pnpm release` |

## How it ships

1. Open a PR with your change.
2. If it's user-visible (new feature, bug fix, template change), run `pnpm changeset` from the repo root and pick **patch / minor / major**.
3. The command creates `.changeset/<random-name>.md`. Edit the summary to read like a changelog line aimed at someone using `npx create-slotplate`.
4. Commit that file. Get the PR reviewed.
5. When the PR merges to `main`:
   - If pending changesets exist → CI opens (or updates) a **"Version Packages"** PR that bumps the version, regenerates `CHANGELOG.md`, and removes the consumed `.md` files.
   - When that Version Packages PR merges → CI runs `pnpm release`, which publishes the bumped package to npm.

So nothing publishes on a normal commit. You opt in by adding a changeset, and a final review gate (the Version Packages PR) lands the actual release.

## Bump kinds

- **patch**: bug fixes, dependency bumps, internal refactors with no observable change in scaffolded output.
- **minor**: additive changes — new templates, new bridge methods, new docs that ship as part of the package.
- **major**: anything that changes the shape of `pnpm create slotplate` output in a way an existing user would have to react to (renamed scripts, removed files, breaking config defaults).

Slotplate is pre-`1.0.0` so we keep it loose, but consumers still appreciate honest signals.

## Snapshot releases (preview tags)

Push to any branch other than `main` and `.github/workflows/snapshot.yml` will publish a snapshot under a per-branch dist-tag, e.g. `pnpm create slotplate@feat-shiny`. Useful for QA without disturbing `latest`.

## Skipping a changeset

Pure-internal changes (CI tweaks, formatting, repo housekeeping, docs site copy) don't ship to consumers, so they don't need a changeset. CI won't fail on a missing one — but it also won't release without one.
