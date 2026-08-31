# kimmy-site

Kimmy 的個人網站。Astro 靜態網站 + Sveltia CMS 後台，中英雙語。

- **前台**：`/` 中文、`/en` 英文
- **後台**：`/admin`（用 GitHub 帳號登入，寫完直接 commit 回這個 repo）
- **設計主題**：Datasheet（規格書）。把「個人簡介」做成一份 IC 規格表。

> 剛接手這個專案？先看 **[HANDOFF.md](./HANDOFF.md)**（現況、待辦、決策理由）。
> 用 Claude Code 開發時它會自動讀 **[CLAUDE.md](./CLAUDE.md)**（架構、設計規矩、三個必知陷阱）。

---

## 目錄

1. [為什麼是這個架構](#為什麼是這個架構)
2. [第一次上線：五個步驟](#第一次上線五個步驟)
3. [開通後台（/admin）](#開通後台admin)
4. [先在自己電腦上試後台](#先在自己電腦上試後台不用部署不用-oauth)
5. [誰能改什麼](#誰能改什麼)
6. [日常使用](#日常使用)
7. [不用後台，直接改檔案](#不用後台直接改檔案)
8. [設計客製](#設計客製)
9. [藏在網站裡的東西](#藏在網站裡的東西)
10. [先去改這幾個地方](#先去改這幾個地方)

---

## 為什麼是這個架構

你之前的網站放在 Streamlit 或 Cloud Run，那是**應用程式**的部署方式：要有一個程序活著、要有容器、要有額度。個人網站的需求剛好相反——它要能放著三個月不管也不會壞。

所以這裡選的是 **Astro 靜態輸出 + Cloudflare Pages**：

| | Streamlit Cloud | Cloud Run | **Astro + Cloudflare Pages** |
| --- | --- | --- | --- |
| 費用 | 免費但會休眠 | 有請求就計費 | 免費，個人網站永遠用不完 |
| 冷啟動 | 有，數十秒 | 有 | 沒有，就是 CDN 上的檔案 |
| 自訂網域 | 受限 | 要設 load balancer | 內建，含免費 SSL |
| SEO / 分享預覽 | 差（前端渲染） | 看你怎麼寫 | 好，每頁都是實體 HTML |
| 放著半年不管 | 大概會壞 | 帳單或版本會出事 | 不會 |
| 適合做什麼 | 資料互動 App | 有後端的服務 | **內容型網站** |

Streamlit 和 Cloud Run 都是好工具，只是它們解的是另一個問題。你之後黑客松要做互動 demo，那還是該用它們——甚至可以把 demo 掛在 Cloud Run，然後從這個網站連過去。

**Cloudflare Pages 對台灣的連線品質特別好**（台北有節點），這是選它而不選 Vercel / Netlify 的主要原因。GitHub Pages 也可以，但它不支援 `_headers` 這類設定，後台的 OAuth 也比較麻煩。

技術選擇的另外兩個理由：

- **內容是 Markdown，存在你自己的 GitHub repo 裡。** 平台哪天不能用了，你只要換個地方重新建置，內容一個字都不會少。
- **後台只是個編輯器。** Sveltia CMS 是純前端的，登入後直接透過 GitHub API 提交檔案——沒有另一個資料庫要維護，也沒有另一個服務會掛掉。

---

## 第一次上線：五個步驟

### 1. 建立 GitHub repo

把這個資料夾推上去：

```bash
cd kimmy-site
git init
git add .
git commit -m "init: personal site"
git branch -M main
git remote add origin https://github.com/<你的帳號>/kimmy-site.git
git push -u origin main
```

> repo 設 public 或 private 都可以。**private 也能正常部署**，只是別人看不到原始碼。

### 2. 本機先跑起來看看

```bash
npm install
npm run dev      # → http://localhost:4321
```

`npm run build` 會產生 `dist/`，那就是最後要上線的靜態檔案。

### 3. 接上 Cloudflare Pages

1. 到 [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 選你剛剛的 repo
3. 建置設定：

   | 欄位 | 值 |
   | --- | --- |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version（環境變數） | `NODE_VERSION` = `22` |

4. Deploy。第一次大約一分鐘，之後每次 `git push` 都會自動重新建置。

你會拿到 `https://kimmy-site.pages.dev`。

### 4. 綁自己的網域（可跳過，但建議做）

在 Pages 專案的 **Custom domains** 加上你的網域。網域可以在 Cloudflare 直接買（`.dev`、`.me` 之類的一年幾百塊），SSL 憑證自動處理。

綁好之後，把網址寫回設定檔：

- `astro.config.mjs` → `site: 'https://你的網域'`
- `public/robots.txt` → 最後一行的 sitemap 網址
- `src/data/site.json` → `domain`

### 5. 讓 GitHub 倉庫區塊顯示你的 repo

`src/data/site.json` 裡把 `github` 改成你的 GitHub 帳號。網站會在**建置時**呼叫 GitHub API 抓公開倉庫。

- `repos.pinned` 留空 → 自動顯示最近更新的公開倉庫
- `repos.pinned` 填 `["repo-a", "repo-b"]` → 只顯示這幾個，順序照填的
- API 抓不到的時候（沒設帳號、限流、網路不通）→ 自動改用 `repos.fallback` 的手動清單，**建置不會因此失敗**

如果 API 常常限流，在 Cloudflare Pages 的環境變數加一個 `GITHUB_TOKEN`（GitHub 個人 token，只要唯讀 public repo 權限），額度會從 60 次/小時變成 5000 次/小時。

---

## 開通後台（/admin）

後台是純前端的，登入靠 GitHub。有兩種方式，**目前設定用的是第一種**。

### 方式一：用 Personal Access Token（目前採用，不需要任何伺服器）

`public/admin/config.yml` 設了 `auth_methods: [token]`，所以登入畫面只會出現
**Sign In with Token** 一顆按鈕。

**建一把 token：**

1. 到 <https://github.com/settings/tokens/new>（Tokens (classic)）
2. Note 隨便填，例如 `kimmy-site admin`
3. Expiration 自己決定（選 No expiration 就不用定期換，但風險自負）
4. Select scopes 只勾 **`public_repo`** ← 這個 repo 是 public，勾這個就夠；
   不要勾整個 `repo`，那會連你所有私有倉庫的讀寫權限都給出去
5. Generate token，**複製起來**（只會顯示這一次）

**用它登入：** 開 `https://你的網址/admin/`，貼上 token，按 Sign In。

token 存在瀏覽器的 local storage，只在你這台裝置上。換電腦、清瀏覽器資料、
或 token 過期，就重新貼一次。

> 別把 token 貼進任何檔案再 commit——它只該存在瀏覽器裡。

### 方式二：正式的 OAuth 流程（要部署一個 Worker）

想要「Sign in with GitHub」那種一鍵登入，就得自己跑一個 OAuth 中介服務。
官方有現成的，部署到 Cloudflare Workers，免費。

1. 到 [github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)，
   按 README 裡的 **Deploy to Cloudflare Workers**。記下拿到的網址。
2. 到 <https://github.com/settings/applications/new> 註冊 OAuth App：

   | 欄位 | 填什麼 |
   | --- | --- |
   | Application name | 隨便，例如 `kimmy-site admin` |
   | Homepage URL | 你的網站網址 |
   | Authorization callback URL | `<Worker 網址>/callback` ← **結尾要有 `/callback`** |

3. Cloudflare Dashboard → 你的 Worker → **Settings → Variables and Secrets**：

   | 名稱 | 值 |
   | --- | --- |
   | `GITHUB_CLIENT_ID` | OAuth App 的 Client ID |
   | `GITHUB_CLIENT_SECRET` | Client Secret（按 **Encrypt**） |
   | `ALLOWED_DOMAINS` | 你的網站網域，防止別人拿你的 Worker 去用 |

4. 改 `public/admin/config.yml` 的 `backend` 區塊：

   ```yaml
   backend:
     name: github
     repo: KimmyTsai/kimmy-site
     branch: main
     auth_methods: [oauth, token]                              # 兩種都留
     base_url: https://sveltia-cms-auth.<你的帳號>.workers.dev   # 加這行
   ```

push 上去，等 Cloudflare 重建完就生效了。

## 先在自己電腦上試後台（不用部署、不用 OAuth）

Sveltia CMS 支援直接操作**本機資料夾**，所以你現在就能玩：

```bash
npm install
npm run dev
```

然後用 **Chrome 或 Edge** 打開：

```
http://localhost:4321/admin/index.html
```

選 **Work with Local Repository**，在檔案選擇視窗指定 `kimmy-site` 這個資料夾，就進後台了。你在裡面的每一次儲存都會直接寫進本機的 `.md` / `.json` 檔案，`npm run dev` 會即時反映在網站上。滿意之後再自己 `git commit`。

> 這個模式用的是瀏覽器的 File System Access API，**只支援 Chromium 系瀏覽器**（Chrome、Edge、Brave）。Firefox 和 Safari 目前不行。
>
> Brave 需要先到 `brave://flags/#file-system-access-api` 手動開啟。

先用這個模式確認欄位都符合你要的，再去做上面的 OAuth 設定，會省很多來回。

---

## 誰能改什麼

這個網站只有兩種身分，沒有註冊、沒有使用者資料庫：

| | 一般訪客 | 你（管理員） |
| --- | --- | --- |
| 看網站 | ✅ | ✅ |
| 進 `/admin` 頁面 | 打得開，但只會看到登入畫面 | ✅ |
| 改內容 | ❌ | ✅ |

**權限是靠 GitHub 決定的。** 後台沒有自己的帳號密碼——它要求你用 GitHub 登入，然後嘗試把改動 commit 進這個 repo。**只有對 repo 有寫入權限的 GitHub 帳號才做得到**，也就是只有你。別人就算開到 `/admin`，登入自己的 GitHub 也存不了任何東西。

前台是純靜態 HTML，沒有任何可以被改的東西——訪客那一側連「可以編輯」的入口都不存在。

已經做好的防護：`robots.txt` 擋掉 `/admin` 的索引，`public/_headers` 加上 `X-Robots-Tag: noindex`，所以搜尋引擎不會收錄它。

如果你連「別人打得開登入畫面」都不想要，可以在 Cloudflare 的 **Zero Trust → Access** 幫 `/admin*` 加一道 email 驗證（免費方案 50 人以內夠用），這樣沒通過驗證的人連頁面都載不到。不做也不影響安全性，只是心理上乾淨一點。

---

## 日常使用

### 發一篇新文章

1. 開 `/admin` → **筆記** → **New 一篇筆記**
2. 填「網址代稱 slug」——**只用英文小寫、數字、連字號**，這會變成網址：`/blog/你填的slug`
3. 寫標題、摘要、內文，按 **Publish**
4. 後台會 commit 一個 `.md` 到 repo，Cloudflare 偵測到後自動重建，約一分鐘後上線

### 筆記可以用的 markdown 語法

後台的內文編輯器**預設就是 markdown 原始碼模式**，跟 HackMD 一樣直接打語法。
右上角可以切換到所見即所得模式，但如果內文有下面的提示框，切過去可能會被改寫，建議就待在原始碼模式。

除了標準 markdown（標題、清單、表格、程式碼區塊、連結、圖片），另外支援：

**提示框**，語法跟 HackMD 一樣：

```markdown
:::info
一般說明。
:::

:::warning[上板前先確認時序]
可以像這樣自訂標題。
:::
```

可用的類型：`info`、`tip`、`note`、`success`、`warning`、`danger`。
前四種是中性的灰色，`warning` 和 `danger` 會用主色標示。

**待辦清單**：

```markdown
- [ ] 還沒做
- [x] 做完了
```

**其他**：表格、註腳（`[^1]`）、`<kbd>Ctrl</kbd>` 按鍵樣式都有做。
程式碼區塊會自動標上語言並附複製鈕，標題會有可點的錨點連結（滑過去才出現）。

### 中英雙語怎麼運作

後台每個欄位上方有 **zh-tw / en** 的切換。兩個語言存成兩個檔案：

```
src/content/blog/zh-tw/my-post.md
src/content/blog/en/my-post.md
```

**只要 slug 相同，網站就知道它們是同一篇**，語言切換鈕會直接對接。

只想寫中文？那就只填中文欄位。英文版不存在時，那一頁的語言切換鈕會自動變灰——不會出現 404。

### 加一筆競賽紀錄

**競賽紀錄** → New。有名次的話把「重點標記」打勾，那一筆會用主色標示。

沒得名的也建議記上去。網站的競賽頁刻意設計成流水帳的樣子（含「參賽」「入圍」這種狀態），因為那才是真實的軌跡——只列得獎紀錄的頁面對推甄審查其實沒有比較有說服力。

### 改個人簡介、經歷、規格表

**個人資料與設定** 裡面：

| 項目 | 改什麼 |
| --- | --- |
| 個人簡介（中文／English） | 名字、標語、自我介紹、首頁的規格表、「近期在做」 |
| 經歷時間軸（中文／English） | 關於頁的時間軸 |
| 全站設定 | GitHub 帳號、Email、社群連結、倉庫顯示方式 |

中英文是分開的兩份，改完記得兩邊都改。

### 草稿

每個項目都有「草稿」勾選框。勾起來就不會出現在正式網站，但 `npm run dev` 時看得到。

---

## 不用後台，直接改檔案

後台只是包裝，底下就是檔案。你也可以直接編輯後 `git push`：

```
src/
├── content/
│   ├── blog/{zh-tw,en}/*.md          文章
│   ├── projects/{zh-tw,en}/*.md      專案
│   ├── competitions/{zh-tw,en}/*.md  競賽紀錄
│   └── pages/{zh-tw,en}/about.md     關於頁內文
├── data/
│   ├── site.json                     全站設定（GitHub 帳號、Email…）
│   ├── profile.{zh-tw,en}.json       首頁簡介與規格表
│   └── experience.{zh-tw,en}.json    經歷時間軸
├── styles/global.css                 全部的樣式（沒有 Tailwind）
├── i18n/ui.ts                        介面文字（按鈕、標題…）
├── views/                            各頁面的實作
├── components/                       元件
└── pages/                            路由（很薄，只是指到 views/）
```

`src/content.config.ts` 定義每種內容有哪些欄位。**如果你在後台加了新欄位，這裡也要加上對應的 schema，否則建置會失敗**——這是刻意的，避免資料悄悄對不上。

---

## 設計客製

### 換顏色

`src/styles/global.css` 最上面的 `:root` 區塊。整個網站只用**一個主色**（`--accent`，目前是銅箔色 `#a2440f`），改它就會整站跟著變。深色模式的對應值在 `:root[data-theme='dark']`。

### 換字體

同一個檔案最上面的 `@import`。目前是：

- **Newsreader** — 標題（有報刊感的襯線體）
- **IBM Plex Sans / Mono** — 內文與規格欄位（工程感）
- **Noto Sans TC / Serif TC** — 中文

Google Fonts 會自動只載入用到的中文字元子集，不用擔心中文字體很肥。

### 調間距與字級

`--step--1` 到 `--step-4` 是整套字級，用 `clamp()` 寫的，會隨螢幕寬度自動縮放。`--measure` 是內文行寬（預設 40rem，大約一行 40 個中文字）。

---

## 藏在網站裡的東西

這幾個不是 bug：

| 東西 | 怎麼觸發 |
| --- | --- |
| **探針模式** | 點左上角的晶片圖示。整個版面會標上像規格書的元件註記。 |
| **CRT 磷光模式** | 鍵盤輸入 `↑ ↑ ↓ ↓ ← → ← → B A`。會記住，再輸入一次關掉。 |
| **Console 問候** | 開瀏覽器開發者工具的 Console。 |
| **頁尾提示** | 頁尾那行 `// build ...` 後面就寫著 Konami code。 |

不喜歡的話：探針模式在 `global.css` 的第 17 節、CRT 在第 18 節，連同 `Base.astro` 裡的對應 script 一起刪掉即可。

---

## 先去改這幾個地方

網站現在用的是我從你過去的專案與經歷整理出來的內容。**下面這些請你自己確認過再上線**：

- [ ] `src/data/site.json` → `github` 換成你的 GitHub 帳號（現在是 `YOUR_GITHUB_USERNAME`）
- [ ] `src/data/site.json` → `socials` 裡的 LinkedIn 網址（現在是空的）
- [ ] `public/admin/config.yml` → `repo` 與 `base_url`
- [ ] `astro.config.mjs` → `site` 換成你的正式網址
- [ ] **`src/content/competitions/` 裡的日期與成績** — 我只知道你參加了梅竹黑客松、Sea × OpenAI Codex Hackathon 和 2026 DevJam，**實際的比賽日期和名次是我推估的，一定要改**
- [ ] `src/data/profile.*.json` → `altName` 可以填你的中文名字（現在留空，填了會顯示在英文名下方）
- [ ] `src/data/profile.*.json` → 學校起始年份（我寫 2022，在 `experience.*.json` 裡）
- [ ] 專案頁的 repo / demo 連結（目前沒填，填了才會出現按鈕）

---

## 常用指令

```bash
npm run dev       # 本機開發，含即時重載
npm run build     # 建置到 dist/
npm run preview   # 預覽建置結果
npm run check     # 型別檢查（提交前跑一下）
```

---

## 授權

程式碼可自由使用。`src/content/` 與 `src/data/` 下的文章與個人資料屬於 Kimmy。
