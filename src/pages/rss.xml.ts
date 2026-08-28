import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/content';
import { localePath, splitId } from '../i18n/ui';
import { ui } from '../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getPosts('zh-tw');
  return rss({
    title: 'Kimmy — 筆記',
    description: ui['zh-tw']['blog.description'],
    site: context.site ?? 'https://example.com',
    trailingSlash: false,
    customData: '<language>zh-TW</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.pubDate,
      categories: p.data.tags,
      link: localePath('zh-tw', `/blog/${splitId(p.id).slug}`),
    })),
  });
}
