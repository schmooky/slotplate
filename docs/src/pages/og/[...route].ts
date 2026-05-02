// Per-page OG image generator.
//
// astro-og-canvas paints title, description, and the slotplate brand mark
// onto a 1200x630 PNG keyed by route. Output lives at
// `https://slotplate.dev/og/<route>.png`. Base.astro chooses the URL via
// `Astro.url.pathname` so every meta tag references the matching image.
//
// Pages not enumerated in OG_PAGES fall back to the static og-default.png
// in /public — Base.astro decides.

import { OGImageRoute } from 'astro-og-canvas';
import { OG_PAGES } from '../../lib/og-pages';

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: OG_PAGES,
  // The renderer is a single function called once per page entry.
  getImageOptions: (_path, page) => ({
    // astro-og-canvas renders {title, description}. We prepend the section
    // eyebrow to the description ("Architecture · How the layers fit…") so
    // the card has section context without overloading the title.
    title: page.title,
    description:
      page.eyebrow && page.eyebrow.toLowerCase() !== page.title.toLowerCase()
        ? `${page.eyebrow} · ${page.description}`
        : page.description,
    bgGradient: [
      [12, 10, 24],
      [30, 18, 56],
    ],
    border: { color: [139, 92, 246], width: 16, side: 'inline-start' },
    padding: 80,
    font: {
      title: {
        size: 76,
        families: ['Inter'],
        color: [240, 240, 250],
        weight: 'Bold',
        lineHeight: 1.18,
      },
      description: {
        size: 30,
        families: ['Inter'],
        color: [180, 175, 200],
        weight: 'Normal',
        lineHeight: 1.45,
      },
    },
    // canvaskit-wasm has no system fonts — every typeface used in `font`
    // must be provided here as a TTF/OTF URL. Inter Bold + Regular cover
    // the title and description.
    fonts: [
      'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf',
    ],
  }),
});
