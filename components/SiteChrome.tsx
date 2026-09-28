import Image from "next/image";
import Link from "next/link";
import { PageHeader, type NavItem } from "@/components/PageHeader";
import { boardHref, childrenOf, contactLinks, topBoards, type SiteData } from "@/lib/site";

export function navItems(site: SiteData): NavItem[] {
  return topBoards(site.boards)
    .filter((board) => board.menu_show)
    .map((board) => ({
      key: board.slug,
      name: board.name,
      href: boardHref(board, site.boards),
      children: childrenOf(site.boards, board.slug)
        .filter((child) => child.menu_show)
        .map((child) => ({
          key: child.slug,
          name: child.heading,
          href: boardHref(child, site.boards),
        })),
    }));
}

export function SiteHeader({ site }: { site: SiteData }) {
  return (
    <PageHeader
      items={navItems(site)}
      contact={contactLinks(site.settings)}
      utilityText={site.settings.utility_text ?? ""}
    />
  );
}

function partnerLogos(settings: SiteData["settings"]) {
  try {
    const parsed = JSON.parse(settings.partner_logos ?? "[]");
    return Array.isArray(parsed) ? (parsed as string[]).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function SiteFooter({ site }: { site: SiteData }) {
  const logos = partnerLogos(site.settings);
  const links = topBoards(site.boards).filter((board) => board.menu_show).slice(0, 4);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        {logos.length > 0 && (
          <div className="footer-partners">
            <h2>{site.settings.partners_title || "제휴 업체"}</h2>
            <div className="partner-grid">
              {logos.map((logo) => (
                <span className="partner-logo" key={logo}>
                  <Image src={logo} alt="" width={160} height={160} sizes="160px" />
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="footer-links">
          {links.map((board) => (
            <Link key={board.slug} href={boardHref(board, site.boards)}>{board.name}</Link>
          ))}
        </div>
        <div className="footer-legal">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>© 2026 ONE AGENCY</span>
        </div>
      </div>
    </footer>
  );
}
