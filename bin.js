#!/usr/bin/env node
// create-slotplate — scaffold a new slot game from the slotplate template.
//
// Usage: npm create slotplate [dir] [--yes]

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import kleur from 'kleur';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = join(__dirname, 'template');

// Files renamed when copied (npm strips real .gitignore etc. from published packages).
const RENAMES = new Map([
  ['_gitignore', '.gitignore'],
  ['_npmrc', '.npmrc'],
  ['_env.example', '.env.example'],
]);

// Never copy these — they're build artifacts or local caches.
const SKIP = new Set([
  'node_modules',
  'dist',
  'coverage',
  '.assetpack-cache',
  '.vite',
  '.astro',
  'tsconfig.tsbuildinfo',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  // Playwright + screenshot test outputs from the template's own runs.
  'playwright-report',
  'playwright-report-scenarios',
  'test-results',
  'test-results-scenarios',
]);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

async function main() {
  console.log();
  console.log(kleur.bold().magenta('  slotplate ') + kleur.gray('— opinionated slot boilerplate on pixi-reels'));
  console.log();

  let targetDir = positional[0];
  const isYes = flags.has('--yes') || flags.has('-y');

  if (!targetDir) {
    const { name } = await prompts({
      type: 'text',
      name: 'name',
      message: 'Project directory',
      initial: 'my-slot',
    });
    if (!name) process.exit(1);
    targetDir = name;
  }

  const absTarget = resolve(process.cwd(), targetDir);
  const projectName = targetDir.split('/').pop() || 'my-slot';

  if (existsSync(absTarget) && readdirSync(absTarget).length > 0) {
    if (!isYes) {
      const { go } = await prompts({
        type: 'confirm',
        name: 'go',
        message: `${kleur.yellow(relative(process.cwd(), absTarget))} is not empty. Continue?`,
        initial: false,
      });
      if (!go) process.exit(1);
    }
  }

  mkdirSync(absTarget, { recursive: true });

  copyDir(TEMPLATE_DIR, absTarget, projectName);

  console.log();
  console.log(kleur.green('  ✓ ') + `created ${kleur.bold(relative(process.cwd(), absTarget) || '.')}`);
  console.log();
  console.log(kleur.bold('  Next steps:'));
  console.log();
  console.log(`    ${kleur.cyan('cd')} ${relative(process.cwd(), absTarget) || '.'}`);
  console.log(`    ${kleur.cyan('pnpm install')}   ${kleur.gray('# or npm / yarn')}`);
  console.log(`    ${kleur.cyan('pnpm dev')}`);
  console.log();
  console.log(kleur.gray('  Docs: https://slotplate.dev'));
  console.log(kleur.gray('  Agents: read CLAUDE.md in the project root'));
  console.log();
}

function copyDir(from, to, projectName) {
  for (const entry of readdirSync(from)) {
    if (SKIP.has(entry)) continue;
    const src = join(from, entry);
    const renamed = RENAMES.get(entry) ?? entry;
    const dst = join(to, renamed);
    const stat = statSync(src);
    if (stat.isDirectory()) {
      mkdirSync(dst, { recursive: true });
      copyDir(src, dst, projectName);
    } else if (entry === 'package.json') {
      const pkg = JSON.parse(readFileSync(src, 'utf8'));
      pkg.name = projectName;
      writeFileSync(dst, JSON.stringify(pkg, null, 2) + '\n');
    } else {
      copyFileSync(src, dst);
    }
  }
}

main().catch((err) => {
  console.error(kleur.red('create-slotplate failed:'), err);
  process.exit(1);
});
