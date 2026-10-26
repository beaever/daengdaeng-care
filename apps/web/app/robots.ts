import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/content';

// robots.txt 자동 생성 — 전체 허용 + 사이트맵 위치 안내.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
