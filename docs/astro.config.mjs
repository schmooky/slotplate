import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { llmsTxtIntegration } from './src/plugins/llms-txt.mjs';

export default defineConfig({
  site: 'https://slotplate.dev',
  integrations: [mdx(), react(), sitemap(), llmsTxtIntegration()],
  vite: {
    plugins: [tailwindcss()],
  },
});
