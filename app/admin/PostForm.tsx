"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { casinoBoards, mainBoards } from "@/lib/boards";
import type { Post } from "@/lib/posts";
import { savePost, type FormState } from "./actions";

export function PostForm({ post, defaultCategory }: { post?: Post; defaultCategory?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, {});
  const [preview, setPreview] = useState<string | null>(post?.cover_url ?? null);

  return (
    <form className="admin-form" action={action}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <label>
        게시판
        <select name="category" defaultValue={post?.category ?? defaultCategory ?? casinoBoards[0].slug} required>
          <optgroup label="카지노">
            {casinoBoards.map((board) => (
              <option key={board.slug} value={board.slug}>{board.heading}</option>
            ))}
          </optgroup>
          <optgroup label="그 외">
            {mainBoards.map((board) => (
              <option key={board.slug} value={board.slug}>{board.heading}</option>
            ))}
          </optgroup>
        </select>
      </label>

      <label>
        제목
        <input name="title" defaultValue={post?.title} placeholder="예: 나트랑 두엔하 카지노" required />
      </label>

      <label>
        목록에 보일 요약
        <input name="excerpt" defaultValue={post?.excerpt} placeholder="한두 문장으로 적어주세요" />
      </label>

      <label>
        본문
        <textarea name="body" rows={16} defaultValue={post?.body} placeholder="소개, 위치, 이용 방법 등을 자유롭게 적어주세요" />
      </label>

      <label>
        대표 사진
        <input
          name="cover"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : post?.cover_url ?? null);
          }}
        />
      </label>

      {preview && (
        <div className="admin-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="대표 사진 미리보기" />
          {post?.cover_url && (
            <label className="admin-check">
              <input type="checkbox" name="remove_cover" /> 대표 사진 지우기
            </label>
          )}
        </div>
      )}

      <div className="admin-row">
        <label>
          주소(slug) — 비워두면 제목으로 자동 생성
          <input name="slug" defaultValue={post?.slug} placeholder="duyen-ha-casino" />
        </label>
        <label>
          정렬 순서 — 숫자가 작을수록 위
          <input name="sort_order" type="number" defaultValue={post?.sort_order ?? 0} />
        </label>
      </div>

      <label className="admin-check">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} /> 사이트에 공개
      </label>

      {state.error && <p className="admin-error">{state.error}</p>}

      <div className="admin-actions">
        <button className="gold-button" type="submit" disabled={pending}>
          {pending ? "저장 중…" : "저장하기"}
        </button>
        <Link className="outline-button" href="/admin">취소</Link>
      </div>
    </form>
  );
}
