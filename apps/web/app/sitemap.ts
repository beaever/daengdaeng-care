import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/content';

// sitemap.xml 자동 생성 — 랜딩 + 문서 페이지.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/support`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
