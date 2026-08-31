# CLAUDE.md

給 Claude Code 的專案說明。動手改任何東西之前先讀完這份。

## 這是什麼

Kimmy（成大資工）的個人網站。Astro 靜態網站，中英雙語，`/admin` 有 Sveltia CMS 後台。
部署目標是 Cloudflare Pages。使用者的操作語言是**繁體中文**，回覆與 commit message 請用繁中，技術名詞保留英文。

## 指令

```bash
npm run dev      # http://localhost:4321
npm run build    # → dist/，目前應產生 29 頁
npm run check    # astro check；目前是 0 errors / 0 warnings / 0 hints，請維持
npm run preview  # 預覽 dist/
```

**改完一定要跑 `npm run check` 和 `npm run build`。** 兩者都必須乾淨才算完成。

後台本機測試：`npm run dev` 後用 **Chrome / Edge** 開 `http://localhost:4321/admin/index.html`，
選「Work with Local Repository」指定專案根目錄。這用的是 File System Access API，
**不需要 OAuth、不需要 proxy server**；Sveltia 不支援 `decap-server` 那類 proxy，`local_backend` 設定會被忽略。

## 架構

```
src/
├── pages/          路由檔，全部很薄（只有 import + 傳 locale）。不要在這裡寫邏輯。
│   ├── *.astro         zh-tw（根路徑，無語系前綴）
│   └── en/*.astro      en
├── views/          頁面實際實作。每個都收 locale prop，中英共用同一份。
├── components/     元件
├── layouts/Base.astro   <html> 骨架、header/footer、前端互動 script
├── content/        Markdown 內容（見下方「內容慣例」）
├── data/           JSON 設定與個人資料
├── i18n/ui.ts      介面字串、localePath()、splitId()、日期格式
├── lib/content.ts  依語系取內容、閱讀時間、localesFor()
├── lib/github.ts   build 時抓 GitHub repo（含失敗回退）
└── styles/global.css   全站樣式（手寫，沒有 Tailwind / UI kit）
```

**新增頁面的流程**：在 `views/` 寫實作（收 `locale` prop）→ 在 `pages/` 和 `pages/en/` 各放一個薄路由檔。
兩邊都要加，否則某個語系會缺頁。

## 內容慣例

```
src/content/<collection>/<locale>/<slug>.md
例：src/content/blog/zh-tw/my-post.md
    src/content/blog/en/my-post.md
```

**中英文靠檔名（slug）配對。** 同一篇的兩個語系檔名必須完全相同，語言切換鈕才會對接。
只有單一語系也可以——`localesFor()` 會偵測到，缺的那邊語言鈕自動變灰，不會 404。

collections：`blog`、`projects`、`competitions`、`pages`（只有 about）。

## 三個一定要知道的陷阱

### 1. glob loader 會被 frontmatter 的 `slug` 綁架 ← 最重要

`src/content.config.ts` 裡每個 collection 都傳了 `generateId: idFromPath`。**不要拿掉。**

Astro 的 glob loader 預設會拿 frontmatter 的 `slug` 欄位當 entry id。後台會把 `slug` 寫進 frontmatter，
而中英文兩份共用同一個 slug，於是兩筆內容撞成同一個 id、其中一份被靜默丟掉（每個 collection 的中英各一份會塌成一份，總頁數明顯掉下來）。
`generateId: idFromPath` 強制用檔案路徑產生 id，語系資料夾才不會被吃掉。

改動 `content.config.ts` 後請確認 `npm run build` 仍是 29 頁。

### 2. CMS 設定與 schema 必須同步

`public/admin/config.yml` 的欄位和 `src/content.config.ts` 的 zod schema 是兩份獨立的定義。
**在後台加欄位就要同步加 schema**，否則 build 會失敗（這是刻意的，避免資料悄悄對不上）。
反過來加了 required 的 schema 欄位卻沒加進 CMS，使用者在後台就存不了新項目。

### 3. i18n 路由不對稱

`prefixDefaultLocale: false`：中文在根路徑（`/about`），英文有前綴（`/en/about`）。
產生連結一律用 `localePath(locale, path)`，不要手寫字串拼接。

