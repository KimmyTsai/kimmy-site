import { getCollection, type CollectionEntry } from 'astro:content';
import { splitId, DEFAULT_LOCALE, type Locale } from '../i18n/ui';

const showDrafts = import.meta.env.DEV;

/** 某語系的文章，新的在前 */
export async function getPosts(locale: Locale): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog');
  return all
    .filter((e) => splitId(e.id).locale === locale)
    .filter((e) => showDrafts || !e.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects(locale: Locale): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects');
  return all
    .filter((e) => splitId(e.id).locale === locale)
    .filter((e) => showDrafts || !e.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getCompetitions(locale: Locale): Promise<CollectionEntry<'competitions'>[]> {
  const all = await getCollection('competitions');
  return all
    .filter((e) => splitId(e.id).locale === locale)
    .filter((e) => showDrafts || !e.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * 產生某語系的靜態路徑。若該語系缺這篇（例如只寫了中文版），
 * 就不會產生對應的英文頁，語言切換鈕也會自動變灰。
 */
export function toPaths<T extends { id: string }>(entries: T[]) {
  return entries.map((entry) => ({
    params: { slug: splitId(entry.id).slug },
    props: { entry },
  }));
}

/** 這個 slug 有哪些語言版本 */
export async function localesFor(
  collection: 'blog' | 'projects' | 'competitions',
  slug: string,
): Promise<Locale[]> {
  const all = await getCollection(collection as any);
  const out = all
    .filter((e: any) => splitId(e.id).slug === slug)
    .filter((e: any) => showDrafts || !e.data.draft)
    .map((e: any) => splitId(e.id).locale);
  return out.length ? (out as Locale[]) : [DEFAULT_LOCALE];
}

/** 粗略估算閱讀時間：中文以字數、英文以詞數 */
export function readingTime(body: string, locale: Locale): number {
  if (locale === 'zh-tw') {
    const chars = (body.match(/[一-鿿]/g) ?? []).length;
    const words = body.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(chars / 400 + words / 220));
  }
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
}
