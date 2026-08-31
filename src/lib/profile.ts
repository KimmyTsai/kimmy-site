import zh from '../data/profile.zh-tw.json';
import en from '../data/profile.en.json';
import type { Locale } from '../i18n/ui';

/** 依語系取個人資料 */
export function profileFor(locale: Locale) {
  return locale === 'zh-tw' ? zh : en;
}

/**
 * 全站統一的分頁標題格式：「頁面名稱 | 我的名字」。
 *
 * 名字一律從 profile.*.json 讀，不要在各頁寫死——之前就是寫死成 "Kimmy"，
 * 使用者在後台把名字改成 "Kimmy Tsai" 之後，這幾頁的分頁名稱與 og:title
 * 都沒跟著變，而且不會有任何錯誤提示。
 *
 * 首頁是唯一的例外，格式是「我的名字 | 個人網頁」（名字在前）。
 */
export function pageTitle(locale: Locale, page: string): string {
  return `${page} | ${profileFor(locale).name}`;
}
