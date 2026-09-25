"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { mergeAttributes } from "@tiptap/core";
import { useRef, useState } from "react";

const RichImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-href"),
      },
      width: {
        default: null,
        parseHTML: (element) => element.style.width || null,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { href, width, ...rest } = HTMLAttributes as Record<string, string | null>;
    const img = [
      "img",
      mergeAttributes(rest, {
        style: width ? `width:${width}` : null,
        "data-href": href,
      }),
    ];
    if (!href) return img as never;
    return ["a", { href, target: "_blank", rel: "noopener noreferrer" }, img] as never;
  },
});

const FONT_SIZES = [
  { label: "작게", value: "15px" },
  { label: "보통", value: "18px" },
  { label: "크게", value: "22px" },
  { label: "아주 크게", value: "28px" },
];

const COLORS = ["#f7f3e8", "#dfb95f", "#ffffff", "#9fd3ff", "#ff9f9f", "#a3a8b0"];

async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error ?? "업로드에 실패했습니다.");
  return data.url;
}

const MAX_EDGE = 1920;

async function shrink(file: File) {
  if (file.size < 400 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function Button({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={active ? "is-active" : ""} title={title} onClick={onClick}>
      {children}
    </button>
  );
}

function Toolbar({ editor, onPickImages }: { editor: Editor; onPickImages: () => void }) {
  const imageSelected = editor.isActive("image");

  const setLink = () => {
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("연결할 주소를 붙여넣어 주세요. (지우려면 비워두고 확인)", previous);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = /^https?:\/\//.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    editor.chain().focus().extendMarkRange("link").setLink({ href, target: "_blank" }).run();
  };

  const setImageLink = () => {
    const previous = (editor.getAttributes("image").href as string) ?? "";
    const url = window.prompt("사진을 누르면 열릴 주소를 붙여넣어 주세요. (지우려면 비워두고 확인)", previous);
    if (url === null) return;
    const trimmed = url.trim();
    const href = trimmed ? (/^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`) : null;
    editor.chain().focus().updateAttributes("image", { href }).run();
  };

  return (
    <div className="editor-toolbar">
      <div className="editor-group">
        <select
          value={editor.getAttributes("textStyle").fontSize ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            if (!value) editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(value).run();
          }}
          title="글자 크기"
        >
          <option value="">글자 크기</option>
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>

        <select
          value={editor.isActive("heading", { level: 2 }) ? "2" : editor.isActive("heading", { level: 3 }) ? "3" : "p"}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: Number(value) as 2 | 3 }).run();
          }}
          title="문단 종류"
        >
          <option value="p">본문</option>
          <option value="2">제목</option>
          <option value="3">소제목</option>
        </select>
      </div>

      <div className="editor-group">
        <Button title="굵게" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>가</b>
        </Button>
        <Button title="기울임" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>가</i>
        </Button>
        <Button title="밑줄" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>가</u>
        </Button>
        <Button title="취소선" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>가</s>
        </Button>
      </div>

      <div className="editor-group editor-colors">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className="editor-color"
            style={{ background: color }}
            title="글자색"
            onClick={() => editor.chain().focus().setColor(color).run()}
          />
        ))}
      </div>

      <div className="editor-group">
        <Button title="왼쪽 정렬" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>≡</Button>
        <Button title="가운데 정렬" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>≣</Button>
        <Button title="오른쪽 정렬" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>≡</Button>
      </div>

      <div className="editor-group">
        <Button title="글머리 기호" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• 목록</Button>
        <Button title="번호 목록" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. 목록</Button>
        <Button title="인용구" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ 인용</Button>
        <Button title="구분선" onClick={() => editor.chain().focus().setHorizontalRule().run()}>─ 줄</Button>
      </div>

      <div className="editor-group">
        <Button title="글자에 링크 걸기" active={editor.isActive("link")} onClick={setLink}>🔗 링크</Button>
        <Button title="사진 넣기" onClick={onPickImages}>🖼 사진</Button>
      </div>

      {imageSelected && (
        <div className="editor-group editor-image-tools">
          <span>선택한 사진</span>
          <Button title="사진에 링크 걸기" onClick={setImageLink}>🔗 링크 걸기</Button>
          <Button title="원래 크기" onClick={() => editor.chain().focus().updateAttributes("image", { width: null }).run()}>100%</Button>
          <Button title="70% 크기" onClick={() => editor.chain().focus().updateAttributes("image", { width: "70%" }).run()}>70%</Button>
          <Button title="50% 크기" onClick={() => editor.chain().focus().updateAttributes("image", { width: "50%" }).run()}>50%</Button>
          <Button title="사진 지우기" onClick={() => editor.chain().focus().deleteSelection().run()}>지우기</Button>
        </div>
      )}
    </div>
  );
}

export function RichEditor({ name, initialHtml }: { name: string; initialHtml: string }) {
  const [html, setHtml] = useState(initialHtml);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
      }),
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      RichImage.configure({ inline: false }),
      Placeholder.configure({ placeholder: "내용을 입력하세요. 사진은 위 ‘사진’ 버튼으로 넣거나 붙여넣으면 됩니다." }),
    ],
    content: initialHtml || "<p></p>",
    onUpdate: ({ editor: current }) => setHtml(current.getHTML()),
    editorProps: {
      attributes: { class: "editor-surface" },
      handlePaste(view, event) {
        const files = [...(event.clipboardData?.files ?? [])].filter((file) => file.type.startsWith("image/"));
        if (!files.length) return false;
        event.preventDefault();
        void insertImages(files);
        return true;
      },
      handleDrop(view, event) {
        const files = [...((event as DragEvent).dataTransfer?.files ?? [])].filter((file) => file.type.startsWith("image/"));
        if (!files.length) return false;
        event.preventDefault();
        void insertImages(files);
        return true;
      },
    },
  });

  async function insertImages(files: File[]) {
    if (!editor || !files.length) return;
    setError(null);
    setBusy(files.length);
    for (const file of files) {
      try {
        const url = await uploadFile(await shrink(file));
        editor.chain().focus().setImage({ src: url }).createParagraphNear().run();
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "사진을 올리지 못했습니다.");
      }
      setBusy((count) => count - 1);
    }
    setHtml(editor.getHTML());
  }

  if (!editor) return <div className="editor-loading">편집기를 불러오는 중…</div>;

  return (
    <div className="editor">
      <Toolbar editor={editor} onPickImages={() => fileInput.current?.click()} />
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          void insertImages([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
      {busy > 0 && <p className="admin-hint">사진 올리는 중… {busy}장 남음</p>}
      {error && <p className="admin-error">{error}</p>}
      <p className="admin-hint">사진은 복사해서 붙여넣거나 창 안으로 끌어다 놓아도 올라갑니다.</p>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
