import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "베트남원 | 베트남 카지노 VIP 컨시어지",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
    url: "/",
    title: "베트남원 | 베트남 카지노 VIP 컨시어지",
    description: SITE_DESCRIPTION,
  },
  verification: {
    other: { "naver-site-verification": "44008c8e97b16e38a109bcaab187e7100e08ec91" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
