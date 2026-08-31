# 交接說明

這份是給你（Kimmy）看的：目前做到哪、為什麼這樣做、接下來要做什麼。
給 Claude Code 讀的專案規矩在 `CLAUDE.md`，部署步驟在 `README.md`。

---

## 怎麼接手

解壓縮後在專案資料夾開終端機：

```bash
cd kimmy-site
npm install
npm run dev          # → http://localhost:4321，先看看網站
```

然後在同一個資料夾啟動 Claude Code。它會自動讀到 `CLAUDE.md`，
裡面已經寫好架構、設計規矩、以及三個會踩到的陷阱。

**第一次可以直接貼這段給它：**

> 這是我的個人網站專案，先讀 CLAUDE.md 和 HANDOFF.md。
> 讀完先跑 `npm run check` 和 `npm run build` 確認現況是乾淨的（應該是 0 errors、29 頁），
> 然後把 HANDOFF.md 裡「上線前必做」那一節的項目做完，需要我提供的資訊直接問我。

建議第一件事就是 `git init` 並提交一版，之後所有改動才有得比對：

```bash
git init && git add . && git commit -m "init: 個人網站初版（Astro + Sveltia CMS，中英雙語）"
```

---

## 目前狀態

| 項目 | 狀態 |
| --- | --- |
| `npm run check` | 0 errors / 0 warnings / 0 hints |
| `npm run build` | 29 頁 |
| 前台 | 中英文完成，導覽、語言切換、深淺色模式都測過 |
| 後台 `/admin` | 設定完成，**本機模式現在就能用**（見下方） |
| 部署 | **尚未進行** |
| Git | **尚未 init** |

### 已經完成的東西

- **架構**：Astro 靜態輸出，中文在根路徑、英文在 `/en`
- **頁面**：首頁、關於、專案列表＋內頁、競賽紀錄、筆記列表＋內頁、404、RSS（中英各一）、sitemap
- **內容**：依你的真實經歷寫的中英文各一份——SLH-DSA / SHACK-256 畢專、道路反射鏡專案、
  課程硬體作品集、三場黑客松、關於頁與經歷時間軸、三篇技術文章
- **設計**：Datasheet 主題，手寫 CSS 設計系統，深淺色雙主題，三個彩蛋
- **後台**：Sveltia CMS，中英雙語欄位，可編輯所有內容與個人資料
- **GitHub 串接**：build 時抓取你的公開倉庫，抓不到會自動回退到手動清單（build 不會失敗）
- **SEO**：hreflang、canonical、OG 圖、sitemap、robots.txt

---

## 上線前必做

按重要性排序。前三項沒做完網站不能上線。

### 1. 替換佔位字串

現在還有幾個地方是假的：

| 檔案 | 要改什麼 |
| --- | --- |
| `src/data/site.json` | `github` / `repoUrl` / `socials` 已填為 KimmyTsai；只剩 `domain` 要換成正式網址 |
| `astro.config.mjs` | `site` → 你的正式網址（現在是 `kimmy.dev`） |
| `public/robots.txt` | 最後一行的 sitemap 網址 |
| `public/admin/config.yml` | `repo` 和 `base_url`（`base_url` 要等 OAuth Worker 部署完才有值） |

### 2. 核對競賽紀錄 ← 這項只有你能做

`src/content/competitions/` 裡有三筆：梅竹黑客松、Sea × OpenAI Codex Hackathon、2026 DevJam。

**日期和成績是我推估的。** 我只知道你參加了這三場，實際的比賽日期、你的名次或狀態都要你自己填。
有名次的把 `highlight` 設成 `true`，那筆會用主色標示。

中英文各一份，記得兩邊都改。

### 3. 部署

`README.md` 第 2 節有完整步驟。摘要：GitHub repo → Cloudflare Pages → 綁網域。
建置設定是 `npm run build` / 輸出 `dist` / `NODE_VERSION=22`。

### 4. 開通線上後台

`README.md` 第 3 節。要部署一個 OAuth Worker（免費）＋註冊 GitHub OAuth App。

**但你現在就能先試後台**，不用等部署也不用 OAuth：

```bash
npm run dev
```

用 **Chrome 或 Edge** 開 `http://localhost:4321/admin/index.html`，
選 **Work with Local Repository**，指定 `kimmy-site` 資料夾。
編輯會直接寫進本機檔案。先用這個模式確認欄位符合你要的，再去弄 OAuth，省很多來回。

### 5. 補齊個人資訊

- `src/data/profile.*.json` 的 `altName`（你的中文名字，填了會顯示在 Kimmy 下方，留空就不顯示）
- `src/data/experience.*.json` 裡入學年份我寫 2022，請確認
- 各專案的 `repo` / `demo` 連結（填了才會出現按鈕）

---

## 之後可以做的

不急，但值得排進去：

- **文章封面圖**：schema 和後台都有 `cover` 欄位，但前台目前沒有渲染。
  要嘛實作，要嘛把欄位拿掉——現在是不一致的。
- **每頁動態 OG 圖**：現在全站共用一張 `public/og.png`。可以用 `astro-og-canvas` 之類的
  在 build 時幫每篇文章產生專屬分享圖。
- **標籤頁**：文章有 tags 但沒有 `/blog/tag/xxx` 的彙整頁。
- **搜尋**：文章多了以後可以加 Pagefind（靜態網站的搜尋方案，build 時建索引）。
- **推甄用的一頁式履歷**：把經歷、專案、競賽整合成一頁可列印的 `/cv`。
  `global.css` §19 已經寫好列印樣式了，這個做起來很快。

---

## 幾個決策的理由

接手的人（或未來的你）可能會想改掉這些，先說明為什麼是現在這樣：

**為什麼不是 Streamlit / Cloud Run。**
那是跑應用程式的方式：要有程序活著、有容器、有額度。個人網站的需求相反——要能放著三個月不管也不會壞。
你之前那些站在比賽後慢慢死掉，就是這個原因。靜態輸出沒有這個問題。
（黑客松要做互動 demo 還是該用 Cloud Run，然後從這個網站連過去。）

**為什麼是 Cloudflare Pages 而不是 Vercel / Netlify。**
台北有節點，台灣連線快很多。免費額度個人站永遠用不完。

**為什麼後台不用資料庫。**
Sveltia CMS 是純前端的，登入後直接透過 GitHub API 提交 Markdown。
沒有第二個服務要維護、不會掛、內容永遠在你自己的 repo 裡。
平台哪天收掉，你換個地方重新 build 就好。

**為什麼競賽頁刻意做成流水帳。**
包含「參賽」「報名送件」這種沒名次的狀態。只列得獎紀錄的頁面看起來漂亮，
但那不是你實際在做的事情的樣子，對推甄審查也沒有比較有說服力。

**為什麼手寫 CSS 不用 Tailwind。**
你明確說過不要看起來像 AI 生成的模板。Tailwind 的預設值（大圓角、Inter、陰影卡片）
正是那個長相的來源。手寫的設計 token 集中在一個檔案，要改風格反而更快。
