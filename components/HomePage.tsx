"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  Car,
  CaretDown,
  CaretRight,
  CheckCircle,
  Crown,
  Golf,
  Headset,
  List,
  LockKey,
  MagnifyingGlass,
  ShieldCheck,
  Spade,
  UsersThree,
  Wine,
  X,
} from "@phosphor-icons/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ContactButtons, ContactLinks, FloatingContact } from "@/components/ContactButtons";
import { casinoCities } from "@/lib/casino";

type Service = {
  title: string;
  english: string;
  subtitle: string;
  description: string;
  image?: string;
  icon: typeof Spade;
  position?: string;
  note?: string;
};

const services: Service[] = [
  {
    title: "카지노",
    english: "Premium Casino",
    subtitle: "프리미엄 게임 & 멤버십",
    description: "검증된 주요 카지노 안내부터 전용 이동, 멤버십 혜택까지 한 번에 준비합니다.",
    image: "/images/dark-casino.png",
    icon: Spade,
  },
  {
    title: "밤문화",
    english: "Nightlife",
    subtitle: "트렌디한 핫플레이스",
    description: "루프톱 라운지와 클럽, 프라이빗 룸까지 안전하고 세련되게 큐레이션합니다.",
    image: "/images/dark-nightlife.png",
    icon: Wine,
  },
  {
    title: "골프",
    english: "Golf",
    subtitle: "최고의 코스와 라운딩",
    description: "티오프 예약과 차량, 식사까지 흐름이 끊기지 않는 프리미엄 라운딩을 만듭니다.",
    image: "/images/dark-golf.png",
    icon: Golf,
  },
  {
    title: "호텔",
    english: "Hotel",
    subtitle: "프리미엄 숙박 서비스",
    description: "밤의 동선과 여행 목적에 맞는 검증된 호텔과 풀빌라를 제안합니다.",
    image: "/images/dark-hotel.png",
    icon: Buildings,
  },
  {
    title: "차량",
    english: "Private Transfer",
    subtitle: "안전하고 편안한 이동",
    description: "공항 픽업부터 전 일정까지 전문 기사가 프라이빗 차량으로 함께합니다.",
    image: "/images/dark-vehicle.png",
    icon: Car,
    position: "center 58%",
  },
];

const experiences: { service: Service; image: string; title: string; copy: string }[] = [
  { service: services[0], image: "/images/dark-casino.png", title: "프리미엄 카지노", copy: "검증된 카지노와 특별한 멤버십 혜택" },
  { service: services[1], image: "/images/dark-nightlife.png", title: "럭셔리 나이트라이프", copy: "베트남의 가장 핫한 순간을 당신답게" },
  { service: services[3], image: "/images/dark-private-vip.png", title: "프리미엄 호텔 & 풀빌라", copy: "밤의 동선에 맞춘 검증된 숙소" },
  { service: services[4], image: "/images/dark-vehicle.png", title: "프리미엄 차량 서비스", copy: "공항 픽업부터 전 일정 전용 차량" },
];

const navItems: { title: string; children?: { title: string; href: string }[] }[] = [
  { title: "카지노", children: casinoCities.map((city) => ({ title: city.heading, href: `/casino/${city.slug}` })) },
  { title: "밤문화" },
  { title: "골프" },
  { title: "호텔" },
  { title: "차량" },
];

