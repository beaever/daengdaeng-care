// 댕댕케어 랜딩 콘텐츠 — store.jsx 의 5개 기능 카피를 그대로 따름.
// 각 기능의 배경 토큰(bg)은 CSS 변수명만 지정 (RULES 2).

/** 사이트 기준 URL — 도메인 구매 시 NEXT_PUBLIC_SITE_URL 로 덮어쓴다 (앱 settings.tsx 의 SITE_URL 도 함께). */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daengdaeng-care.vercel.app';

/** 고객 지원·개인정보 보호책임자 연락처 */
export const contactEmail = 'thebeaever@gmail.com';

/** 메타데이터 공통 카피 */
export const site = {
  name: '댕댕케어',
  title: '댕댕케어 — 우리 아이 건강, 이 앱 하나로 안심',
  description:
    '음식 판별·증상 체크·병원 찾기·건강 기록. 반려견의 매일 궁금증을 3초 만에 해결하는 건강 관리 앱.',
  ogDescription: '반려견의 매일 궁금증을 3초 만에. 음식·증상·병원·기록을 한 앱에서.',
} as const;

export interface Feature {
  emoji: string;
  title: string;
  desc: string;
  /** 카드 강조 배경 — CSS 변수 */
  tint: string;
}

export const features: Feature[] = [
  {
    emoji: '🍖',
    title: '이거 먹어도 돼? 검색하면 바로 답',
    desc: '포도·초콜릿·양파부터 사과·당근까지. 안전·주의·위험을 한눈에 알려드려요.',
    tint: 'var(--brand-soft)',
  },
  {
    emoji: '🩺',
    title: '병원 가야 할까? 증상 넣으면 알려줘요',
    desc: '몇 가지 질문에 답하면 지금 필요한 행동까지 안내해요. 응급 상황은 바로 병원으로.',
    tint: 'var(--info-soft)',
  },
  {
    emoji: '🏥',
    title: '급할 때, 가까운 동물병원을 한눈에',
    desc: '거리·주소·전화·길찾기까지. 가장 가까운 동물병원을 빠르게 찾아드려요.',
    tint: 'var(--safe-soft)',
  },
  {
    emoji: '📒',
    title: '접종·체중·병원 기록 한 곳에 차곡차곡',
    desc: '우리 아이 건강 다이어리. 다음 예방접종일도 잊지 않게 챙겨드려요.',
    tint: 'var(--surface-2)',
  },
];

/** 핵심 지표 */
export const stats: { value: string; label: string }[] = [
  { value: '3초', label: '음식 안전도 확인' },
  { value: '4가지', label: '핵심 건강 기능' },
  { value: '광고 0', label: '응급 상황도 방해 없이' },
];
