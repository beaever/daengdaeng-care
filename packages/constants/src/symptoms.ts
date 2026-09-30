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
  { id: 'emergency', emoji: '🚨', label: '응급 증상', sub: '발작 · 의식 없음 · 호흡 곤란' },
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

// 호흡기 — 청색증·호흡곤란·질식은 즉시, 반복 기침은 24시간 내
// 출처: https://www.merckvetmanual.com/multimedia/table/when-to-see-a-veterinarian
//       https://vcahospitals.com/know-your-pet/common-emergencies-in-dogs
//       https://vcahospitals.com/pediatric/puppy/health-wellness/why-is-my-puppy-coughing
export const BREATH_QUESTIONS: SymptomQuestion[] = [
  {
    q: '잇몸이나 혀 색이 어떤가요?',
    options: [
      { label: '평소처럼 분홍색이에요', next: 1 },
      { label: '파랗거나 보라·회색빛이에요', verdict: 'emergency' },
      { label: '창백하거나 하얘요', verdict: 'emergency' },
      { label: '잘 모르겠어요', next: 1 },
    ],
  },
  {
    q: '숨 쉬는 모습이 어떤가요?',
    options: [
      { label: '입을 벌리고 힘겹게 숨 쉬어요', verdict: 'emergency' },
      { label: '목에 뭔가 걸린 듯 캑캑거려요', verdict: 'emergency' },
      { label: '쉬고 있는데도 숨이 빠르고 가빠요', verdict: 'emergency' },
      { label: '숨 쉬는 건 평소와 비슷해요', next: 2 },
    ],
  },
  {
    q: '기침이나 코골이는 어떤가요?',
    options: [
      { label: '기침할 때 피나 거품이 나와요', verdict: 'emergency' },
      { label: '하루에도 여러 번 기침해요', verdict: 'today' },
      { label: '기운이나 식욕도 떨어졌어요', verdict: 'today' },
      { label: '가끔 기침하거나 코를 골지만 활발해요', verdict: 'watch' },
    ],
  },
];

// 움직임 — 쓰러짐·경련·갑작스런 마비·다리를 전혀 딛지 못함은 즉시, 비틀거림은 24시간 내
// 출처: https://www.merckvetmanual.com/multimedia/table/when-to-see-a-veterinarian
//       https://vcahospitals.com/know-your-pet/common-emergencies-in-dogs
//       https://www.merckvetmanual.com/dog-owners/bone-joint-and-muscle-disorders-of-dogs/lameness-in-dogs
export const MOVE_QUESTIONS: SymptomQuestion[] = [
  {
    q: '다음 중 해당하는 모습이 있나요?',
    options: [
      { label: '쓰러지거나 경련을 해요', verdict: 'emergency' },
      { label: '뒷다리를 갑자기 못 쓰거나 끌어요', verdict: 'emergency' },
      { label: '사고나 추락 후 다리 모양이 이상해요', verdict: 'emergency' },
      { label: '해당 없어요', next: 1 },
    ],
  },
  {
    q: '걷는 모습이 어떤가요?',
    options: [
      { label: '한 다리를 전혀 딛지 못해요', verdict: 'emergency' },
      { label: '비틀거리거나 균형을 못 잡아요', verdict: 'today' },
      { label: '절뚝거리지만 딛긴 해요', next: 2 },
      { label: '잘 걷지만 몸을 떨어요', next: 2 },
    ],
  },
  {
    q: '만지거나 움직일 때 반응은 어떤가요?',
    options: [
      { label: '만지면 아파서 소리를 내거나 피해요', verdict: 'today' },
      { label: '기운이 없고 움직이려 하지 않아요', verdict: 'today' },
      { label: '평소처럼 먹고 활발해요', verdict: 'watch' },
    ],
  },
];

