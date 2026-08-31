import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 目錄慣例：每個 collection 底下用語系資料夾分中英文
 *   src/content/blog/zh-tw/my-post.md
 *   src/content/blog/en/my-post.md
 * 兩個檔案只要 slug（檔名）相同，就會被視為同一篇文章的兩種語言，
 * 語言切換鈕會自動對接。
 */

/**
 * 用檔案路徑決定 entry id，例：`zh-tw/my-post`。
 *
 * 預設情況下 Astro 的 glob loader 會拿 frontmatter 的 `slug` 來當 id。
 * 後台（Sveltia CMS）會把 slug 寫進 frontmatter，中英文兩份又共用同一個 slug，
 * 於是兩筆內容會撞成同一個 id、其中一份被丟掉。
 * 這裡固定用路徑產生 id，語系資料夾才不會被吃掉。
 */
const idFromPath = ({ entry }: { entry: string }) => entry.replace(/\.(md|mdx)$/, '');

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    summary: z.string(),
    // 排序用，數字越小越前面
    order: z.number().default(99),
    period: z.string().optional(), // 例：2025.09 – 2026.06
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    repo: z.string().optional(),
    demo: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const competitions = defineCollection({
  loader: glob({ base: './src/content/competitions', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    // 主辦單位／賽事系列
    host: z.string().optional(),
    date: z.coerce.date(),
    // 名次或狀態，例：冠軍 / 入圍決賽 / 參賽
    result: z.string().optional(),
    // 高亮顯示（有得名的通常設 true）
    highlight: z.boolean().default(false),
    team: z.string().optional(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    link: z.string().optional(),
    repo: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}', generateId: idFromPath }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, projects, competitions, pages };
