/**
 * HackMD 風格的提示框（container directive）。
 *
 *   :::info
 *   這是一段說明。
 *   :::
 *
 * 也可以自訂標題：
 *
 *   :::warning[上板前先確認時序]
 *   ...
 *   :::
 *
 * 需要搭配 remark-directive（在 astro.config.mjs 裡先掛它）。
 * 產出的 HTML 是 <aside class="callout callout-info">，樣式在 global.css §14。
 *
 * 標題語言依檔案路徑判斷（src/content/blog/zh-tw/... vs .../en/...），
 * 因為中英文是兩份獨立的檔案，同一個 plugin 兩邊都會跑到。
 */

/** 支援的類型與各語系的預設標題 */
const TITLES = {
  info: ['說明', 'Info'],
  tip: ['提示', 'Tip'],
  note: ['備註', 'Note'],
  success: ['可行', 'Success'],
  warning: ['注意', 'Warning'],
  danger: ['警告', 'Caution'],
};

/** 把節點底下的純文字串起來，用來取 :::info[自訂標題] 的標題 */
function textOf(node) {
  if (node.value) return node.value;
  if (!node.children) return '';
  return node.children.map(textOf).join('');
}

export default function remarkCallout() {
  return (tree, file) => {
    // Windows 上分隔符號是反斜線，兩種都要認
    const path = String(file.path ?? file.history?.[0] ?? '');
    const isZh = !/[/\\]en[/\\]/.test(path);

    const walk = (node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type === 'containerDirective' && TITLES[child.name]) {
          build(child, isZh);
        }
        walk(child);
      }
    };

    walk(tree);
  };
}

function build(node, isZh) {
  let title = TITLES[node.name][isZh ? 0 : 1];

  // :::info[自訂標題] —— remark-directive 會把標題放成第一個帶 directiveLabel 的段落
  const first = node.children[0];
  if (first?.type === 'paragraph' && first.data?.directiveLabel) {
    const label = textOf(first).trim();
    if (label) title = label;
    node.children.shift();
  }

  node.data = {
    hName: 'aside',
    hProperties: { className: ['callout', `callout-${node.name}`] },
  };

  node.children.unshift({
    type: 'paragraph',
    data: { hName: 'p', hProperties: { className: ['callout-title'] } },
    children: [{ type: 'text', value: title }],
  });
}
