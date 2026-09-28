"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { iconOptions } from "@/components/icons";
import type { Board } from "@/lib/site";
import { saveBoardAction, type FormState } from "./actions";

export function BoardForm({ board, parents }: { board?: Board; parents: { slug: string; name: string }[] }) {
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
          <select name="parent" defaultValue={board?.parent ?? ""}>
            <option value="">상단 메뉴</option>
            {parents.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name} 하위</option>
            ))}
          </select>
        </label>
        <label>주소<input name="segment" defaultValue={board?.segment} placeholder="nightlife" required /></label>
        <label>정렬 순서<input name="sort_order" type="number" defaultValue={board?.sort_order ?? 0} /></label>
      </div>

      <label className="admin-check">
        <input type="checkbox" name="menu_show" defaultChecked={board?.menu_show ?? true} /> 상단 메뉴에 보이기
      </label>
      <label className="admin-check">
        <input type="checkbox" name="visible" defaultChecked={board?.visible ?? true} /> 사이트에서 사용 (끄면 페이지도 닫힙니다)
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
        <ImageUploader name="card_image" label="카드 사진" initial={board?.card_image ? [board.card_image] : []} />
      </section>

      <section className="admin-section">
        <h2>메인 화면 큰 카드</h2>
        <p className="admin-hint">제목을 비워두면 큰 카드에 나오지 않습니다.</p>
        <label className="admin-check">
          <input type="checkbox" name="feature_link" defaultChecked={board?.feature_link ?? true} /> 큰 카드를 누르면 이 메뉴로 이동
        </label>
        <div className="admin-row">
          <label>큰 카드 제목<input name="feature_title" defaultValue={board?.feature_title ?? ""} /></label>
          <label>큰 카드 문구<input name="feature_copy" defaultValue={board?.feature_copy ?? ""} /></label>
        </div>
        <ImageUploader name="feature_image" label="큰 카드 사진" initial={board?.feature_image ? [board.feature_image] : []} />
      </section>

      {state.error && <p className="admin-error">{state.error}</p>}

      <div className="admin-actions">
        <button className="gold-button" type="submit" disabled={pending}>{pending ? "저장 중…" : "저장하기"}</button>
        <Link className="outline-button" href="/admin/boards">취소</Link>
      </div>
    </form>
  );
}