// 눈·귀·코 — 안구 돌출·눈 외상·급격한 얼굴 부종은 즉시, 찡그림·혼탁·색 있는 분비물·머리 기울임은 당일
// 출처: https://vcahospitals.com/urgent-care/health-concerns/eye-issues
//       https://www.merckvetmanual.com/multimedia/table/when-to-see-a-veterinarian
//       https://vcahospitals.com/know-your-pet/inner-ear-infection-otitis-interna-in-dogs
export const FACE_QUESTIONS: SymptomQuestion[] = [
  {
    q: '다음 중 해당하는 모습이 있나요?',
    options: [
      { label: '눈알이 튀어나왔거나 눈을 다쳤어요', verdict: 'emergency' },
      { label: '얼굴이나 주둥이가 갑자기 부었어요', verdict: 'emergency' },
      { label: '해당 없어요', next: 1 },
    ],
  },
  {
    q: '눈과 귀는 어떤가요?',
    options: [
      { label: '눈을 찡그리거나 잘 못 떠요', verdict: 'today' },
      { label: '눈이 뿌옇게 변했거나 잘 못 보는 것 같아요', verdict: 'today' },
      { label: '고개가 한쪽으로 기울거나 비틀거려요', verdict: 'today' },
      { label: '해당 없어요', next: 2 },
    ],
  },
  {
    q: '눈곱·귀지·콧물은 어떤가요?',
    options: [
      { label: '노랗거나 초록색, 피가 섞여 있어요', verdict: 'today' },
      { label: '귀를 계속 긁거나 머리를 자주 흔들어요', verdict: 'today' },
      { label: '맑은 눈물·콧물이 조금 있고 활발해요', verdict: 'watch' },
    ],
  },
];

// 피부·털 — 얼굴·목 급격한 부종(벌 쏘임 등)·호흡곤란·지혈 안 되는 출혈은 즉시,
// 두드러기·빠르게 커지거나 아픈 멍울·진물은 당일, 가벼운 가려움·통증 없는 멍울은 관찰
// 출처: https://www.akc.org/expert-advice/health/dog-stung-bee-wasp/
//       https://vcahospitals.com/know-your-pet/anaphylaxis-in-dogs
//       https://vcahospitals.com/resources/conditions-dog/skin-coat/watch-your-pet-s-lumps-for-these-warning-signs
export const SKIN_QUESTIONS: SymptomQuestion[] = [
  {
    q: '다음 중 해당하는 모습이 있나요?',
    options: [
      { label: '얼굴이나 목이 갑자기 부었어요', verdict: 'emergency' },
      { label: '피부 증상과 함께 숨쉬기 힘들어해요', verdict: 'emergency' },
      { label: '피가 멈추지 않는 상처가 있어요', verdict: 'emergency' },
      { label: '해당 없어요', next: 1 },
    ],
  },
  {
    q: '피부 상태가 어떤가요?',
    options: [
      { label: '갑자기 온몸에 두드러기가 올라왔어요', verdict: 'today' },
      { label: '멍울이 빠르게 커지거나 만지면 아파해요', verdict: 'today' },
      { label: '진물이나 고름이 나고 빨갛게 헐었어요', verdict: 'today' },
      { label: '가려움·탈모·작은 멍울 정도예요', next: 2 },
    ],
  },
  {
    q: '평소 생활은 어떤가요?',
    options: [
      { label: '피가 날 때까지 긁거나 잠을 못 자요', verdict: 'today' },
      { label: '가끔 긁지만 잘 먹고 활발해요', verdict: 'watch' },
      { label: '멍울이 있지만 아파하지 않고 크기도 그대로예요', verdict: 'watch' },
    ],
  },
];

