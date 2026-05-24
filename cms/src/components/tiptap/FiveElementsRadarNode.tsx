"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export interface FiveElementsAttrs {
  wood:  number;
  fire:  number;
  earth: number;
  metal: number;
  water: number;
  caption?: string;
}

export const DEFAULT_FIVE: FiveElementsAttrs = {
  wood: 60, fire: 70, earth: 50, metal: 80, water: 40, caption: "",
};

interface ElementMeta { key: keyof FiveElementsAttrs; en: string; cn: string; color: string }

export const ELEMENTS: ElementMeta[] = [
  { key: "wood",  en: "Wood",  cn: "木", color: "#4a8c3a" },
  { key: "fire",  en: "Fire",  cn: "火", color: "#c0392b" },
  { key: "earth", en: "Earth", cn: "土", color: "#a07a3c" },
  { key: "metal", en: "Metal", cn: "金", color: "#d4b150" },
  { key: "water", en: "Water", cn: "水", color: "#3a6b8c" },
];

interface PolygonGeometry {
  axes:   Array<{ x: number; y: number; key: string; en: string; cn: string; color: string }>;
  values: Array<{ x: number; y: number; key: string; pct: number; color: string }>;
  rings:  number[];
}

function geometry(attrs: FiveElementsAttrs, size: number): PolygonGeometry {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / ELEMENTS.length;
  return {
    axes: ELEMENTS.map((e, i) => ({
      x: Math.round(cx + r * Math.cos(angle(i))),
      y: Math.round(cy + r * Math.sin(angle(i))),
      key: e.key,
      en: e.en,
      cn: e.cn,
      color: e.color,
    })),
    values: ELEMENTS.map((e, i) => {
      const pct = Math.max(0, Math.min(100, attrs[e.key] as number)) / 100;
      return {
        x: Math.round(cx + r * pct * Math.cos(angle(i))),
        y: Math.round(cy + r * pct * Math.sin(angle(i))),
        key: e.key,
        pct: Math.round(pct * 100),
        color: e.color,
      };
    }),
    rings: [0.25, 0.5, 0.75, 1],
  };
}

function FiveElementsView({ node, updateAttributes, editor }: NodeViewProps) {
  const attrs = node.attrs as FiveElementsAttrs;
  const editable = editor.isEditable;
  const size = 280;
  const geo = geometry(attrs, size);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 28;

  return (
    <NodeViewWrapper
      as="div"
      data-five-elements
      className="my-6 rounded-lg border p-4"
      style={{ borderColor: "var(--c-border)", background: "rgba(201,162,51,0.04)" }}
    >
      <div
        className="mb-3 text-[11px] uppercase tracking-[0.25em]"
        style={{ color: "var(--c-primary-soft)", fontFamily: "Cinzel" }}
      >
        Five Elements · 五行雷达
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-around">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Five elements radar">
          {geo.rings.map((ring) => (
            <polygon
              key={ring}
              points={geo.axes
                .map((p) => `${cx + (p.x - cx) * ring},${cy + (p.y - cy) * ring}`)
                .join(" ")}
              fill="none"
              stroke="var(--c-border)"
              strokeOpacity={0.6}
            />
          ))}
          {geo.axes.map((a) => (
            <line
              key={a.key}
              x1={cx} y1={cy} x2={a.x} y2={a.y}
              stroke="var(--c-border)" strokeOpacity={0.5}
            />
          ))}
          <polygon
            points={geo.values.map((v) => `${v.x},${v.y}`).join(" ")}
            fill="rgba(201, 162, 51, 0.25)"
            stroke="var(--c-primary)"
            strokeWidth={1.5}
          />
          {geo.values.map((v) => (
            <circle key={v.key} cx={v.x} cy={v.y} r={4} fill={v.color} />
          ))}
          {geo.axes.map((a) => {
            const ox = a.x + (a.x - cx) * 0.12;
            const oy = a.y + (a.y - cy) * 0.12;
            return (
              <text
                key={`label-${a.key}`}
                x={ox}
                y={oy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={a.color}
                fontSize="13"
                fontFamily="Cinzel"
              >
                {a.en} · {a.cn}
              </text>
            );
          })}
        </svg>

        <div className="flex w-full max-w-xs flex-col gap-2">
          {ELEMENTS.map((e) => (
            <label key={e.key} className="block">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: e.color }}>
                  {e.en} · {e.cn}
                </span>
                <span style={{ color: "var(--c-text-soft)" }}>{attrs[e.key]}%</span>
              </div>
              {editable ? (
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={attrs[e.key] as number}
                  onChange={(ev) =>
                    updateAttributes({ [e.key]: parseInt(ev.target.value, 10) })
                  }
                  className="w-full"
                  style={{ accentColor: e.color }}
                />
              ) : (
                <div
                  className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    style={{
                      width: `${attrs[e.key]}%`,
                      background: e.color,
                      height: "100%",
                    }}
                  />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
      {editable ? (
        <input
          type="text"
          value={attrs.caption ?? ""}
          onChange={(e) => updateAttributes({ caption: e.target.value })}
          placeholder="Optional caption (e.g. Day Master: Wood, weak)…"
          className="mt-3 w-full rounded-md border bg-transparent p-2 text-xs"
          style={{ borderColor: "var(--c-border)", color: "var(--c-text-soft)" }}
        />
      ) : attrs.caption ? (
        <p className="mt-3 text-center text-sm italic" style={{ color: "var(--c-text-soft)" }}>
          {attrs.caption}
        </p>
      ) : null}
    </NodeViewWrapper>
  );
}

export const FiveElementsRadarNode = Node.create({
  name: "fiveElementsRadar",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      wood:    { default: DEFAULT_FIVE.wood },
      fire:    { default: DEFAULT_FIVE.fire },
      earth:   { default: DEFAULT_FIVE.earth },
      metal:   { default: DEFAULT_FIVE.metal },
      water:   { default: DEFAULT_FIVE.water },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-five-elements]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-five-elements": "true" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FiveElementsView);
  },
});
