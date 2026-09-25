"use client";

import { useState } from "react";

const MAX_EDGE = 1920;
const QUALITY = 0.85;

async function shrink(file: File) {
  if (file.size < 400 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function upload(file: File) {
  const body = new FormData();
  body.append("file", await shrink(file));
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error ?? "업로드에 실패했습니다.");
  return data.url;
}

type Props = {
  name: string;
  label: string;
  multiple?: boolean;
  initial?: string[];
  hint?: string;
  numbered?: boolean;
};

export function ImageUploader({ name, label, multiple = false, initial = [], hint, numbered = false }: Props) {
  const [urls, setUrls] = useState<string[]>(initial.filter(Boolean));
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const chosen = [...files];
    setBusy(chosen.length);
    const done: string[] = [];
    for (const file of chosen) {
      try {
        done.push(await upload(file));
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "업로드에 실패했습니다.");
      }
      setBusy((count) => count - 1);
    }
    setUrls((current) => (multiple ? [...current, ...done] : done.slice(-1)));
  };

  return (
    <div className="uploader">
      <label>
        {label}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {hint && <p className="admin-hint">{hint}</p>}
      {busy > 0 && <p className="admin-hint">사진 올리는 중… {busy}장 남음</p>}
      {error && <p className="admin-error">{error}</p>}

      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {urls.length > 0 && (
        <div className={multiple ? "admin-photos" : "admin-photos is-single"}>
          {urls.map((url, index) => (
            <figure key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <figcaption>
                {numbered ? <span>[사진{index + 1}]</span> : <span>올림</span>}
                <button type="button" onClick={() => setUrls(urls.filter((item) => item !== url))}>빼기</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
