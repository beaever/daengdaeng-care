import type { SeverityLevel } from '@daengdaeng/tokens';

export interface SymptomOption {
  label: string;
  next?: number;
  verdict?: SeverityLevel;
}

export interface SymptomQuestion {
  q: string;
  options: SymptomOption[];
}

export interface SymptomCategory {
  id: string;
  emoji: string;
  label: string;
  sub: string;
  questions: SymptomQuestion[];
}

export interface SymptomResult {
  level: SeverityLevel;
  title: string;
  reason: string;
  actions: string[];
  watchList?: string[];
  hospital: boolean;
}

export const SYMPTOM_CATEGORIES: Omit<SymptomCategory, 'questions'>[] = [
  { id: 'digest', emoji: '🤢', label: '소화기 · 구토', sub: '구토, 설사, 변비, 식욕부진' },
  { id: 'breath', emoji: '😮‍💨', label: '호흡기', sub: '기침, 호흡곤란, 코골이' },
  { id: 'move',   emoji: '🦴', label: '움직임', sub: '절뚝거림, 안 움직임, 떨림' },
  { id: 'face',   emoji: '👁️', label: '눈 · 귀 · 코', sub: '눈곱, 충혈, 귀 긁기, 콧물' },
  { id: 'skin',   emoji: '🩹', label: '피부 · 털', sub: '가려움, 탈모, 발진, 멍울' },
  { id: 'behave', emoji: '😴', label: '행동 변화', sub: '무기력, 과음수, 배회' },
];

// Emergency categories bypass the decision tree → direct hospital redirect
export const EMERGENCY_SYMPTOMS = [
  { id: 'emergency', emoji: '🚨', label: '긴급 증상', sub: '의식 저하, 경련, 호흡 정지' },
];

export const VOMITING_QUESTIONS: SymptomQuestion[] = [
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

export const SYMPTOM_RESULTS: Record<SeverityLevel, SymptomResult> = {
  emergency: {
    level: 'emergency',
    title: '지금 바로 병원에 가세요',
    reason: '피가 섞인 구토는 내부 출혈이나 중독의 신호일 수 있어요. 빠른 진료가 필요합니다.',
    actions: [
      '음식과 물 주는 것을 멈추세요',
      '토사물을 사진으로 찍어 두세요',
      '가까운 병원으로 바로 이동하세요',
    ],
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
    actions: [
      '깨끗한 물을 충분히 주세요',
      '소화 잘 되는 담백한 식사로 바꿔보세요',
      '편안하고 조용한 환경을 만들어 주세요',
    ],
    watchList: ['24시간 내 차도가 없음', '대소변에 피가 보임', '무기력이 심해짐'],
    hospital: false,
  },
};
