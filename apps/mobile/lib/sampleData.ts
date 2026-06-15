// 댕댕케어 — 데모 샘플 데이터 (Korean).
// 실제 데이터 연동 전까지 화면 조립에 사용. 기능 PR이 진행되며 항목이 추가됨.

import type { SafetyLevel, GradeLevel } from '@daengdaeng/tokens';

export interface Pet {
  name: string;
  breed: string;
  age: string;
  sex: string;
  neutered: string;
  weight: string;
  /** 다음 예방접종까지 남은 일수 */
  nextVaccineDays: number;
  /** 최근 병원 방문 (상대 표기) */
  lastVisit: string;
}

export const pet: Pet = {
  name: '뭉치',
  breed: '말티즈',
  age: '2살',
  sex: '남아',
  neutered: '완료',
  weight: '3.2kg',
  nextVaccineDays: 15,
  lastVisit: '3주 전',
};

// ── 음식 안전도 DB (SCR-005·006) ─────────────────────────────────────
export interface Food {
  name: string;
  level: SafetyLevel;
  /** 판정 이유 */
  reason: string;
  /** 위험·주의 원인 성분 */
  ingredient?: string;
  /** 먹었을 때 증상 (danger·caution) */
  symptoms?: string[];
  /** 안전 급여 가이드 (safe·caution) */
  serve?: string;
  /** 영양 정보 (safe) */
  nutrition?: string[];
  /** 연관 음식 */
  related?: string[];
}

export const foods: Record<string, Food> = {
  포도: {
    name: '포도',
    level: 'danger',
    reason: '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있어요. 아주 적은 양도 위험합니다.',
    ingredient: '타르타르산(추정)',
    symptoms: ['구토, 설사', '무기력함', '소변량 감소'],
    related: ['건포도', '포도주스', '포도씨유'],
  },
  초콜릿: {
    name: '초콜릿',
    level: 'danger',
    reason: '테오브로민 성분이 강아지 심장과 신경계에 독성을 일으켜요. 다크초콜릿일수록 더 위험합니다.',
    ingredient: '테오브로민',
    symptoms: ['구토, 설사', '심장 빠른 박동', '발작'],
    related: ['카카오', '코코아 파우더', '커피'],
  },
  양파: {
    name: '양파',
    level: 'danger',
    reason: '양파·마늘은 적혈구를 파괴해 빈혈을 유발해요. 익혀도 독성이 사라지지 않습니다.',
    ingredient: '티오설페이트',
    symptoms: ['기력 저하', '잇몸 창백', '호흡 가빠짐'],
    related: ['마늘', '대파', '부추'],
  },
  치즈: {
    name: '치즈',
    level: 'caution',
    reason: '소량은 괜찮지만 유당과 지방이 많아요. 많이 주면 소화불량이나 췌장염 위험이 있습니다.',
    ingredient: '유당 · 지방',
    symptoms: ['묽은 변', '복부 불편감'],
    related: ['우유', '버터', '생크림'],
    serve: '무염·저지방으로 아주 소량만. 처음엔 손톱만큼 주고 반응을 살펴보세요.',
  },
  수박: {
    name: '수박',
    level: 'caution',
    reason: '과육은 수분이 많아 좋지만 씨와 껍질은 꼭 제거하세요. 씨는 장폐색 위험이 있어요.',
    ingredient: '씨 · 껍질',
    symptoms: ['(씨 섭취 시) 구토', '변비'],
    related: ['멜론', '참외'],
    serve: '씨·껍질을 빼고 과육만 한입 크기로. 당이 높으니 간식으로 조금만.',
  },
  당근: {
    name: '당근',
    level: 'safe',
    reason: '저칼로리에 식이섬유가 풍부해요. 치아 건강에도 좋은 안전한 간식입니다.',
    serve: '생으로도, 익혀서도 OK. 목에 걸리지 않게 작게 잘라 주세요.',
    nutrition: ['베타카로틴', '식이섬유', '비타민 A', '비타민 K'],
    related: ['고구마', '브로콜리', '호박'],
  },
  닭고기: {
    name: '닭고기',
    level: 'safe',
    reason: '대표적인 양질의 단백질 공급원이에요. 강아지가 가장 좋아하는 안전 식품 중 하나입니다.',
    serve: '반드시 익혀서 뼈를 발라내고 주세요. 양념·소금은 절대 금물이에요.',
    nutrition: ['단백질', '비타민 B군', '셀레늄'],
    related: ['소고기', '오리고기', '흰살생선'],
  },
  사과: {
    name: '사과',
    level: 'safe',
    reason: '비타민과 식이섬유가 풍부한 건강 간식이에요. 단, 씨에는 소량의 독성이 있어요.',
    serve: '씨와 심을 제거하고 껍질째 한입 크기로. 차갑게 주면 더 좋아해요.',
    nutrition: ['비타민 C', '식이섬유', '칼륨'],
    related: ['배', '블루베리'],
  },
};

export const popularFoods = ['포도', '초콜릿', '사과', '닭고기', '당근', '수박'];
export const recentFoods = ['포도', '치즈', '당근'];

// ── 사료 성분 분석 (SCR-007·008) ─────────────────────────────────────
export interface Ingredient {
  rank: number;
  name: string;
  status: SafetyLevel;
}

export interface ProductWarning {
  name: string;
  status: SafetyLevel;
  note: string;
}

export interface Product {
  name: string;
  brand: string;
  grade: GradeLevel;
  gradeLabel: string;
  ingredients: Ingredient[];
  warnings: ProductWarning[];
}

export const product: Product = {
  name: '로얄캐닌 미니 어덜트',
  brand: 'Royal Canin',
  grade: 'B',
  gradeLabel: '괜찮은 사료예요',
  ingredients: [
    { rank: 1, name: '닭고기', status: 'safe' },
    { rank: 2, name: '쌀', status: 'safe' },
    { rank: 3, name: '옥수수 글루텐', status: 'caution' },
    { rank: 4, name: '동물성 지방', status: 'safe' },
    { rank: 5, name: '밀', status: 'caution' },
  ],
  warnings: [
    {
      name: '옥수수 글루텐',
      status: 'caution',
      note: '알레르기를 유발할 수 있어요. 피부 트러블이 잦다면 주의하세요.',
    },
  ],
};
