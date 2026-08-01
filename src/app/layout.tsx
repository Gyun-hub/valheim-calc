import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { LocaleProvider } from "@/components/ui/LocaleProvider";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";

import "./globals.css";

// 배포 도메인 확정 전 임시값. .env.example 참고
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valheim-calc.pages.dev";

// 표제용 한글 세리프. 세로 강세가 강해 돌에 새긴 글자처럼 읽힌다.
// 나눔명조는 한국 웹의 기본값이라 의도적으로 피했다.
const display = Gowun_Batang({
  variable: "--font-display-stack",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// 본문. 한글·라틴 자소 폭이 고르고 작은 크기에서 버틴다
const body = IBM_Plex_Sans_KR({
  variable: "--font-sans-stack",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// 수치 전용. 본문과 같은 가족이라 섞여도 어긋나지 않는다
const mono = IBM_Plex_Mono({
  variable: "--font-mono-stack",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = {
  default: "발헤임 계산기 · 데이터베이스",
  template: "%s | 발헤임 계산기",
};
const description =
  "발헤임(Valheim) 한국어 계산기와 데이터베이스. 제작 자원 역산, 음식 조합, 드롭률 확률 계산.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "발헤임 계산기",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  // 비공식 팬 프로젝트 고지 (docs/LEGAL.md)
  other: {
    "fan-project": "Unofficial Valheim fan project. Not affiliated with Iron Gate AB.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LocaleProvider>
          <SiteHeader />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">{children}</main>
          <SiteFooter />
        </LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
