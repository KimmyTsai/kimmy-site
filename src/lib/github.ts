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
 * 在 build 時抓一次 GitHub 公開倉庫。
 * - site.json 的 repos.pinned 有填 → 只顯示那幾個，順序照填的順序
 * - 沒填 → 取最近更新的公開倉庫（排除 fork 與個人 profile repo）
 * - 抓不到（沒設帳號 / API 限流 / 網路不通）→ 回退到 repos.fallback，網站照樣 build 得起來
 *
 * 想提高 API 額度：在部署平台設環境變數 GITHUB_TOKEN（只要 public_repo 的唯讀權限）。
 */
export async function getRepos(): Promise<{ repos: Repo[]; ok: boolean }> {
  const user = site.github;
  if (isPlaceholder(user)) return fallbackRepos();

  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kimmy-site-build',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const map = (r: any): Repo => ({
    name: r.name,
    description: r.description ?? '',
    language: r.language ?? null,
    stars: r.stargazers_count ?? 0,
    url: r.html_url,
    updatedAt: r.pushed_at ?? r.updated_at,
    topics: r.topics ?? [],
  });

  try {
    const pinned = site.repos.pinned ?? [];

    if (pinned.length) {
      const results = await Promise.all(
        pinned.map(async (full: string) => {
          const path = full.includes('/') ? full : `${user}/${full}`;
          const res = await fetch(`https://api.github.com/repos/${path}`, { headers });
          if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
          return map(await res.json());
        }),
      );
      return { repos: results, ok: true };
    }

    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&type=owner`,
      { headers },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = (await res.json()) as any[];
    const exclude = new Set([...(site.repos.exclude ?? []), user]);
    const repos = raw
      .filter((r) => !r.fork && !r.archived && !r.private && !exclude.has(r.name))
      .slice(0, site.repos.count ?? 6)
      .map(map);

    return { repos, ok: true };
  } catch (err) {
    console.warn(
      `[github] 取得倉庫失敗，改用 site.json 的 fallback 清單：${(err as Error).message}`,
    );
    return fallbackRepos();
  }
}
