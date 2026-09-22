"use client";

import Image from "next/image";
import Link from "next/link";
import { CaretDown, CaretRight, List, X } from "@phosphor-icons/react";
import { ContactButtons, ContactLinks } from "@/components/ContactButtons";
import { useState } from "react";
import { casinoCities } from "@/lib/casino";

const sections = [
  { title: "밤문화", href: "/#services" },
  { title: "골프", href: "/#services" },
  { title: "호텔", href: "/#services" },
  { title: "차량", href: "/#services" },
  { title: "여행 TIP", href: "/#experience" },
];

export function PageHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [casinoOpen, setCasinoOpen] = useState(false);

  return (
    <>
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
          <Link className="brand" href="/" aria-label="ONE AGENCY 홈">
            <Image src="/images/one-agency-logo.png" alt="ONE AGENCY Casino Marketing & VIP Services" width={174} height={149} priority />
          </Link>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <div className="nav-item">
              <Link href="/casino">카지노 <CaretDown aria-hidden="true" /></Link>
              <div className="nav-sub">
                {casinoCities.map((city) => (
                  <Link key={city.slug} href={`/casino/${city.slug}`}>{city.heading}</Link>
                ))}
              </div>
            </div>
            {sections.map((item) => (
              <div className="nav-item" key={item.title}>
                <Link href={item.href}>{item.title}</Link>
              </div>
            ))}
          </nav>
          <div className="header-actions">
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
              <div>
                <button type="button" aria-expanded={casinoOpen} onClick={() => setCasinoOpen((open) => !open)}>
                  카지노 <CaretDown className={casinoOpen ? "is-open" : ""} />
                </button>
                {casinoOpen && (
                  <div className="drawer-subs">
                    <Link className="drawer-sub" href="/casino" onClick={() => setMobileOpen(false)}>카지노 전체 <CaretRight /></Link>
                    {casinoCities.map((city) => (
                      <Link className="drawer-sub" key={city.slug} href={`/casino/${city.slug}`} onClick={() => setMobileOpen(false)}>
                        {city.heading} <CaretRight />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {sections.map((item) => (
                <div key={item.title}>
                  <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.title} <CaretRight /></Link>
                </div>
              ))}
            </nav>
            <ContactButtons className="contact-buttons drawer-contact" onClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
