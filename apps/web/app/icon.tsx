import { ImageResponse } from 'next/og';
import { light } from '@daengdaeng/tokens';

// 동적 favicon/PWA 아이콘 — 발바닥 글리프 on 브랜드 배경.
// 색은 토큰 단일 출처(@daengdaeng/tokens)에서만 가져온다 (RULES 2).
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: light.brand,
          color: light.onBrand,
          fontSize: 320,
        }}
      >
        🐾
      </div>
    ),
    size,
  );
}
