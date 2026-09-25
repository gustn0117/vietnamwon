"use client";

import Link from "next/link";
import { useActionState } from "react";
import { iconOptions } from "@/components/icons";
import type { Board } from "@/lib/site";
import { saveBoardAction, type FormState } from "./actions";

export function BoardForm({ board }: { board?: Board }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveBoardAction, {});

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="original_slug" value={board?.slug ?? ""} />

      <div className="admin-row">
        <label>메뉴 이름<input name="name" defaultValue={board?.name} placeholder="예: 밤문화" required /></label>
        <label>목록 화면 제목<input name="heading" defaultValue={board?.heading} placeholder="비워두면 메뉴 이름을 씁니다" /></label>
      </div>

      <label>소개 문구<textarea name="description" rows={3} defaultValue={board?.description} /></label>

      <div className="admin-row3">
        <label>
          위치
          <select name="grp" defaultValue={board?.grp ?? "main"}>
            <option value="main">상단 메뉴</option>
            <option value="casino">카지노 하위</option>
          </select>
        </label>
        <label>주소(slug)<input name="slug" defaultValue={board?.slug} placeholder="nightlife" required /></label>
        <label>정렬 순서<input name="sort_order" type="number" defaultValue={board?.sort_order ?? 0} /></label>
      </div>

      <label className="admin-check">
        <input type="checkbox" name="visible" defaultChecked={board?.visible ?? true} /> 메뉴에 보이기
      </label>

      <section className="admin-section">
        <h2>메인 화면 카드</h2>
        <label className="admin-check">
          <input type="checkbox" name="card_show" defaultChecked={board?.card_show ?? false} /> 메인 화면 카드로 보이기
        </label>
        <div className="admin-row">
          <label>카드 부제<input name="card_subtitle" defaultValue={board?.card_subtitle} placeholder="예: 트렌디한 핫플레이스" /></label>
          <label>
            아이콘
            <select name="card_icon" defaultValue={board?.card_icon ?? "spade"}>
              {iconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>{icon.label}</option>
              ))}
            </select>
          </label>
        </div>
        <label>카드 사진<input name="card_image_file" type="file" accept="image/*" /></label>
        <input type="hidden" name="card_image" defaultValue={board?.card_image ?? ""} />
        {board?.card_image && (
          <div className="admin-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={board.card_image} alt="" />
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>메인 화면 큰 카드</h2>
        <p className="admin-hint">제목을 비워두면 큰 카드에 나오지 않습니다.</p>
        <div className="admin-row">
          <label>큰 카드 제목<input name="feature_title" defaultValue={board?.feature_title ?? ""} /></label>
          <label>큰 카드 문구<input name="feature_copy" defaultValue={board?.feature_copy ?? ""} /></label>
        </div>
        <label>큰 카드 사진<input name="feature_image_file" type="file" accept="image/*" /></label>
        <input type="hidden" name="feature_image" defaultValue={board?.feature_image ?? ""} />
        {board?.feature_image && (
          <div className="admin-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={board.feature_image} alt="" />
          </div>
        )}
      </section>

      {state.error && <p className="admin-error">{state.error}</p>}

      <div className="admin-actions">
        <button className="gold-button" type="submit" disabled={pending}>{pending ? "저장 중…" : "저장하기"}</button>
        <Link className="outline-button" href="/admin/boards">취소</Link>
      </div>
    </form>
  );
}
