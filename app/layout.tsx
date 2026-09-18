import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "베트남원 | ONE AGENCY VIP 컨시어지",
  description:
    "베트남 카지노, 밤문화, VIP 에스코트, 전용 차량과 프라이빗 여행 상담을 한곳에서 만나보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
