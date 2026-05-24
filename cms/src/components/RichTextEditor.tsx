"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect, useRef, useState } from "react";
import { BaziChartNode, DEFAULT_BAZI } from "@/components/tiptap/BaziChartNode";
import { FiveElementsRadarNode, DEFAULT_FIVE } from "@/components/tiptap/FiveElementsRadarNode";

interface RichTextEditorProps {
  value?: JSONContent;
  onChange: (json: JSONContent, html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [drafting, setDrafting] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Tell your story…" }),
      Typography,
      BaziChartNode,
      FiveElementsRadarNode,
    ],
    content: value ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate({ editor }) {
      onChange(editor.getJSON(), editor.getHTML());
    },
    editorProps: {
      attributes: { class: "tiptap" },
    },
  });

  // Sync external value (for edit mode after fetch)
  useEffect(() => {
    if (!editor || !value) return;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  async function handleImagePick(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      editor?.chain().focus().setImage({ src: json.data.url, alt: file.name }).run();
    } catch (err) {
      alert(`Image upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  function promptLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertBazi() {
    editor!
      .chain()
      .focus()
      .insertContent({ type: "baziChart", attrs: { ...DEFAULT_BAZI } })
      .run();
  }

  function insertFiveElements() {
    editor!
      .chain()
      .focus()
      .insertContent({ type: "fiveElementsRadar", attrs: { ...DEFAULT_FIVE } })
      .run();
  }

  async function aiDraft() {
    if (!editor) return;
    const selectionText = editor.state.doc
      .textBetween(editor.state.selection.from, editor.state.selection.to, "\n")
      .trim();
    const fallback = editor.getText().slice(-1200).trim();
    const prompt = selectionText || fallback;
    if (!prompt) {
      alert("Write a few words first — AI needs something to riff on.");
      return;
    }
    setDrafting(true);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode: "continue" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "AI draft failed");
      const text: string = json.data?.text ?? "";
      if (!text) throw new Error("Empty response");
      editor.chain().focus().insertContent(`\n\n${text}`).run();
    } catch (err) {
      alert(`AI draft failed: ${(err as Error).message}`);
    } finally {
      setDrafting(false);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 border-b p-2"
        style={{ borderColor: "var(--c-border)" }}
      >
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}    active={editor.isActive("bold")}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}  active={editor.isActive("italic")}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()}  active={editor.isActive("strike")}>
          <s>S</s>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()}    active={editor.isActive("code")}>
          {"</>"}
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          H1
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          H2
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          H3
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()}                active={editor.isActive("paragraph")}>
          ¶
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}   active={editor.isActive("bulletList")}>
          • List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()}  active={editor.isActive("orderedList")}>
          1. List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()}   active={editor.isActive("blockquote")}>
          ❝
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}    active={editor.isActive("codeBlock")}>
          { "{ }" }
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ─
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={promptLink} active={editor.isActive("link")}>
          🔗
        </ToolbarButton>

        <ToolbarButton onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : "🖼 Image"}
        </ToolbarButton>

        <ToolbarButton onClick={insertBazi}>
          ☯ BaZi
        </ToolbarButton>
        <ToolbarButton onClick={insertFiveElements}>
          ✦ 五行
        </ToolbarButton>
        <ToolbarButton onClick={aiDraft} disabled={drafting}>
          {drafting ? "AI drafting…" : "✨ AI"}
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImagePick(f);
            e.target.value = "";
          }}
        />

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          ↶
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          ↷
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md px-2.5 py-1 text-sm transition"
      style={{
        background: active ? "rgba(201,162,51,0.18)" : "transparent",
        color: active ? "var(--c-primary-soft)" : "var(--c-text)",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) (e.currentTarget.style.background = "rgba(255,255,255,0.04)");
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget.style.background = "transparent");
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 inline-block h-5 w-px" style={{ background: "var(--c-border)" }} />;
}
