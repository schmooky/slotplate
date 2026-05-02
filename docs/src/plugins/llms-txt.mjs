// Astro integration — emits llms.txt and llms-full.txt after the build.
// Walks the built dist/ HTML and extracts <title> + <article> contents so
// it works for .astro, .mdx, whatever.
//
// https://llmstxt.org

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SITE_ROOT = 'https://slotplate.dev';

export function llmsTxtIntegration() {
  return {
    name: 'slotplate-llms-txt',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = dir.pathname.replace(/\/$/, '');
        mkdirSync(outDir, { recursive: true });

        const pages = collectBuiltPages(outDir);

        const index = [
          '# slotplate',
          '',
          '> Opinionated client boilerplate for slot games on pixi-reels. FSM-driven, server-authoritative, agent-ready.',
          '',
          '## Docs',
          '',
          ...pages.map((p) => `- [${p.title}](${SITE_ROOT}${p.url})${p.description ? `: ${p.description}` : ''}`),
          '',
        ].join('\n');

        const full = [
          '# slotplate — full docs',
          '',
          'This file is the entire documentation of slotplate concatenated for',
          'AI agents. Each page is separated by a horizontal rule.',
          '',
          ...pages.flatMap((p) => [
            `\n\n---\n\n# ${p.title}\n`,
            `URL: ${SITE_ROOT}${p.url}`,
            p.description ? `\n> ${p.description}\n` : '',
            '',
            p.body.trim(),
          ]),
          '',
        ].join('\n');

        writeFileSync(join(outDir, 'llms.txt'), index);
        writeFileSync(join(outDir, 'llms-full.txt'), full);
        logger.info(`emitted llms.txt (${pages.length} pages) and llms-full.txt`);
      },
    },
  };
}

function collectBuiltPages(distDir) {
  const pages = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      const s = statSync(full);
      if (s.isDirectory()) {
        walk(full);
      } else if (entry === 'index.html') {
        const raw = readFileSync(full, 'utf8');
        const parsed = extractFromHtml(raw);
        if (!parsed) continue;
        const rel = relative(distDir, full).replace(/index\.html$/, '');
        const url = `/${rel}`;
        pages.push({
          url: url.replace(/\/+/g, '/'),
          ...parsed,
        });
      }
    }
  };
  walk(distDir);
  // sort: / first, then /docs/*, /architecture/*, etc.
  pages.sort((a, b) => {
    const order = ['/', '/docs/', '/architecture/', '/concepts/', '/guides/', '/patterns/'];
    const oa = order.findIndex((p) => a.url === p || a.url.startsWith(p));
    const ob = order.findIndex((p) => b.url === p || b.url.startsWith(p));
    return oa === ob ? a.url.localeCompare(b.url) : oa - ob;
  });
  return pages;
}

function extractFromHtml(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  // Body = inside <article>…</article>. Fallback to <main>.
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  const mainMatch = articleMatch ?? html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch || !titleMatch) return null;
  const title = (titleMatch[1] ?? '').replace(/\s*·\s*slotplate$/, '').trim();
  const description = descMatch?.[1]?.trim();
  const body = htmlToMarkdownish(mainMatch[1] ?? '');
  return { title, description, body };
}

function htmlToMarkdownish(html) {
  return (
    html
      // drop scripts/styles/svg
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<svg[\s\S]*?<\/svg>/g, '[diagram]')
      // headings
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, '\n\n# $1\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '\n\n## $1\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '\n\n### $1\n')
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, '\n\n#### $1\n')
      // code & pre
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '\n\n```\n$1\n```\n')
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
      // list items
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1\n')
      .replace(/<\/?[uo]l[^>]*>/g, '\n')
      // paragraphs, blocks
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '\n\n$1\n')
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, '\n\n> $1\n')
      // links: keep text + href
      .replace(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
      // inline emphasis
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*')
      // strip remaining tags
      .replace(/<[^>]+>/g, '')
      // html entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(Number(c)))
      // collapse whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
