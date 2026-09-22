import Image from "next/image";
import Link from "next/link";

export function PageFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src="/images/one-agency-logo.png" alt="ONE AGENCY" width={174} height={149} />
        </div>
        <div className="footer-links">
          <Link href="/#services">서비스</Link>
          <Link href="/casino">카지노 안내</Link>
          <Link href="/travel-tip">여행 TIP</Link>
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