export function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return services;
    return services.filter((service) =>
      `${service.title} ${service.english} ${service.subtitle} ${service.description}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  useEffect(() => {
    const modalOpen = Boolean(selected) || mobileOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    if (selected && closeButtonRef.current) closeButtonRef.current.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectByTitle = (title: string) => {
    const service = services.find((item) => item.title === title);
    if (service) setSelected(service);
  };

  return (
    <main>
      <a className="skip-link" href="#main-content">본문 바로가기</a>

      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>특별한 여행이 일상이 되는 곳, ONE AGENCY</span>
          <div>
            <ContactLinks />
            <i aria-hidden="true" />
            <span>한국어</span>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="ONE AGENCY 홈">
            <Image src="/images/one-agency-logo.png" alt="ONE AGENCY Casino Marketing & VIP Services" width={174} height={149} priority />
          </a>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {navItems.map((item) => (
              <div className="nav-item" key={item.title}>
                <button type="button" onClick={() => selectByTitle(item.title)}>
                  {item.title}
                  {item.children && <CaretDown aria-hidden="true" />}
                </button>
                {item.children && (
                  <div className="nav-sub">
                    {item.children.map((child) => (
                      <Link key={child.title} href={child.href}>{child.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="nav-item"><a href="#experience">여행 TIP</a></div>
          </nav>
          <div className="header-actions">
            <form className="header-search" role="search" onSubmit={handleSearch}>
              <MagnifyingGlass size={20} aria-hidden="true" />
              <label className="sr-only" htmlFor="site-search">서비스 검색</label>
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
            <ContactButtons className="contact-buttons header-contact" />
            <button type="button" className="menu-button" aria-label="메뉴 열기" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
              <List size={29} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="모바일 메뉴">
          <button className="drawer-backdrop" aria-label="메뉴 닫기" onClick={() => setMobileOpen(false)} />
          <aside className="mobile-drawer">
            <div className="drawer-heading">
              <Image src="/images/one-agency-logo.png" alt="ONE AGENCY" width={138} height={118} />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="메뉴 닫기"><X size={25} /></button>
            </div>
            <nav aria-label="모바일 주요 메뉴">
              {navItems.map((item) => (
                <div key={item.title}>
                  <button
                    type="button"
                    aria-expanded={item.children ? openMenu === item.title : undefined}
                    onClick={() => {
                      if (item.children) {
                        setOpenMenu(openMenu === item.title ? null : item.title);
                        return;
                      }
                      setMobileOpen(false);
                      selectByTitle(item.title);
                    }}
                  >
                    {item.title} {item.children ? <CaretDown className={openMenu === item.title ? "is-open" : ""} /> : <CaretRight />}
                  </button>
                  {item.children && openMenu === item.title && (
                    <div className="drawer-subs">
                      {item.children.map((child) => (
                        <Link className="drawer-sub" key={child.title} href={child.href} onClick={() => setMobileOpen(false)}>
                          {child.title} <CaretRight />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="#experience" onClick={() => setMobileOpen(false)}>여행 TIP <CaretRight /></a>
            </nav>
            <ContactButtons className="contact-buttons drawer-contact" onClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <section className="hero" id="top">
        <Image src="/images/dark-hero.png" alt="호치민 야경이 보이는 프리미엄 VIP 라운지" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="shell hero-inner" id="main-content">
          <h1>베트남 카지노<br /><em>가장 완벽하게</em></h1>
          <p className="hero-copy">검증된 현지 파트너와 함께하는 프라이빗 VIP 컨시어지</p>
          <ContactButtons className="contact-buttons hero-buttons" />
          <div className="hero-trust" aria-label="서비스 장점">
            <span><ShieldCheck /> 검증된 현지 파트너</span>
            <span><LockKey /> 프라이빗 & 안전한 진행</span>
            <span><Crown /> 1:1 맞춤 컨시어지</span>
          </div>
        </div>
        <div className="hero-signature" aria-hidden="true"><span>More Than a Trip</span><small>당신만을 위한, 특별한 베트남</small></div>
      </section>

      <section className="service-section" id="services">
        <div className="shell-wide">
          {searched && (
            <div className="search-status" role="status">
              <span>{query ? `“${query}” 검색 결과 ${filteredServices.length}개` : "전체 서비스"}</span>
              <button type="button" onClick={() => { setQuery(""); setSearched(false); }}>검색 초기화 <X /></button>
            </div>
          )}
          {filteredServices.length ? (
            <div className="service-grid">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <button className="service-card" type="button" key={service.title} onClick={() => setSelected(service)}>
                    {service.image ? (
                      <Image src={service.image} alt="" fill sizes="(max-width: 760px) 70vw, (max-width: 1080px) 34vw, 20vw" style={{ objectPosition: service.position }} />
                    ) : (
                      <span className="hatch" aria-hidden="true"><em>{service.note}</em></span>
                    )}
                    <span className="service-overlay" />
                    <span className="service-copy"><Icon weight="duotone" /><span><strong>{service.title}</strong><small>{service.subtitle}</small></span></span>
                    <span className="service-arrow"><ArrowRight /></span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <MagnifyingGlass size={48} color="var(--gold)" /><h2>검색 결과가 없습니다</h2><p>카지노, 밤문화, 호텔처럼 원하는 서비스를 검색해보세요.</p>
              <button type="button" onClick={() => { setQuery(""); setSearched(false); }}>전체 서비스 보기</button>
            </div>
          )}
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="shell">
          <div className="experience-heading">
            <h2>오늘 밤,<br />무엇을 원하시나요?</h2>
            <p>여행을 넘어, 잊지 못할 경험으로.<br />ONE AGENCY가 당신의 특별한 베트남을 완성합니다.</p>
            <a href="#services">모든 서비스 보기 <ArrowRight /></a>
          </div>
          <div className="experience-grid">
            {experiences.map((item) => (
              <button type="button" className="experience-card" key={item.title} onClick={() => setSelected(item.service)}>
                <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectPosition: item.service.position }} />
                <span className="experience-overlay" /><span><strong>{item.title}</strong><small>{item.copy}</small></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="promise-section">
        <div className="shell promise-grid">
          <div className="promise-intro"><h2>처음부터 마지막까지<br />오직 당신만을 위해</h2><p>현지에서 오래 쌓은 네트워크와 전담 컨시어지가 일정의 모든 순간을 세심하게 설계합니다.</p></div>
          <div className="promise-list">
            <article><ShieldCheck weight="duotone" /><div><strong>검증된 현지 파트너</strong><p>직접 확인한 장소와 서비스만 제안합니다.</p></div></article>
            <article><Headset weight="duotone" /><div><strong>24시간 전담 컨시어지</strong><p>낯선 순간에도 한국어로 빠르게 도와드립니다.</p></div></article>
            <article><LockKey weight="duotone" /><div><strong>철저한 프라이버시</strong><p>상담부터 현지 일정까지 조용하고 안전하게 진행합니다.</p></div></article>
            <article><UsersThree weight="duotone" /><div><strong>취향 중심 맞춤 설계</strong><p>인원과 예산, 원하는 분위기까지 세밀하게 반영합니다.</p></div></article>
          </div>
        </div>
      </section>

      <section className="consult-banner" id="consult">
        <Image src="/images/dark-vehicle.png" alt="프라이빗 차량과 VIP 서비스" fill sizes="100vw" />
        <div className="consult-shade" />
        <div className="shell consult-content">
          <div><h2>당신만의 특별한 밤을<br />지금 시작하세요.</h2><p>카카오톡이나 텔레그램으로 일정과 취향을 보내주시면 전담 컨시어지가 바로 답변드립니다.</p></div>
          <ContactButtons className="contact-buttons banner-contact" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand"><Image src="/images/one-agency-logo.png" alt="ONE AGENCY Casino Marketing & VIP Services" width={174} height={149} /></div>
          <div className="footer-links"><a href="#services">서비스</a><a href="#experience">ONE AGENCY 경험</a><ContactLinks /></div>
          <div className="footer-legal"><span>이용약관</span><span>개인정보처리방침</span><span>© 2026 ONE AGENCY</span></div>
        </div>
      </footer>

      <FloatingContact />

      {selected && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
          <button className="modal-backdrop" aria-label="상세 정보 닫기" onClick={() => setSelected(null)} />
          <section className="service-modal">
            <button ref={closeButtonRef} className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="닫기"><X /></button>
            <div className="modal-image">
              {selected.image ? (
                <Image src={selected.image} alt={`${selected.title} 이미지`} fill sizes="(max-width: 1080px) 100vw, 620px" />
              ) : (
                <span className="hatch"><em>{selected.note} 자리</em></span>
              )}
            </div>
            <div className="modal-copy">
              <h2 id="service-modal-title">{selected.title}</h2><p>{selected.description}</p>
              <ul><li><CheckCircle weight="fill" /> 일정과 예산에 맞춘 1:1 추천</li><li><CheckCircle weight="fill" /> 현지 이동과 예약까지 한 번에</li><li><CheckCircle weight="fill" /> 상담 내용과 일정은 철저히 비공개</li></ul>
              {selected.title === "카지노" && (
                <div className="modal-cities">
                  {casinoCities.map((city) => (
                    <Link key={city.slug} href={`/casino/${city.slug}`}>{city.heading} <ArrowRight /></Link>
                  ))}
                </div>
              )}
              <ContactButtons className="contact-buttons modal-contact" />
            </div>
          </section>
        </div>
      )}

    </main>
  );
}
