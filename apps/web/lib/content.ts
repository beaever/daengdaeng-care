// 댕댕케어 랜딩 콘텐츠 — store.jsx 의 5개 기능 카피를 그대로 따름.
// 각 기능의 배경 토큰(bg)은 CSS 변수명만 지정 (RULES 2).

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
    emoji: '📋',
    title: '사료 성분, 믿고 골라요',
    desc: '성분표를 분석해 등급으로 보여드려요. 알레르기 유발 성분도 미리 짚어드립니다.',
    tint: 'var(--surface-2)',
  },
  {
    emoji: '🩺',
    title: '병원 가야 할까? 증상 넣으면 알려줘요',
    desc: '몇 가지 질문에 답하면 지금 필요한 행동까지 안내해요. 응급 상황은 바로 병원으로.',
    tint: 'var(--info-soft)',
  },
  {
    emoji: '🏥',
    title: '급할 때, 가까운 24시 병원을 한눈에',
    desc: '진료중 여부·거리·전화까지. 가장 가까운 동물병원을 빠르게 찾아드려요.',
    tint: 'var(--safe-soft)',
  },
  {
    emoji: '📒',
    title: '접종·체중·병원 기록 한 곳에 차곡차곡',
    desc: '우리 아이 건강 다이어리. 다음 예방접종일도 잊지 않게 챙겨드려요.',
    tint: 'var(--surface-2)',
  },
];

/** 신뢰 지표 (데모 수치) */
export const stats: { value: string; label: string }[] = [
  { value: '3초', label: '음식 안전도 확인' },
  { value: '5가지', label: '핵심 건강 기능' },
  { value: '24시', label: '응급 병원 탐색' },
];
