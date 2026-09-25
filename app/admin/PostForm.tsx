"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import type { Post } from "@/lib/posts";
import { savePost, type FormState } from "./actions";

type BoardOption = { slug: string; heading: string; grp: string };

export function PostForm({
  post,
  boards,
  defaultCategory,
}: {
  post?: Post;
  boards: BoardOption[];
  defaultCategory?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, {});

  const casino = boards.filter((board) => board.grp === "casino");
  const main = boards.filter((board) => board.grp !== "casino");

  return (
    <form className="admin-form" action={action}>
      {post && <input type="hidden" name="id" value={post.id} />}

      <label>
        게시판
        <select name="category" defaultValue={post?.category ?? defaultCategory ?? boards[0]?.slug} required>
          {casino.length > 0 && (
            <optgroup label="카지노">
              {casino.map((board) => (
                <option key={board.slug} value={board.slug}>{board.heading}</option>
              ))}
            </optgroup>
          )}
          <optgroup label="그 외">
            {main.map((board) => (
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
        <textarea
          name="body"
          rows={16}
          defaultValue={post?.body}
          placeholder={"소개, 위치, 이용 방법 등을 자유롭게 적어주세요.\n\n사진을 넣고 싶은 자리에는 줄을 바꿔 [사진1] 처럼 적어주세요."}
        />
      </label>
      <p className="admin-hint">
        아래에서 본문 사진을 올리면 <b>[사진1]</b>, <b>[사진2]</b> 번호가 붙습니다. 본문에서 사진을 넣고 싶은 줄에 그 번호를 그대로
        적으면 그 자리에 사진이 들어갑니다. 번호를 적지 않은 사진은 글 맨 아래에 순서대로 붙습니다.
      </p>

      <ImageUploader name="cover_url" label="대표 사진 (목록에 보이는 사진)" initial={post?.cover_url ? [post.cover_url] : []} />

      <ImageUploader
        name="keep_image"
        label="본문 사진 (여러 장 선택 가능)"
        multiple
        numbered
        initial={post?.images ?? []}
      />

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
