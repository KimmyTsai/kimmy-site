import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../lib/content';
import { localePath, splitId, ui } from '../../i18n/ui';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: 'Kimmy — Notes',
    description: ui.en['blog.description'],
    site: context.site ?? 'https://example.com',
    trailingSlash: false,
    customData: '<language>en</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.pubDate,
      categories: p.data.tags,
      link: localePath('en', `/blog/${splitId(p.id).slug}`),
    })),
  });
}
