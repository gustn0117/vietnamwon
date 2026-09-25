"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
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
  const [cover, setCover] = useState<string | null>(post?.cover_url ?? null);
  const [images, setImages] = useState<string[]>(post?.images ?? []);
  const [added, setAdded] = useState<string[]>([]);

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
        본문 사진을 올리면 아래에 <b>[사진1]</b>, <b>[사진2]</b> 번호가 붙습니다. 본문에서 사진을 넣고 싶은 줄에 그 번호를 그대로
        적으면 그 자리에 사진이 들어갑니다. 번호를 적지 않은 사진은 글 맨 아래에 순서대로 붙습니다.
      </p>

      <label>
        대표 사진 (목록에 보이는 사진)
        <input
          name="cover"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setCover(file ? URL.createObjectURL(file) : post?.cover_url ?? null);
          }}
        />
      </label>

      {cover && (
        <div className="admin-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="대표 사진 미리보기" />
          {post?.cover_url && (
            <label className="admin-check">
              <input type="checkbox" name="remove_cover" /> 대표 사진 지우기
            </label>
          )}
        </div>
      )}

      <label>
        본문 사진 (여러 장 선택 가능)
        <input
          name="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => setAdded([...(event.target.files ?? [])].map((file) => URL.createObjectURL(file)))}
        />
      </label>

      {(images.length > 0 || added.length > 0) && (
        <div className="admin-photos">
          {images.map((src, index) => (
            <figure key={src}>
              <input type="hidden" name="keep_image" value={src} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
              <figcaption>
                <span>[사진{index + 1}]</span>
                <button type="button" onClick={() => setImages(images.filter((item) => item !== src))}>빼기</button>
              </figcaption>
            </figure>
          ))}
          {added.map((src, index) => (
            <figure key={src} className="is-new">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
              <figcaption><span>[사진{images.length + index + 1}] 저장하면 추가됩니다</span></figcaption>
            </figure>
          ))}
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
