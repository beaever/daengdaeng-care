import type { MetadataRoute } from 'next';
import { light } from '@daengdaeng/tokens';
import { site } from '../lib/content';

// PWA manifest — 색은 토큰 단일 출처(@daengdaeng/tokens)에서만 가져온다 (RULES 2).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: light.bg,
    theme_color: light.brand,
    icons: [{ src: '/icon', sizes: '512x512', type: 'image/png' }],
  };
}
