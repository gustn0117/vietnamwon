"use client";

import Image from "next/image";
import Link from "next/link";
import { CaretDown, CaretRight, List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { ContactButtons, ContactLinks } from "@/components/ContactButtons";
import type { Contact } from "@/lib/site";

export type NavItem = {
  key: string;
  name: string;
  href: string;
  children: { key: string; name: string; href: string }[];
};

type Props = {
  items: NavItem[];
  contact: Contact;
  utilityText: string;
};

export function PageHeader({ items, contact, utilityText }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>{utilityText}</span>
          <div>
            <ContactLinks contact={contact} />
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
            {items.map((item) => (
              <div className="nav-item" key={item.key}>
                <Link href={item.href}>
                  {item.name}
                  {item.children.length > 0 && <CaretDown aria-hidden="true" />}
                </Link>
                {item.children.length > 0 && (
                  <div className="nav-sub">
                    {item.children.map((child) => (
                      <Link key={child.key} href={child.href}>{child.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="header-actions">
            <ContactButtons contact={contact} className="contact-buttons header-contact" />
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
              {items.map((item) => (
                <div key={item.key}>
                  {item.children.length > 0 ? (
                    <button
                      type="button"
                      aria-expanded={openMenu === item.key}
                      onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                    >
                      {item.name} <CaretDown className={openMenu === item.key ? "is-open" : ""} />
                    </button>
                  ) : (
                    <Link href={item.href} onClick={() => setMobileOpen(false)}>{item.name} <CaretRight /></Link>
                  )}
                  {item.children.length > 0 && openMenu === item.key && (
                    <div className="drawer-subs">
                      <Link className="drawer-sub" href={item.href} onClick={() => setMobileOpen(false)}>
                        {item.name} 전체 <CaretRight />
                      </Link>
                      {item.children.map((child) => (
                        <Link className="drawer-sub" key={child.key} href={child.href} onClick={() => setMobileOpen(false)}>
                          {child.name} <CaretRight />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <ContactButtons contact={contact} className="contact-buttons drawer-contact" onClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
