import type { Metadata, Viewport } from 'next';
import { light } from '@daengdaeng/tokens';
import { buildTokensCss } from '../lib/tokens-css';
import './globals.css';

export const metadata: Metadata = {
  title: '댕댕케어 — 우리 아이 건강, 이 앱 하나로 안심',
  description:
    '음식 판별·사료 분석·증상 체크·병원 찾기·건강 기록. 반려견의 매일 궁금증을 3초 만에 해결하는 건강 관리 앱.',
  openGraph: {
    title: '댕댕케어 — 우리 아이 건강, 이 앱 하나로 안심',
    description: '반려견의 매일 궁금증을 3초 만에. 음식·증상·병원·기록을 한 앱에서.',
    type: 'website',
    locale: 'ko_KR',
  },
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
