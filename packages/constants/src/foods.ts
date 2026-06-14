import type { SafetyLevel } from '@daengdaeng/tokens';

export interface FoodEntry {
  name: string;
  level: SafetyLevel;
  reason: string;
  serve?: string;
  ingredient?: string;
  symptoms?: string[];
  nutrition?: string[];
  related?: string[];
  aliases?: string[];
}

export const FOODS: Record<string, FoodEntry> = {
  포도: {
    name: '포도', level: 'danger',
    reason: '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있어요. 아주 적은 양도 위험합니다.',
    ingredient: '타르타르산(추정)',
    symptoms: ['구토, 설사', '무기력함', '소변량 감소'],
    related: ['건포도', '포도주스', '포도씨유'],
    aliases: ['grape', '건포도', '포도주스'],
  },
  초콜릿: {
    name: '초콜릿', level: 'danger',
    reason: '테오브로민 성분이 강아지 심장과 신경계에 독성을 일으켜요. 다크초콜릿일수록 더 위험합니다.',
    ingredient: '테오브로민',
    symptoms: ['구토, 설사', '심박수 증가', '발작'],
    related: ['카카오', '코코아 파우더', '커피'],
    aliases: ['chocolate', '다크초콜릿', '카카오'],
  },
  양파: {
    name: '양파', level: 'danger',
    reason: '양파·마늘은 적혈구를 파괴해 빈혈을 유발해요. 익혀도 독성이 사라지지 않습니다.',
    ingredient: '티오설페이트',
    symptoms: ['기력 저하', '잇몸 창백', '호흡 가빠짐'],
    related: ['마늘', '대파', '부추'],
    aliases: ['onion', 'onions', '마늘', 'garlic'],
  },
  자일리톨: {
    name: '자일리톨', level: 'danger',
    reason: '자일리톨은 강아지에게 저혈당 및 간부전을 유발할 수 있어요. 무설탕 껌·사탕에 주의하세요.',
    ingredient: '자일리톨',
    symptoms: ['구토', '무기력함', '발작', '황달'],
    related: ['무설탕 껌', '땅콩버터(자일리톨 함유)'],
    aliases: ['xylitol'],
  },
  마카다미아: {
    name: '마카다미아', level: 'danger',
    reason: '마카다미아 견과는 강아지 근육·신경계에 독성을 일으켜요.',
    ingredient: '미확인 독성 성분',
    symptoms: ['무기력함', '발열', '구토', '떨림'],
    related: ['혼합 견과류'],
    aliases: ['macadamia'],
  },
  아보카도: {
    name: '아보카도', level: 'danger',
    reason: '아보카도의 퍼신(persin) 성분이 구토·설사를 일으키고 심장 독성이 있어요.',
    ingredient: '퍼신(Persin)',
    symptoms: ['구토', '설사', '호흡곤란'],
    related: ['과카몰리'],
    aliases: ['avocado'],
  },
  커피: {
    name: '커피', level: 'danger',
    reason: '카페인은 강아지 심장과 신경계에 강한 독성을 가져요. 소량도 위험합니다.',
    ingredient: '카페인',
    symptoms: ['과호흡', '심박수 증가', '발작'],
    related: ['녹차', '에너지드링크', '콜라'],
    aliases: ['coffee', '카페인', 'caffeine'],
  },
  치즈: {
    name: '치즈', level: 'caution',
    reason: '소량은 괜찮지만 유당과 지방이 많아요. 많이 주면 소화불량이나 췌장염 위험이 있습니다.',
    ingredient: '유당 · 지방',
    symptoms: ['묽은 변', '복부 불편감'],
    related: ['우유', '버터', '생크림'],
    serve: '무염·저지방으로 아주 소량만. 처음엔 손톱만큼 주고 반응을 살펴보세요.',
    aliases: ['cheese'],
  },
  수박: {
    name: '수박', level: 'caution',
    reason: '과육은 수분이 많아 좋지만 씨와 껍질은 꼭 제거하세요. 씨는 장폐색 위험이 있어요.',
    ingredient: '씨 · 껍질',
    symptoms: ['(씨 섭취 시) 구토', '변비'],
    related: ['멜론', '참외'],
    serve: '씨·껍질을 빼고 과육만 한입 크기로. 당이 높으니 간식으로 조금만.',
    aliases: ['watermelon'],
  },
  우유: {
    name: '우유', level: 'caution',
    reason: '강아지는 유당불내증이 많아요. 소량은 괜찮지만 많이 마시면 설사할 수 있어요.',
    serve: '반드시 소량만. 유당 제거 제품이 더 안전합니다.',
    symptoms: ['설사', '복부 팽만'],
    related: ['요거트', '아이스크림'],
    aliases: ['milk'],
  },
  당근: {
    name: '당근', level: 'safe',
    reason: '저칼로리에 식이섬유가 풍부해요. 치아 건강에도 좋은 안전한 간식입니다.',
    serve: '생으로도, 익혀서도 OK. 목에 걸리지 않게 작게 잘라 주세요.',
    nutrition: ['베타카로틴', '식이섬유', '비타민 A', '비타민 K'],
    related: ['고구마', '브로콜리', '호박'],
    aliases: ['carrot'],
  },
  닭고기: {
    name: '닭고기', level: 'safe',
    reason: '대표적인 양질의 단백질 공급원이에요. 강아지가 가장 좋아하는 안전 식품 중 하나입니다.',
    serve: '반드시 익혀서 뼈를 발라내고 주세요. 양념·소금은 절대 금물이에요.',
    nutrition: ['단백질', '비타민 B군', '셀레늄'],
    related: ['소고기', '오리고기', '흰살생선'],
    aliases: ['chicken', '삶은 닭', '닭'],
  },
  사과: {
    name: '사과', level: 'safe',
    reason: '비타민과 식이섬유가 풍부한 건강 간식이에요. 단, 씨에는 소량의 독성이 있어요.',
    serve: '씨와 심을 제거하고 껍질째 한입 크기로. 차갑게 주면 더 좋아해요.',
    nutrition: ['비타민 C', '식이섬유', '칼륨'],
    related: ['배', '블루베리'],
    aliases: ['apple'],
  },
  고구마: {
    name: '고구마', level: 'safe',
    reason: '식이섬유와 비타민이 풍부한 간식이에요. 혈당 조절에도 좋아요.',
    serve: '반드시 익혀서 주세요. 껍질은 제거하는 게 좋아요.',
    nutrition: ['식이섬유', '비타민 A', '칼륨', '베타카로틴'],
    related: ['단호박', '당근'],
    aliases: ['sweet potato', '고구마'],
  },
  블루베리: {
    name: '블루베리', level: 'safe',
    reason: '항산화 성분이 풍부한 슈퍼푸드예요. 강아지에게 안전한 간식입니다.',
    serve: '한 번에 5~10알 정도, 신선한 것으로 주세요.',
    nutrition: ['항산화 물질', '비타민 C', '식이섬유'],
    related: ['딸기', '라즈베리'],
    aliases: ['blueberry'],
  },
  브로콜리: {
    name: '브로콜리', level: 'safe',
    reason: '비타민 C와 식이섬유가 풍부해요. 과하면 소화장애가 생길 수 있으니 소량만 주세요.',
    serve: '살짝 쪄서 주거나 생으로 작게 잘라서. 전체 식사의 10% 이내로.',
    nutrition: ['비타민 C', '비타민 K', '식이섬유', '칼슘'],
    related: ['당근', '콜리플라워'],
    aliases: ['broccoli'],
  },
};

export const POPULAR_FOODS = ['포도', '초콜릿', '사과', '닭고기', '당근', '수박'];

export function searchFood(query: string): FoodEntry | null {
  const q = query.trim().toLowerCase();
  const direct = FOODS[q] ?? FOODS[Object.keys(FOODS).find((k) => k === q) ?? ''];
  if (direct) return direct;

  return (
    Object.values(FOODS).find((f) =>
      f.name.toLowerCase().includes(q) ||
      f.aliases?.some((a) => a.toLowerCase().includes(q))
    ) ?? null
  );
}
