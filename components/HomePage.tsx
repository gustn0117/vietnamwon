"use client";

import Image from "next/image";
import {
  ArrowRight,
  CaretRight,
  ChatsCircle,
  CheckCircle,
  Diamond,
  Headset,
  Island,
  List,
  MagnifyingGlass,
  ShieldCheck,
  Star,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Category = {
  title: string;
  english: string;
  subtitle: string;
  description: string;
  image: string;
  position?: string;
};

const categories: Category[] = [
  {
    title: "카지노",
    english: "Casino",
    subtitle: "프리미엄 게임 투어",
    description: "도시별 카지노 정보와 이동 동선을 한 번에 안내해 드립니다.",
    image: "/images/category-casino.webp",
  },
  {
    title: "베트남 유흥",
    english: "Night Life",
    subtitle: "다양한 밤문화 정보",
    description: "지역별 인기 스폿과 안전하게 즐기는 방법을 큐레이션합니다.",
    image: "/images/category-nightlife.webp",
  },
  {
    title: "프로모션",
    english: "Promotion",
    subtitle: "지금 만나는 특별한 혜택",
    description: "시즌별 숙소와 액티비티 혜택을 보기 쉽게 모았습니다.",
    image: "/images/category-promotion.webp",
  },
  {
    title: "VIP 여행",
    english: "VIP Trip",
    subtitle: "프리미엄 맞춤 여행",
    description: "공항 픽업부터 전용 차량, 맞춤 일정까지 세심하게 설계합니다.",
    image: "/images/category-vip.webp",
    position: "center 58%",
  },
  {
    title: "여행 TIP",
    english: "Travel Tips",
    subtitle: "베트남을 더 깊이, 더 즐겁게",
    description: "출발 전 준비부터 현지에서 꼭 필요한 여행 정보를 전합니다.",
    image: "/images/category-travel-tip.webp",
  },
  {
    title: "호텔 & 풀빌라",
    english: "Hotel & Pool Villa",
    subtitle: "최고의 휴식 공간",
    description: "여행 취향과 동선에 맞춘 검증된 숙소를 추천합니다.",
    image: "/images/category-hotel.webp",
  },
  {
    title: "골프 & 레저",
    english: "Golf & Leisure",
    subtitle: "프리미엄 골프 여행",
    description: "아름다운 코스와 레저를 여유롭게 즐기는 일정을 만듭니다.",
    image: "/images/category-golf.webp",
  },
  {
    title: "후기 & 자유게시판",
    english: "Community",
    subtitle: "여행자들의 생생한 이야기",
    description: "베트남원을 먼저 경험한 여행자의 팁과 후기를 만나보세요.",
    image: "/images/category-community.webp",
  },
];

const navItems = [
  "카지노",
  "베트남 유흥",
  "프로모션",
  "VIP 여행",
  "여행 TIP",
  "호텔 & 풀빌라",
  "골프 & 레저",
  "후기 & 자유게시판",
];

export function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [consultOpen, setConsultOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filteredCategories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return categories;
    return categories.filter((item) =>
      `${item.title} ${item.english} ${item.subtitle} ${item.description}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  useEffect(() => {
    const modalOpen = Boolean(selected) || consultOpen || mobileOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    if ((selected || consultOpen) && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, consultOpen, mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setConsultOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  const openConsult = () => {
    setSubmitted(false);
    setConsultOpen(true);
  };

  return (
    <main>
      <a className="skip-link" href="#main-content">
        본문 바로가기
      </a>

      <div className="notice-bar">
        <div className="shell notice-inner">
          <span>지금 상담하면, 인기 여행지 맞춤 견적을 빠르게 받아보실 수 있습니다.</span>
          <button type="button" onClick={openConsult}>
            카카오톡으로 1:1 빠른 상담하기 <CaretRight weight="bold" />
          </button>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-main">
          <a className="brand" href="#top" aria-label="베트남원 홈">
            <Island weight="duotone" aria-hidden="true" />
            <span>베트남원</span>
          </a>

          <form className="header-search" role="search" onSubmit={handleSearch}>
            <MagnifyingGlass size={23} aria-hidden="true" />
            <label className="sr-only" htmlFor="site-search">
              여행 카테고리 검색
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!event.target.value) setSearched(false);
              }}
              placeholder="어디로 떠나시나요?"
            />
          </form>

          <div className="header-actions">
            <button className="login-button" type="button" onClick={openConsult}>
              <UserCircle size={25} weight="fill" />
              <span>로그인</span>
            </button>
            <button
              type="button"
              className="menu-button"
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <List size={29} />
            </button>
          </div>
        </div>

        <nav className="shell desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <a href="#categories" key={item} onClick={() => setQuery(item)}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      {mobileOpen && (
        <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="모바일 메뉴">
          <button className="drawer-backdrop" aria-label="메뉴 닫기" onClick={() => setMobileOpen(false)} />
          <aside className="mobile-drawer">
            <div className="drawer-heading">
              <a className="brand" href="#top" onClick={() => setMobileOpen(false)}>
                <Island weight="duotone" />
                <span>베트남원</span>
              </a>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="메뉴 닫기">
                <X size={25} />
              </button>
            </div>
            <nav aria-label="모바일 주요 메뉴">
              {navItems.map((item) => (
                <a
                  href="#categories"
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    setMobileOpen(false);
                  }}
                >
                  {item} <CaretRight />
                </a>
              ))}
            </nav>
            <button className="button button-primary drawer-cta" type="button" onClick={() => {
              setMobileOpen(false);
              openConsult();
            }}>
              <ChatsCircle weight="fill" /> 맞춤 여행 상담
            </button>
          </aside>
        </div>
      )}

      <section className="hero" id="top">
        <Image
          src="/images/hero-vietnam-coast.webp"
          alt="베트남 해안과 도시 풍경"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="shell hero-inner" id="main-content">
          <p className="eyebrow">VIETNAM TRAVEL</p>
          <h1>
            베트남 여행의
            <br />
            모든 순간을<span className="mobile-break"><br /></span> 한곳에서
          </h1>
          <p className="hero-copy">특별한 여행이 일상이 되는 곳, 베트남원과 함께하세요.</p>
          <div className="hero-buttons">
            <button className="button button-primary" type="button" onClick={openConsult}>
              <ChatsCircle size={24} weight="fill" /> 맞춤 여행 상담 <ArrowRight />
            </button>
            <a className="button button-secondary" href="#categories">
              인기 상품 보기 <ArrowRight />
            </a>
          </div>
        </div>
        <div className="hero-signature" aria-hidden="true">
          <span>More Than a Trip</span>
          <small>당신의 특별한 베트남</small>
        </div>
      </section>

      <section className="discover-section" id="categories">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow gold">DISCOVER VIETNAM</p>
            <h2>베트남을 가장 특별하게 즐기는 방법</h2>
            <p>여행의 모든 순간, 베트남원이 함께합니다.</p>
          </div>

          {searched && (
            <div className="search-status" role="status">
              <span>
                {query ? `“${query}” 검색 결과 ${filteredCategories.length}개` : "전체 여행 카테고리"}
              </span>
              {query && (
                <button type="button" onClick={() => {
                  setQuery("");
                  setSearched(false);
                }}>
                  검색 초기화 <X />
                </button>
              )}
            </div>
          )}

          {filteredCategories.length ? (
            <div className="category-grid">
              {filteredCategories.map((category) => (
                <button
                  className="category-card"
                  type="button"
                  key={category.title}
                  onClick={() => setSelected(category)}
                  aria-label={`${category.title} 자세히 보기`}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectPosition: category.position }}
                  />
                  <span className="card-overlay" />
                  <span className="card-copy">
                    <strong>{category.title}</strong>
                    <small>{category.subtitle}</small>
                  </span>
                  <span className="card-arrow">
                    <CaretRight weight="bold" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <MagnifyingGlass size={40} />
              <h3>검색 결과가 없어요</h3>
              <p>카지노, 호텔, 골프 같은 여행 키워드로 다시 찾아보세요.</p>
              <button type="button" className="text-button" onClick={() => {
                setQuery("");
                setSearched(false);
              }}>
                전체 카테고리 보기
              </button>
            </div>
          )}

          <div className="trust-strip">
            <div>
              <ShieldCheck weight="duotone" />
              <span><strong>신뢰할 수 있는 현지 파트너</strong><small>검증된 현지 네트워크</small></span>
            </div>
            <div>
              <Headset weight="duotone" />
              <span><strong>전문 상담 컨시어지</strong><small>1:1 맞춤 상담 서비스</small></span>
            </div>
            <div>
              <Diamond weight="duotone" />
              <span><strong>다양한 프리미엄 상품</strong><small>항공 · 호텔 · 투어 · 골프까지</small></span>
            </div>
            <div>
              <UsersThree weight="duotone" />
              <span><strong>실제 이용자들의 후기</strong><small>믿을 수 있는 생생한 경험</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="consult-banner" id="consult">
        <Image src="/images/consult-halong.webp" alt="하롱베이 풍경" fill sizes="100vw" />
        <div className="consult-shade" />
        <div className="shell consult-content">
          <div>
            <p className="script-line">Vietnam, A Special Journey</p>
            <h2>평범한 여행이 아닌, 특별한 경험이 시작됩니다.</h2>
            <p>베트남원과 함께, 잊지 못할 여행을 만들어보세요.</p>
          </div>
          <button className="button button-outline" type="button" onClick={openConsult}>
            지금 상담하기 <ArrowRight />
          </button>
        </div>
      </section>

      <section className="review-section">
        <div className="shell review-grid">
          <div>
            <p className="eyebrow gold">TRAVEL WITH CONFIDENCE</p>
            <h2>처음부터 마지막까지<br />든든한 베트남 여행</h2>
          </div>
          <blockquote>
            <div className="stars" aria-label="별점 5점">
              {[0, 1, 2, 3, 4].map((star) => <Star key={star} weight="fill" />)}
            </div>
            <p>“가족 일정에 맞게 숙소와 이동을 세심하게 잡아줘서 여행 내내 편했어요.”</p>
            <cite>다낭 가족여행 · 김○현 님</cite>
          </blockquote>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-content">
          <div>
            <a className="brand footer-brand" href="#top">
              <Island weight="duotone" /> <span>베트남원</span>
            </a>
            <p>여행의 모든 순간을 더 특별하게 만드는 베트남 여행 파트너</p>
          </div>
          <div className="footer-links">
            <a href="#categories">여행 카테고리</a>
            <button type="button" onClick={openConsult}>맞춤 상담</button>
            <a href="#top">맨 위로</a>
          </div>
          <small>© 2026 Vietnamwon. All rights reserved.</small>
        </div>
      </footer>

      <button className="floating-chat" type="button" onClick={openConsult} aria-label="카카오톡 상담 열기">
        <ChatsCircle weight="fill" />
        <span>카카오톡 상담</span>
      </button>

      {selected && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
          <button className="modal-backdrop" aria-label="상세 정보 닫기" onClick={() => setSelected(null)} />
          <section className="category-modal">
            <button ref={closeButtonRef} className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="닫기">
              <X />
            </button>
            <div className="modal-image">
              <Image src={selected.image} alt={`${selected.title} 이미지`} fill sizes="(max-width: 760px) 100vw, 460px" />
            </div>
            <div className="modal-copy">
              <p className="eyebrow gold">{selected.english}</p>
              <h2 id="category-modal-title">{selected.title}</h2>
              <p>{selected.description}</p>
              <ul>
                <li><CheckCircle weight="fill" /> 일정과 예산에 맞춘 1:1 추천</li>
                <li><CheckCircle weight="fill" /> 현지 이동과 예약까지 한 번에</li>
              </ul>
              <button className="button button-primary" type="button" onClick={() => {
                setSelected(null);
                openConsult();
              }}>
                이 여행 상담하기 <ArrowRight />
              </button>
            </div>
          </section>
        </div>
      )}

      {consultOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="consult-modal-title">
          <button className="modal-backdrop" aria-label="상담 창 닫기" onClick={() => setConsultOpen(false)} />
          <section className="consult-modal">
            <button ref={closeButtonRef} className="modal-close" type="button" onClick={() => setConsultOpen(false)} aria-label="닫기">
              <X />
            </button>
            {submitted ? (
              <div className="success-state" role="status">
                <CheckCircle weight="fill" />
                <p className="eyebrow gold">REQUEST RECEIVED</p>
                <h2 id="consult-modal-title">상담 요청이 접수됐어요</h2>
                <p>남겨주신 여행 내용을 확인한 뒤 빠르게 연락드리겠습니다.</p>
                <button className="button button-primary" type="button" onClick={() => setConsultOpen(false)}>
                  확인
                </button>
              </div>
            ) : (
              <form className="consult-form" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}>
                <p className="eyebrow gold">1:1 TRAVEL CONCIERGE</p>
                <h2 id="consult-modal-title">맞춤 여행 상담</h2>
                <p>여행 계획을 남겨주시면 전문 상담사가 일정과 예산에 맞춰 안내해 드립니다.</p>
                <div className="form-grid">
                  <label>
                    이름
                    <input name="name" autoComplete="name" required placeholder="이름을 입력해주세요" />
                  </label>
                  <label>
                    연락처
                    <input name="tel" type="tel" autoComplete="tel" required placeholder="010-0000-0000" />
                  </label>
                  <label className="form-wide">
                    관심 지역
                    <select name="destination" defaultValue="">
                      <option value="" disabled>지역을 선택해주세요</option>
                      <option>다낭</option>
                      <option>나트랑</option>
                      <option>호치민</option>
                      <option>하노이</option>
                      <option>푸꾸옥</option>
                    </select>
                  </label>
                  <label className="form-wide">
                    여행 계획
                    <textarea name="message" rows={4} placeholder="인원, 일정, 관심 상품을 자유롭게 적어주세요" />
                  </label>
                </div>
                <label className="privacy-check">
                  <input type="checkbox" required />
                  <span>상담을 위한 개인정보 수집 및 이용에 동의합니다.</span>
                </label>
                <button className="button button-primary form-submit" type="submit">
                  상담 요청 보내기 <ArrowRight />
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
