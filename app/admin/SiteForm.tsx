"use client";

import { useActionState } from "react";
import type { Settings } from "@/lib/site";
import { saveSite, type FormState } from "./actions";

function ImageField({ name, label, value }: { name: string; label: string; value?: string }) {
  return (
    <div className="admin-image-field">
      <label>
        {label}
        <input name={`${name}_file`} type="file" accept="image/*" />
      </label>
      <input type="hidden" name={name} defaultValue={value ?? ""} />
      {value && (
        <div className="admin-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
          <small>새 사진을 고르면 이 사진이 바뀝니다.</small>
        </div>
      )}
    </div>
  );
}

export function SiteForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSite, {});
  const value = (key: string) => settings[key] ?? "";

  return (
    <form className="admin-form" action={action}>
      <section className="admin-section">
        <h2>첫 화면</h2>
        <div className="admin-row">
          <label>큰 제목 첫 줄<input name="hero_title_1" defaultValue={value("hero_title_1")} /></label>
          <label>큰 제목 둘째 줄 (금색)<input name="hero_title_2" defaultValue={value("hero_title_2")} /></label>
        </div>
        <label>제목 아래 한 줄<input name="hero_copy" defaultValue={value("hero_copy")} /></label>
        <ImageField name="hero_image" label="첫 화면 배경 사진" value={value("hero_image")} />
        <div className="admin-row3">
          <label>아래 문구 1<input name="hero_trust_1" defaultValue={value("hero_trust_1")} /></label>
          <label>아래 문구 2<input name="hero_trust_2" defaultValue={value("hero_trust_2")} /></label>
          <label>아래 문구 3<input name="hero_trust_3" defaultValue={value("hero_trust_3")} /></label>
        </div>
        <div className="admin-row">
          <label>오른쪽 아래 영문 문구<input name="signature_title" defaultValue={value("signature_title")} /></label>
          <label>그 아래 한글 문구<input name="signature_copy" defaultValue={value("signature_copy")} /></label>
        </div>
        <label>맨 위 띠 문구<input name="utility_text" defaultValue={value("utility_text")} /></label>
      </section>

      <section className="admin-section">
        <h2>카지노 카드</h2>
        <p className="admin-hint">메인 화면의 카지노 카드와 큰 카드에 쓰입니다. 나머지 메뉴 카드는 게시판 관리에서 바꿉니다.</p>
        <div className="admin-row">
          <label>카드 부제<input name="casino_card_subtitle" defaultValue={value("casino_card_subtitle")} /></label>
          <label>카드 설명<input name="casino_card_description" defaultValue={value("casino_card_description")} /></label>
        </div>
        <ImageField name="casino_card_image" label="카드 사진" value={value("casino_card_image")} />
        <div className="admin-row">
          <label>큰 카드 제목<input name="casino_feature_title" defaultValue={value("casino_feature_title")} /></label>
          <label>큰 카드 문구<input name="casino_feature_copy" defaultValue={value("casino_feature_copy")} /></label>
        </div>
        <ImageField name="casino_feature_image" label="큰 카드 사진" value={value("casino_feature_image")} />
      </section>

      <section className="admin-section">
        <h2>중간 소개 문구</h2>
        <label>큰 제목 (줄바꿈 가능)<textarea name="experience_heading" rows={2} defaultValue={value("experience_heading")} /></label>
        <label>옆 설명 (줄바꿈 가능)<textarea name="experience_copy" rows={2} defaultValue={value("experience_copy")} /></label>
        <label>약속 영역 제목 (줄바꿈 가능)<textarea name="promise_heading" rows={2} defaultValue={value("promise_heading")} /></label>
        <label>약속 영역 설명<textarea name="promise_copy" rows={2} defaultValue={value("promise_copy")} /></label>
      </section>

      <section className="admin-section">
        <h2>하단 상담 배너</h2>
        <label>제목 (줄바꿈 가능)<textarea name="banner_heading" rows={2} defaultValue={value("banner_heading")} /></label>
        <label>설명<textarea name="banner_copy" rows={2} defaultValue={value("banner_copy")} /></label>
        <ImageField name="banner_image" label="배너 배경 사진" value={value("banner_image")} />
      </section>

      <section className="admin-section">
        <h2>상담 링크</h2>
        <div className="admin-row">
          <label>카카오톡 주소<input name="kakao_url" defaultValue={value("kakao_url")} placeholder="https://open.kakao.com/o/..." /></label>
          <label>텔레그램 주소<input name="telegram_url" defaultValue={value("telegram_url")} placeholder="https://t.me/..." /></label>
        </div>
      </section>

      {state.error && <p className="admin-error">{state.error}</p>}
      {state.ok && <p className="admin-ok">{state.ok}</p>}

      <div className="admin-actions">
        <button className="gold-button" type="submit" disabled={pending}>{pending ? "저장 중…" : "저장하기"}</button>
      </div>
    </form>
  );
}
