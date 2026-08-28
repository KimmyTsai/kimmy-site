// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// ⚠️ 部署前請把 site 改成你的正式網址（影響 RSS、sitemap、og:url）
export default defineConfig({
  site: 'https://kimmy.dev',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['zh-tw', 'en'],
    defaultLocale: 'zh-tw',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'zh-tw',
        locales: { 'zh-tw': 'zh-TW', en: 'en' },
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
