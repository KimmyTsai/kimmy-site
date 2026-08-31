import site from '../data/site.json';

export interface Repo {
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  updatedAt?: string;
  topics?: string[];
}

/** GitHub 官方語言色，補一份常用的就好；沒對到就用中性灰 */
const LANG_COLORS: Record<string, string> = {
  Verilog: '#b2b7f8',
  SystemVerilog: '#DAE1C2',
  VHDL: '#adb2cb',
  C: '#555555',
  'C++': '#f34b7d',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Astro: '#ff5a03',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Assembly: '#6E4C13',
  Makefile: '#427819',
  Tcl: '#e4cc98',
  Jupyter: '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
};

export function langColor(lang: string | null | undefined): string {
  if (!lang) return 'var(--rule-strong)';
  return LANG_COLORS[lang] ?? 'var(--rule-strong)';
}

const isPlaceholder = (u: string) => !u || u.startsWith('YOUR_');

function fallbackRepos(): { repos: Repo[]; ok: boolean } {
  return {
    repos: (site.repos.fallback ?? []).map((r) => ({
      name: r.name,
      description: r.description ?? '',
      language: r.language ?? null,
      stars: r.stars ?? 0,
      url: r.url,
    })),
    ok: false,
  };
}

/**
 * 抓 GitHub 公開倉庫。
 *
 * 兩個重點，改動前先看懂：
 *
 * 1. **整個 process 只抓一次。** getRepos() 會被每一次 HomeView render 呼叫到
 *    （build 時中英各一次；dev server 則是每次頁面請求／熱重載都會）。
 *    沒有快取的話，開發時重整幾次就把匿名配額（60 次/小時）燒光，
 *    終端機會開始洗版「取得倉庫失敗 … HTTP 403」。
 *    這裡把 promise 存在模組層，重複呼叫共用同一次結果。
 *
 * 2. **只打一次 API。** 早期版本對 pinned 清單逐一呼叫 /repos/{owner}/{name}，
 *    6 個倉庫就是 6 次請求。改成抓一次使用者的倉庫列表再自己挑，
 *    正常情況固定 1 次請求。只有 pinned 指到別人的倉庫（或超過 100 個而不在列表裡）
 *    才會為那幾筆額外補打。
 *
 * 行為維持不變：
 * - pinned 有填 → 只顯示那幾個，順序照填的順序
 * - 沒填 → 取最近更新的公開倉庫（排除 fork 與個人 profile repo）
 * - 抓不到 → 回退到 repos.fallback，build 不會失敗
 *
 * 想提高額度：設環境變數 GITHUB_TOKEN（只要 public_repo 的唯讀權限），60 → 5000 次/小時。
 */
let cache: Promise<{ repos: Repo[]; ok: boolean }> | null = null;

export function getRepos(): Promise<{ repos: Repo[]; ok: boolean }> {
  cache ??= load();
  return cache;
}

const mapRepo = (r: any): Repo => ({
  name: r.name,
  description: r.description ?? '',
  language: r.language ?? null,
  stars: r.stargazers_count ?? 0,
  url: r.html_url,
  updatedAt: r.pushed_at ?? r.updated_at,
  topics: r.topics ?? [],
});

async function load(): Promise<{ repos: Repo[]; ok: boolean }> {
  const user = site.github;
  if (isPlaceholder(user)) return fallbackRepos();

  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kimmy-site-build',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`,
      { headers },
    );
    if (!res.ok) throw new Error(hint(res.status));

    const raw = (await res.json()) as any[];
    const pinned: string[] = site.repos.pinned ?? [];

    if (!pinned.length) {
      const exclude = new Set([...(site.repos.exclude ?? []), user]);
      const repos = raw
        .filter((r) => !r.fork && !r.archived && !r.private && !exclude.has(r.name))
        .slice(0, site.repos.count ?? 6)
        .map(mapRepo);
      return { repos, ok: true };
    }

    const byName = new Map(raw.map((r) => [String(r.name).toLowerCase(), r]));

    const picked = await Promise.all(
      pinned.map(async (entry) => {
        const name = entry.includes('/') ? entry.split('/')[1] : entry;
        const hit = byName.get(name.toLowerCase());
        if (hit) return mapRepo(hit);

        // 不在這份列表裡（別人的倉庫，或倉庫數超過 100）才額外補打一次
        const path = entry.includes('/') ? entry : `${user}/${entry}`;
        const one = await fetch(`https://api.github.com/repos/${path}`, { headers });
        if (!one.ok) {
          console.warn(`[github] pinned 的「${entry}」取不到（${hint(one.status)}），先略過`);
          return null;
        }
        return mapRepo(await one.json());
      }),
    );

    return { repos: picked.filter((r): r is Repo => r !== null), ok: true };
  } catch (err) {
    console.warn(`[github] 取得倉庫失敗，改用 site.json 的 fallback 清單：${(err as Error).message}`);
    return fallbackRepos();
  }
}

/** 把 HTTP 狀態翻成看得懂、知道怎麼處理的訊息 */
function hint(status: number): string {
  if (status === 403 || status === 429) {
    return `HTTP ${status}：GitHub API 配額用完了（未帶 token 時是每小時 60 次）。等配額重置，或設定 GITHUB_TOKEN 環境變數`;
  }
  if (status === 404) return `HTTP 404：找不到，確認 site.json 的 github 帳號與 pinned 倉庫名`;
  return `HTTP ${status}`;
}