// 행동 변화 — 의식 저하·쓰러짐·경련·헛구역질+배 부풂·소변을 못 봄은 즉시,
// 과음수·갑작스런 행동 변화·24시간 이상 식음 전폐는 당일
// 출처: https://www.merckvetmanual.com/multimedia/table/when-to-see-a-veterinarian
//       https://vcahospitals.com/know-your-pet/common-emergencies-in-dogs
//       https://www.akc.org/expert-advice/health/why-is-my-dog-drinking-so-much-water/
export const BEHAVE_QUESTIONS: SymptomQuestion[] = [
  {
    q: '다음 중 해당하는 모습이 있나요?',
    options: [
      { label: '불러도 반응이 둔하거나 멍해요', verdict: 'emergency' },
      { label: '쓰러지거나 경련을 했어요', verdict: 'emergency' },
      { label: '헛구역질만 하고 배가 부풀어 올라요', verdict: 'emergency' },
      { label: '힘을 주는데 소변이 거의 안 나와요', verdict: 'emergency' },
      { label: '해당 없어요', next: 1 },
    ],
  },
  {
    q: '가장 달라진 점은 무엇인가요?',
    options: [
      { label: '기운이 없고 누워만 있어요', next: 2 },
      { label: '물을 평소보다 훨씬 많이 마셔요', next: 3 },
      { label: '목적 없이 돌아다니거나 멍하니 서 있어요', verdict: 'today' },
    ],
  },
  {
    q: '기운 없는 모습이 어느 정도인가요?',
    options: [
      { label: '일어나지 못하거나 걷다가 주저앉아요', verdict: 'emergency' },
      { label: '잇몸이 창백하거나 하얘요', verdict: 'emergency' },
      { label: '하루 넘게 먹지도 마시지도 않아요', verdict: 'today' },
      { label: '조금 처졌지만 먹고 산책도 해요', verdict: 'watch' },
    ],
  },
  {
    q: '물을 많이 마시면서 다른 변화도 있나요?',
    options: [
      { label: '토하거나 많이 처져요', verdict: 'emergency' },
      { label: '그 밖에는 평소와 비슷해요', verdict: 'today' },
    ],
  },
];

// 카테고리 id → 질문 트리 (앱과 합의된 계약)
export const SYMPTOM_QUESTIONS: Record<string, SymptomQuestion[]> = {
  digest: VOMITING_QUESTIONS,
  breath: BREATH_QUESTIONS,
  move: MOVE_QUESTIONS,
  face: FACE_QUESTIONS,
  skin: SKIN_QUESTIONS,
  behave: BEHAVE_QUESTIONS,
};

export const SYMPTOM_RESULTS: Record<SeverityLevel, SymptomResult> = {
  emergency: {
    level: 'emergency',
    title: '지금 바로 병원에 가세요',
    reason: '생명이 위험할 수 있는 증상이에요. 지체하지 말고 진료를 받으세요.',
    actions: [
      '가까운 병원으로 바로 이동하세요',
      '이동하면서 병원에 미리 전화해 상태를 알리세요',
      '증상이 시작된 시각과 모습을 기억해 두세요',
    ],
    hospital: true,
  },
  today: {
    level: 'today',
    title: '오늘 안에 병원에 가보세요',
    reason: '집에서 지켜보기보다는 진료가 필요한 증상이에요. 오늘 중 수의사 진료를 권장합니다.',
    actions: ['증상이 시작된 시점과 변화를 메모해 두세요', '증상 부위나 모습을 사진·영상으로 남겨 두세요'],
    watchList: ['증상이 더 잦아지거나 심해짐', '물도 못 마심', '점점 더 처짐'],
    hospital: true,
  },
  watch: {
    level: 'watch',
    title: '지금 당장 급하진 않아요',
    reason: '활력이 유지되고 증상이 가벼운 편이에요. 집에서 지켜보며 관리해 주세요.',
    actions: [
      '깨끗한 물을 충분히 주세요',
      '편안하고 조용한 환경을 만들어 주세요',
      '증상 변화를 매일 기록하고, 다음 진료 때 수의사에게 알려 주세요',
    ],
    watchList: ['24시간 내 차도가 없음', '새로운 증상이 생김', '먹거나 마시지 않음', '무기력이 심해짐'],
    hospital: false,
  },
};
