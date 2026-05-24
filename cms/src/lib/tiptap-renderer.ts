import type { JSONContent } from "@tiptap/react";

/**
 * 把 TipTap 的 JSON 文档转换成 HTML 字符串
 * 用于服务端渲染（前端 SSR 时直接展示）
 */
export function tiptapJsonToHtml(doc: JSONContent | unknown): string {
  if (!doc || typeof doc !== "object") return "";
  return renderNode(doc as JSONContent);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarks(text: string, marks?: JSONContent["marks"]): string {
  let out = escapeHtml(text);
  if (!marks) return out;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        out = `<strong>${out}</strong>`;
        break;
      case "italic":
        out = `<em>${out}</em>`;
        break;
      case "code":
        out = `<code>${out}</code>`;
        break;
      case "strike":
        out = `<s>${out}</s>`;
        break;
      case "underline":
        out = `<u>${out}</u>`;
        break;
      case "link": {
        const href = (mark.attrs?.href as string) ?? "#";
        const target = (mark.attrs?.target as string) ?? "_blank";
        out = `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="noopener noreferrer">${out}</a>`;
        break;
      }
    }
  }
  return out;
}

function renderChildren(node: JSONContent): string {
  if (!node.content) return "";
  return node.content.map((c) => renderNode(c)).join("");
}

function renderNode(node: JSONContent): string {
  switch (node.type) {
    case "doc":
      return renderChildren(node);
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`;
    case "heading": {
      const level = (node.attrs?.level as number) ?? 1;
      return `<h${level}>${renderChildren(node)}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${renderChildren(node)}</ul>`;
    case "orderedList":
      return `<ol>${renderChildren(node)}</ol>`;
    case "listItem":
      return `<li>${renderChildren(node)}</li>`;
    case "blockquote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;
    case "codeBlock": {
      const lang = (node.attrs?.language as string) ?? "";
      return `<pre><code data-lang="${escapeHtml(lang)}">${renderChildren(node)}</code></pre>`;
    }
    case "horizontalRule":
      return `<hr/>`;
    case "hardBreak":
      return `<br/>`;
    case "image": {
      const src = (node.attrs?.src as string) ?? "";
      const alt = (node.attrs?.alt as string) ?? "";
      const title = (node.attrs?.title as string) ?? "";
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${title ? ` title="${escapeHtml(title)}"` : ""}/>`;
    }
    case "baziChart":
      return renderBaziChart(node.attrs ?? {});
    case "fiveElementsRadar":
      return renderFiveElements(node.attrs ?? {});
    case "text":
      return renderMarks(node.text ?? "", node.marks);
    default:
      return renderChildren(node);
  }
}

interface BaziPillar { stem: string; branch: string }
function renderBaziChart(attrs: Record<string, unknown>): string {
  const pillars: Array<{ key: string; en: string; cn: string }> = [
    { key: "year",  en: "Year",  cn: "年柱" },
    { key: "month", en: "Month", cn: "月柱" },
    { key: "day",   en: "Day",   cn: "日柱" },
    { key: "hour",  en: "Hour",  cn: "时柱" },
  ];
  const notes = (attrs.notes as string) ?? "";
  const cells = pillars
    .map(({ key, en, cn }) => {
      const p = (attrs[key] as BaziPillar) ?? { stem: "?", branch: "?" };
      return `<div class="bazi-cell">
        <div class="bazi-label">${en} · ${cn}</div>
        <div class="bazi-stem">${escapeHtml(p.stem ?? "")}</div>
        <div class="bazi-branch">${escapeHtml(p.branch ?? "")}</div>
      </div>`;
    })
    .join("");
  return `<div class="bazi-chart" data-bazi-chart>
    <div class="bazi-title">BaZi · 四柱八字</div>
    <div class="bazi-grid">${cells}</div>
    ${notes ? `<p class="bazi-notes">${escapeHtml(notes)}</p>` : ""}
  </div>`;
}

function renderFiveElements(attrs: Record<string, unknown>): string {
  const elements = [
    { key: "wood",  en: "Wood",  cn: "木", color: "#4a8c3a" },
    { key: "fire",  en: "Fire",  cn: "火", color: "#c0392b" },
    { key: "earth", en: "Earth", cn: "土", color: "#a07a3c" },
    { key: "metal", en: "Metal", cn: "金", color: "#d4b150" },
    { key: "water", en: "Water", cn: "水", color: "#3a6b8c" },
  ];
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 28;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / elements.length;

  const axes = elements.map((e, i) => ({
    x:  Math.round(cx + r * Math.cos(angle(i))),
    y:  Math.round(cy + r * Math.sin(angle(i))),
    en: e.en,
    cn: e.cn,
    color: e.color,
  }));
  const values = elements.map((e, i) => {
    const raw = Number(attrs[e.key] ?? 0);
    const pct = Math.max(0, Math.min(100, raw)) / 100;
    return {
      x: Math.round(cx + r * pct * Math.cos(angle(i))),
      y: Math.round(cy + r * pct * Math.sin(angle(i))),
      color: e.color,
      pct: Math.round(pct * 100),
    };
  });

  const rings = [0.25, 0.5, 0.75, 1]
    .map((ring) =>
      `<polygon points="${axes.map((a) => `${cx + (a.x - cx) * ring},${cy + (a.y - cy) * ring}`).join(" ")}" fill="none" stroke="rgba(255,255,255,0.15)" />`,
    )
    .join("");
  const spokes = axes
    .map((a) => `<line x1="${cx}" y1="${cy}" x2="${a.x}" y2="${a.y}" stroke="rgba(255,255,255,0.15)" />`)
    .join("");
  const labels = axes
    .map((a) => {
      const ox = a.x + (a.x - cx) * 0.12;
      const oy = a.y + (a.y - cy) * 0.12;
      return `<text x="${ox}" y="${oy}" text-anchor="middle" dominant-baseline="middle" fill="${a.color}" font-size="13" font-family="Cinzel">${a.en} · ${a.cn}</text>`;
    })
    .join("");
  const dots = values
    .map((v) => `<circle cx="${v.x}" cy="${v.y}" r="4" fill="${v.color}" />`)
    .join("");
  const shape = `<polygon points="${values.map((v) => `${v.x},${v.y}`).join(" ")}" fill="rgba(201,162,51,0.25)" stroke="#c9a233" stroke-width="1.5" />`;

  const legend = elements
    .map((e) => {
      const v = Math.round(Number(attrs[e.key] ?? 0));
      return `<li><span class="dot" style="background:${e.color}"></span>${e.en} · ${e.cn} <span class="pct">${v}%</span></li>`;
    })
    .join("");

  const caption = (attrs.caption as string) ?? "";

  return `<figure class="five-elements" data-five-elements>
    <figcaption class="fe-title">Five Elements · 五行雷达</figcaption>
    <div class="fe-body">
      <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        ${rings}${spokes}${shape}${dots}${labels}
      </svg>
      <ul class="fe-legend">${legend}</ul>
    </div>
    ${caption ? `<p class="fe-caption">${escapeHtml(caption)}</p>` : ""}
  </figure>`;
}
