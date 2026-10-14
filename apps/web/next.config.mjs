/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 정적 HTML 로 내보내 Cloudflare Pages 에 그대로 올린다 (빌드 출력: out/)
  output: 'export',
  // 토큰 패키지를 TS 소스 그대로 트랜스파일 — CSS 변수 생성에 사용 (RULES 2: 토큰 단일 출처)
  transpilePackages: ['@daengdaeng/tokens'],
  // lint 는 별도 turbo task(eslint flat config)로 수행 — 빌드 내부 lint 비활성화
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
