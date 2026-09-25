import Image from "next/image";
import Link from "next/link";
import { PageHeader, type NavBoard } from "@/components/PageHeader";
import { boardHref, contactLinks, type SiteData } from "@/lib/site";

export function navBoards(site: SiteData) {
  const toNav = (grp: "casino" | "main"): NavBoard[] =>
    site.boards
      .filter((board) => board.grp === grp)
      .map((board) => ({ slug: board.slug, name: board.name, heading: board.heading, href: boardHref(board) }));
  return { casinoBoards: toNav("casino"), mainBoards: toNav("main") };
}

export function SiteHeader({ site }: { site: SiteData }) {
  const { casinoBoards, mainBoards } = navBoards(site);
  return (
    <PageHeader
      casinoBoards={casinoBoards}
      mainBoards={mainBoards}
      contact={contactLinks(site.settings)}
      utilityText={site.settings.utility_text ?? ""}
    />
  );
}

export function SiteFooter({ site }: { site: SiteData }) {
  const tip = site.boards.find((board) => board.slug === "travel-tip");
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/one-agency-logo.png" alt="ONE AGENCY" width={174} height={149} />
        </div>
        <div className="footer-links">
          <Link href="/#services">서비스</Link>
          <Link href="/casino">카지노 안내</Link>
          {tip && <Link href={boardHref(tip)}>{tip.name}</Link>}
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
