import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "베트남원 | 베트남 여행의 모든 순간",
  description:
    "베트남 여행, 호텔, 골프, 레저와 맞춤 상담을 한곳에서 만나보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
