import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "관통 프로젝트",
  description: "SSAFY 1학기 관통 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
