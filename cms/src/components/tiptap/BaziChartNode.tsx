"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export interface BaziChartAttrs {
  year:  { stem: string; branch: string };
  month: { stem: string; branch: string };
  day:   { stem: string; branch: string };
  hour:  { stem: string; branch: string };
  notes?: string;
}

export const DEFAULT_BAZI: BaziChartAttrs = {
  year:  { stem: "甲", branch: "子" },
  month: { stem: "乙", branch: "丑" },
  day:   { stem: "丙", branch: "寅" },
  hour:  { stem: "丁", branch: "卯" },
  notes: "",
};

const STEMS = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const BRANCHES = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

const PILLAR_LABELS = [
  { key: "year",  en: "Year",  cn: "年柱" },
  { key: "month", en: "Month", cn: "月柱" },
  { key: "day",   en: "Day",   cn: "日柱" },
  { key: "hour",  en: "Hour",  cn: "时柱" },
] as const;

function BaziChartView({ node, updateAttributes, editor }: NodeViewProps) {
  const attrs = node.attrs as BaziChartAttrs;
  const editable = editor.isEditable;

  function setStem(pillar: keyof BaziChartAttrs, stem: string) {
    if (pillar === "notes") return;
    updateAttributes({ [pillar]: { ...(attrs[pillar] as { stem: string; branch: string }), stem } });
  }
  function setBranch(pillar: keyof BaziChartAttrs, branch: string) {
    if (pillar === "notes") return;
    updateAttributes({ [pillar]: { ...(attrs[pillar] as { stem: string; branch: string }), branch } });
  }

  return (
    <NodeViewWrapper
      as="div"
      data-bazi-chart
      className="my-6 rounded-lg border p-4"
      style={{ borderColor: "var(--c-border)", background: "rgba(201,162,51,0.04)" }}
    >
      <div
        className="mb-3 text-[11px] uppercase tracking-[0.25em]"
        style={{ color: "var(--c-primary-soft)", fontFamily: "Cinzel" }}
      >
        BaZi · 四柱八字
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PILLAR_LABELS.map(({ key, en, cn }) => {
          const pillar = attrs[key as keyof BaziChartAttrs] as { stem: string; branch: string };
          return (
            <div
              key={key}
              className="rounded-md border p-3 text-center"
              style={{ borderColor: "var(--c-border)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
                {en} · {cn}
              </div>
              {editable ? (
                <>
                  <select
                    className="mt-2 w-full rounded bg-transparent text-center text-2xl"
                    style={{ color: "var(--c-primary-soft)", fontFamily: "Noto Serif SC" }}
                    value={pillar.stem}
                    onChange={(e) => setStem(key as keyof BaziChartAttrs, e.target.value)}
                  >
                    {STEMS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    className="mt-1 w-full rounded bg-transparent text-center text-2xl"
                    style={{ color: "var(--c-text)", fontFamily: "Noto Serif SC" }}
                    value={pillar.branch}
                    onChange={(e) => setBranch(key as keyof BaziChartAttrs, e.target.value)}
                  >
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </>
              ) : (
                <div className="mt-2 leading-tight">
                  <div className="text-3xl" style={{ color: "var(--c-primary-soft)", fontFamily: "Noto Serif SC" }}>
                    {pillar.stem}
                  </div>
                  <div className="text-3xl" style={{ color: "var(--c-text)", fontFamily: "Noto Serif SC" }}>
                    {pillar.branch}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {editable && (
        <textarea
          className="mt-3 w-full rounded-md border bg-transparent p-2 text-xs"
          style={{ borderColor: "var(--c-border)", color: "var(--c-text-soft)" }}
          rows={2}
          placeholder="Optional notes (e.g. day master analysis)…"
          value={attrs.notes ?? ""}
          onChange={(e) => updateAttributes({ notes: e.target.value })}
        />
      )}
      {!editable && attrs.notes && (
        <p className="mt-3 text-sm italic" style={{ color: "var(--c-text-soft)" }}>
          {attrs.notes}
        </p>
      )}
    </NodeViewWrapper>
  );
}

export const BaziChartNode = Node.create({
  name: "baziChart",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      year:  { default: DEFAULT_BAZI.year },
      month: { default: DEFAULT_BAZI.month },
      day:   { default: DEFAULT_BAZI.day },
      hour:  { default: DEFAULT_BAZI.hour },
      notes: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-bazi-chart]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-bazi-chart": "true" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BaziChartView);
  },
});