## Markdown 處理

`astro.config.mjs` 的 markdown 區塊掛了三個東西，順序有意義：

1. `remarkDirective` — 解析 `:::` 語法
2. `remarkCallout`（`src/lib/remark-callout.mjs`）— 把 directive 轉成 `<aside class="callout callout-*">`
3. `rehypeHeadingIds` + `rehypeAutolinkHeadings` — 標題錨點

**`rehypeHeadingIds` 必須手動放在 `rehypeAutolinkHeadings` 前面。** Astro 內建的
heading id 產生器預設排在使用者 rehype plugin 之後，那時 autolink 看不到 id 會整個跳過，
標題就不會有錨點——而且不會報錯，只是靜靜地沒作用。

提示框的標題語言是用**檔案路徑**判斷的（`/en/` 就是英文），因為中英文是兩份獨立檔案。

提示框刻意只用「中性灰 + 主色」兩級，沒有引入藍／黃／紅。設計系統只允許一個彩色，
見下方規矩。要加新類型就在 `TITLES` 補一筆，CSS 預設樣式會自動套用。

程式碼區塊的語言標籤與複製鈕是在前端補的（`Base.astro` 的 `setupCodeBlocks`），
不是 build 時產生。它會把 `<pre>` 包一層 `.code-block`，並用 `data-language` 取語言。
掛在 `astro:page-load` 上，換頁後會重跑；已包過的會跳過。

## 設計系統規矩

主題叫 **Datasheet（規格書）**，隱喻來自使用者的硬體背景（RISC-V / FPGA / 後量子密碼）。
使用者明確要求「不要看起來像 AI 生成的模板」，以下請遵守：

- **不要引入 Tailwind 或任何 UI kit。** 樣式全部手寫在 `src/styles/global.css`，分 19 個編號區塊。
- **所有顏色、字級、間距都走 CSS 變數**（`:root` 區塊）。不要在元件裡寫死色碼。
- 只有**一個主色** `--accent`（銅箔色）。要強調就用它，不要再引入第二個彩色。
- `--radius: 3px`，幾乎方角。**不要改成大圓角**——那是最典型的模板長相。
- 不用 emoji 當章節標記。章節用 `§01` 這種編號（`SectionHead.astro`）。
- 字體是 Newsreader（標題）+ IBM Plex Sans/Mono（內文與規格欄位）+ Noto Sans/Serif TC（中文）。
- 深色模式在 `:root[data-theme='dark']` 重新定義同一組變數。**新增顏色時兩邊都要加。**
- 中文排版有專門處理（`:lang(zh-Hant-TW)` 選擇器關掉了斜體與負字距），改字體相關的東西時留意。

彩蛋（使用者知道且喜歡，別當成 bug 刪掉）：
- 點 header 晶片圖示 → 探針模式（`global.css` §17）
- Konami code → CRT 磷光模式（§18）
- Console ASCII art（`Base.astro`）

## 目前狀態

- `npm run check`：0 errors / 0 warnings / 0 hints
- `npm run build`：29 頁
- **尚未部署**，也還沒 `git init`
- 內容是依使用者真實經歷撰寫的中英文各一份（不是 placeholder），但見 `HANDOFF.md` 的待確認清單

## 只有使用者能決定的事

**不要自己猜、不要自己填**，需要時直接問她：

- 正式網域（目前是 `kimmy.dev` 佔位）
- `src/content/competitions/` 裡的**比賽日期與名次**——目前的值是推估的，必須由她核對
- 她的中文姓名（`profile.*.json` 的 `altName` 目前留空）
- 各專案的 repo / demo 連結

## 已知缺口

- `blog` 和 `projects` 的 schema 有 `cover` 欄位，CMS 也能上傳，但**前台沒有任何頁面渲染它**。
  要嘛實作封面圖顯示，要嘛把欄位拿掉——現在是不一致的狀態。
- OG 圖是單張靜態 `public/og.png`，沒有做每頁動態產生。
- 沒有自動化測試。驗證方式是 `npm run check` + `npm run build`，視覺改動請自己開瀏覽器確認深淺兩色模式。
