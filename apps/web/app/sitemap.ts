import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/content';

// sitemap.xml 자동 생성 — 단일 페이지 랜딩이라 루트만 등록.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
