export const LOCALES = ['zh-tw', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh-tw';

export const localeNames: Record<Locale, string> = {
  'zh-tw': '中文',
  en: 'EN',
};

/** <html lang="…"> 用的標準標籤 */
export const htmlLang: Record<Locale, string> = {
  'zh-tw': 'zh-Hant-TW',
  en: 'en',
};

export const ui = {
  'zh-tw': {
    'nav.home': '首頁',
    'nav.about': '關於',
    'nav.projects': '專案',
    'nav.competitions': '競賽',
    'nav.blog': '筆記',
    'nav.skip': '跳到主要內容',

    'home.now': '近期在做',
    'home.portrait': '照片',
    'home.tabTitle': '個人網頁',
    'home.projects': '精選專案',
    'home.competitions': '競賽紀錄',
    'home.blog': '最新筆記',
    'home.repos': 'GitHub 倉庫',
    'home.contact': '聯絡',

    'action.all': '看全部',
    'action.readMore': '繼續讀',
    'action.back': '返回',
    'action.repo': '原始碼',
    'action.demo': 'Demo',
    'action.link': '賽事連結',
    'action.copy': '複製',
    'action.copied': '已複製',

    'label.role': '擔任',
    'label.team': '團隊',
    'label.stack': '技術',
    'label.period': '期間',
    'label.result': '成績',
    'label.host': '主辦',
    'label.updated': '更新於',
    'label.readingTime': '分鐘',
    'label.tags': '標籤',

    'blog.title': '筆記',
    'blog.description': '寫給未來的自己：技術筆記、專案覆盤、以及一些雜想。',
    'blog.empty': '還沒有文章。第一篇正在路上。',
    'blog.toc': '本頁目錄',

    'projects.title': '專案',
    'projects.description': '做過的東西，以及當初為什麼要做。',
    'projects.empty': '專案整理中。',

    'competitions.title': '競賽紀錄',
    'competitions.description': '黑客松與各式比賽的完整流水帳，含沒得名的。',
    'competitions.empty': '紀錄整理中。',

    'repos.error': 'GitHub 資料暫時取不到，以下為手動紀錄的清單。',
    'repos.viewAll': '看全部倉庫',

    'footer.built': '本站以 Astro 手工打造，原始碼公開',
    'footer.rights': '內容採',
    'footer.rss': '訂閱 RSS',
    'footer.admin': '後台',
    'footer.adminTitle': '內容後台（需要 GitHub 帳號登入）',

    '404.title': '這裡沒有東西',
    '404.body': '這個位址找不到對應的頁面。可能是連結過期，或是我改了網址。',
    '404.home': '回首頁',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.competitions': 'Contests',
    'nav.blog': 'Notes',
    'nav.skip': 'Skip to main content',

    'home.now': 'Currently',
    'home.portrait': 'Portrait',
    'home.tabTitle': 'Personal site',
    'home.projects': 'Selected work',
    'home.competitions': 'Contest log',
    'home.blog': 'Latest notes',
    'home.repos': 'GitHub repos',
    'home.contact': 'Contact',

    'action.all': 'See all',
    'action.readMore': 'Read on',
    'action.back': 'Back',
    'action.repo': 'Source',
    'action.demo': 'Demo',
    'action.link': 'Event page',
    'action.copy': 'Copy',
    'action.copied': 'Copied',

    'label.role': 'Role',
    'label.team': 'Team',
    'label.stack': 'Stack',
    'label.period': 'Period',
    'label.result': 'Result',
    'label.host': 'Host',
    'label.updated': 'Updated',
    'label.readingTime': 'min read',
    'label.tags': 'Tags',

    'blog.title': 'Notes',
    'blog.description': 'Notes to my future self: engineering write-ups, project post-mortems, and stray thoughts.',
    'blog.empty': 'No posts yet. The first one is on its way.',
    'blog.toc': 'On this page',

    'projects.title': 'Projects',
    'projects.description': 'Things I built, and why I started building them.',
    'projects.empty': 'Projects are being written up.',

    'competitions.title': 'Contest log',
    'competitions.description': 'Every hackathon and competition I entered — including the ones I did not place in.',
    'competitions.empty': 'The log is being written up.',

    'repos.error': 'GitHub is unreachable right now; showing the manually curated list.',
    'repos.viewAll': 'All repositories',

    'footer.built': 'Hand-built with Astro. Source is public',
    'footer.rights': 'Content licensed under',
    'footer.rss': 'Subscribe via RSS',
    'footer.admin': 'Admin',
    'footer.adminTitle': 'Content admin (sign in with GitHub)',

    '404.title': 'Nothing here',
    '404.body': 'No page lives at this address. The link may have expired, or I moved things around.',
    '404.home': 'Back home',
  },
} as const;

export type UIKey = keyof (typeof ui)['zh-tw'];

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return (ui[locale] as Record<string, string>)[key] ?? (ui[DEFAULT_LOCALE] as Record<string, string>)[key] ?? key;
  };
}

/** 產生指定語系的網址：zh-tw 不加前綴，en 加 /en */
export function localePath(locale: Locale, path = '/'): string {
  const clean = '/' + path.replace(/^\/+|\/+$/g, '');
  const base = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const out = `${base}${clean}`;
  return out === '' ? '/' : out.replace(/\/{2,}/g, '/');
}

/** 從 content collection 的 id（例：`zh-tw/my-post`）拆出語系與 slug */
export function splitId(id: string): { locale: Locale; slug: string } {
  const [maybeLocale, ...rest] = id.split('/');
  if ((LOCALES as readonly string[]).includes(maybeLocale) && rest.length) {
    return { locale: maybeLocale as Locale, slug: rest.join('/') };
  }
  return { locale: DEFAULT_LOCALE, slug: id };
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'zh-tw' ? 'zh-TW' : 'en-GB', {
    year: 'numeric',
    month: locale === 'zh-tw' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'Asia/Taipei',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
