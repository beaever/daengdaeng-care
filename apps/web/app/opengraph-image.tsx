import { ImageResponse } from 'next/og';
import { light } from '@daengdaeng/tokens';
import { site } from '../lib/content';

// SNS 공유 썸네일(1200×630) — 색은 토큰 단일 출처에서만 가져온다 (RULES 2).
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: light.bg,
          color: light.text,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 44, color: light.brandText }}>
          <span style={{ fontSize: 64 }}>🐾</span>
          {site.name}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          <span>우리 아이 건강,</span>
          <span>이 앱 하나로 안심</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: light.text2 }}>
          음식 판별 · 사료 분석 · 증상 체크 · 병원 찾기 · 건강 기록
        </div>
      </div>
    ),
    size,
  );
}
