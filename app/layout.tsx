import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "베트남원 | 베트남 카지노 VIP 컨시어지",
  description:
    "나트랑·다낭·하노이 카지노부터 밤문화, 골프, 호텔, 전용 차량까지. 카카오톡과 텔레그램으로 바로 상담하세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
