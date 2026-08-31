// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkCallout from './src/lib/remark-callout.mjs';

// ⚠️ 部署前請把 site 改成你的正式網址（影響 RSS、sitemap、og:url）
export default defineConfig({
  site: 'https://itskimmy.pages.dev',
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
    // remarkDirective 先解析 ::: 語法，remarkCallout 再把它變成提示框
    remarkPlugins: [remarkDirective, remarkCallout],
    rehypePlugins: [
      // Astro 內建的 rehypeHeadingIds 預設排在使用者 plugin 之後，
      // 那時 autolink 還看不到 id、會整個跳過。這裡先手動跑一次產生 id。
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: '#' }] },
        },
      ],
    ],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
