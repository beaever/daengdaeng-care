// 댕댕케어 — 데모 샘플 데이터 (Korean).
// 실제 데이터 연동 전까지 화면 조립에 사용. 기능 PR이 진행되며 항목이 추가됨.

import type { SafetyLevel, SeverityLevel, GradeLevel } from '@daengdaeng/tokens';

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

// ── 증상 체크 (SCR-009~011) ─────────────────────────────────────────

/** 증상 부위 카테고리 (SCR-009 그리드) */
export interface SymptomCat {
  id: string;
  emoji: string;
  label: string;
  sub: string;
}

export const symptomCats: SymptomCat[] = [
  { id: 'digest', emoji: '🤢', label: '소화기 · 구토', sub: '구토, 설사, 변비, 식욕부진' },
  { id: 'breath', emoji: '😮‍💨', label: '호흡기', sub: '기침, 호흡곤란, 코골이' },
  { id: 'move', emoji: '🦴', label: '움직임', sub: '절뚝거림, 안 움직임, 떨림' },
  { id: 'face', emoji: '👁️', label: '눈 · 귀 · 코', sub: '눈곱, 충혈, 귀 긁기, 콧물' },
  { id: 'skin', emoji: '🩹', label: '피부 · 털', sub: '가려움, 탈모, 발진, 멍울' },
  { id: 'behave', emoji: '😴', label: '행동 변화', sub: '무기력, 과음수, 배회' },
];

/**
 * 증상 질문 보기. `verdict`가 있으면 결과로 분기(emergency는 직행, 그 외는 전면광고 경유),
 * `next`가 있으면 해당 인덱스의 다음 질문으로 이동.
 */
export interface SymptomOption {
  label: string;
  next?: number;
  verdict?: SeverityLevel;
}

export interface SymptomQuestion {
  q: string;
  options: SymptomOption[];
}

/** 구토 시나리오 의사결정 트리 (데모) */
export const symptomQuestions: SymptomQuestion[] = [
  {
    q: '오늘 몇 번 토했나요?',
    options: [
      { label: '1~2번', next: 1 },
      { label: '3~4번', verdict: 'today' },
      { label: '5번 이상', verdict: 'emergency' },
      { label: '아직 안 토함', next: 1 },
    ],
  },
  {
    q: '토사물에 피나 이물질이 섞여 있나요?',
    options: [
      { label: '네, 피가 섞여 있어요', verdict: 'emergency' },
      { label: '이물질이 보여요', verdict: 'today' },
      { label: '아니요, 음식물뿐이에요', next: 2 },
    ],
  },
  {
    q: '평소처럼 활발하게 잘 움직이나요?',
    options: [
      { label: '네, 평소랑 비슷해요', verdict: 'watch' },
      { label: '조금 처져 있어요', verdict: 'today' },
      { label: '많이 무기력해요', verdict: 'emergency' },
    ],
  },
];

/** 증상 결과 (SCR-011). 면책 고지는 컴파운드가 항상 렌더 — 데이터에 두지 않음. */
export interface SymptomResultData {
  level: SeverityLevel;
  title: string;
  reason: string;
  actions: string[];
  /** 이럴 땐 병원으로 — 관찰 항목 (watch/today) */
  watchList?: string[];
  /** 병원 찾기 버튼 노출 여부 */
  hospital: boolean;
}

export const symptomResults: Record<SeverityLevel, SymptomResultData> = {
  emergency: {
    level: 'emergency',
    title: '지금 바로 병원에 가세요',
    reason: '피가 섞인 구토는 내부 출혈이나 중독의 신호일 수 있어요. 빠른 진료가 필요합니다.',
    actions: ['음식과 물 주는 것을 멈추세요', '토사물을 사진으로 찍어 두세요', '가까운 병원으로 바로 이동하세요'],
    hospital: true,
  },
  today: {
    level: 'today',
    title: '오늘 안에 병원에 가보세요',
    reason: '증상이 반복되거나 활력이 떨어진 상태예요. 오늘 중 수의사 진료를 권장합니다.',
    actions: ['상태 변화를 메모해 두세요', '평소 식사·배변 사진을 준비하세요'],
    watchList: ['증상이 더 잦아짐', '물도 못 마심', '점점 더 처짐'],
    hospital: true,
  },
  watch: {
    level: 'watch',
    title: '지금 당장 급하진 않아요',
    reason: '활력이 유지되고 증상이 가벼운 편이에요. 집에서 지켜보며 관리해 주세요.',
    actions: ['깨끗한 물을 충분히 주세요', '소화 잘 되는 담백한 식사로 바꿔보세요', '편안하고 조용한 환경을 만들어 주세요'],
    watchList: ['24시간 내 차도가 없음', '대소변에 피가 보임', '무기력이 심해짐'],
    hospital: false,
  },
};

// ── 근처 동물병원 (SCR-012·013) ──────────────────────────────────────
export interface Hospital {
  id: number;
  name: string;
  /** 현재 위치 기준 거리 */
  dist: string;
  /** 현재 진료 중 여부 */
  open: boolean;
  /** 24시간 운영 여부 */
  is24h: boolean;
  /** 진료 시간 표기 */
  hours: string;
  phone: string;
  addr: string;
}

export const hospitals: Hospital[] = [
  { id: 1, name: '행복동물병원', dist: '0.3km', open: true, is24h: false, hours: '09:00 – 21:00', phone: '02-123-4567', addr: '서울 강남구 역삼로 12' },
  { id: 2, name: '강남응급동물의료센터', dist: '1.1km', open: true, is24h: true, hours: '24시간 연중무휴', phone: '02-999-0000', addr: '서울 강남구 역삼동 123-45' },
  { id: 3, name: '미소동물병원', dist: '1.4km', open: false, is24h: false, hours: '09:00 – 19:00', phone: '02-456-7890', addr: '서울 강남구 테헤란로 88' },
  { id: 4, name: '튼튼동물메디컬', dist: '2.0km', open: true, is24h: false, hours: '10:00 – 20:00', phone: '02-321-9876', addr: '서울 서초구 서초대로 30' },
];

// ── 건강 기록 (SCR-014·015) ──────────────────────────────────────────

/** 기록 종류 — 예방접종·체중·병원 방문 */
export type RecordType = 'vaccine' | 'weight' | 'vet';

export interface HealthRecordItem {
  id: number;
  type: RecordType;
  /** 표시 날짜 (YYYY.MM.DD) */
  date: string;
  title: string;
  /** 부가 설명 (다음 접종일·증감·검진 사유 등) */
  sub: string;
}

export const records: HealthRecordItem[] = [
  { id: 1, type: 'vaccine', date: '2026.06.10', title: 'DHPPL — 5차', sub: '다음 접종: 2027.06.10' },
  { id: 2, type: 'weight', date: '2026.05.25', title: '3.2 kg', sub: '지난달 대비 +0.1kg' },
  { id: 3, type: 'vet', date: '2026.05.10', title: '행복동물병원', sub: '피부 발진 검진' },
  { id: 4, type: 'vaccine', date: '2026.05.01', title: '코로나 장염 — 2차', sub: '다음 접종: 2026.06.01' },
];
