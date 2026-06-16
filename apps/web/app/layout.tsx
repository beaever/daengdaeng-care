import type { Metadata, Viewport } from 'next';
import { light } from '@daengdaeng/tokens';
import { buildTokensCss } from '../lib/tokens-css';
import { site, siteUrl } from '../lib/content';
import './globals.css';

// 메타/SEO 단일 출처는 lib/content 의 site·siteUrl. og:image·favicon 은
// app/opengraph-image.tsx, app/icon.tsx 파일 컨벤션으로 Next 가 자동 주입한다.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  keywords: ['반려견', '강아지 건강', '음식 판별', '사료 분석', '증상 체크', '동물병원', '건강 기록'],
  alternates: { canonical: '/' },
  openGraph: {
    title: site.title,
    description: site.ogDescription,
    url: '/',
    siteName: site.name,
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.ogDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: light.brand, // 토큰 단일 출처 (RULES 2)
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* SUIT — 토큰 fontFamily 의 1순위 폰트 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css"
        />
        {/* 토큰을 CSS 변수로 주입 — 단일 출처(@daengdaeng/tokens) (RULES 2) */}
        <style dangerouslySetInnerHTML={{ __html: buildTokensCss() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
