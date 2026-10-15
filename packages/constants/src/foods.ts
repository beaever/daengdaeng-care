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

// 근거: ASPCA Animal Poison Control "People Foods to Avoid Feeding Your Pets", AKC "Human Foods Dogs Can and Can't Eat".
// 정보가 바뀌면 apps/web·docs/APP_STORE_METADATA.md 의 출처 표기도 함께 확인한다.
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
    aliases: ['onion', 'onions', '대파', '쪽파', '부추', '달래', '양파가루'],
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
    aliases: ['coffee', '카페인', 'caffeine', '녹차', '홍차', '콜라', '에너지드링크'],
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
    reason: '식이섬유와 비타민이 풍부한 간식이에요. 당이 있으니 간식으로 조금씩 주세요.',
    serve: '반드시 익혀서 주세요. 껍질은 제거하는 게 좋아요.',
    nutrition: ['식이섬유', '비타민 A', '칼륨', '베타카로틴'],
    related: ['단호박', '당근'],
    aliases: ['sweet potato'],
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
  // ── 위험 ──────────────────────────────────────────────
  마늘: {
    name: '마늘', level: 'danger',
    reason: '마늘은 양파보다 독성이 더 강해요. 적혈구를 파괴해 빈혈을 일으키고, 증상이 며칠 뒤에 나타나기도 합니다. 가루·익힌 것도 위험해요.',
    ingredient: '티오설페이트 · 이황화물',
    symptoms: ['구토, 설사', '무기력함', '잇몸 창백', '붉은 소변'],
    related: ['양파', '대파', '부추', '마늘가루'],
    aliases: ['garlic', '다진마늘', '마늘가루', '흑마늘'],
  },
  술: {
    name: '술', level: 'danger',
    reason: '알코올은 강아지의 신경계를 빠르게 억제해요. 적은 양으로도 저혈당·저체온·호흡 저하가 올 수 있습니다.',
    ingredient: '에탄올',
    symptoms: ['구토', '비틀거림', '호흡이 느려짐', '의식 저하'],
    related: ['맥주', '와인', '발효 중인 빵 반죽'],
    aliases: ['alcohol', '알코올', '맥주', '소주', '와인', '막걸리', 'beer', 'wine'],
  },
  닭뼈: {
    name: '닭뼈', level: 'danger',
    reason: '익힌 뼈는 날카롭게 쪼개져 입·식도·장에 상처를 내거나 장을 막을 수 있어요. 치킨·갈비 뼈를 특히 조심하세요.',
    ingredient: '날카로운 뼛조각',
    symptoms: ['구토', '혈변 또는 검은 변', '변비, 배를 아파함', '침 흘림'],
    related: ['갈비뼈', '생선가시'],
    aliases: ['뼈', '치킨뼈', '익힌뼈', '갈비뼈', '생선가시', 'bone', 'bones'],
  },
  김치: {
    name: '김치', level: 'danger',
    reason: '마늘·파 양념은 빈혈을 일으키고, 고춧가루와 높은 염분은 위장을 자극해요. 물에 씻어도 양념 성분이 남습니다.',
    ingredient: '마늘 · 파 · 고춧가루 · 염분',
    symptoms: ['구토, 설사', '물을 많이 마심', '무기력함'],
    related: ['마늘', '양파', '젓갈'],
    aliases: ['kimchi', '깍두기', '배추김치'],
  },
  호두: {
    name: '호두', level: 'danger',
    reason: '곰팡이가 핀 호두에는 떨림·발작을 일으키는 독소가 생길 수 있어요. 지방이 많아 췌장염, 큰 조각은 장폐색 위험도 있습니다.',
    ingredient: '곰팡이 독소 · 지방',
    symptoms: ['구토', '떨림', '발작'],
    related: ['마카다미아', '피칸'],
    aliases: ['walnut', '피칸', 'pecan'],
  },

  // ── 주의 ──────────────────────────────────────────────
  체리: {
    name: '체리', level: 'caution',
    reason: '과육은 괜찮지만 씨·줄기·잎에 시안화물 성분이 있어요. 씨는 장을 막을 수도 있습니다.',
    serve: '씨와 줄기를 완전히 빼고 과육만 한두 알. 씨째 먹었다면 동물병원에 문의하세요.',
    symptoms: ['(씨 섭취 시) 호흡 곤란', '잇몸이 붉어짐', '구토'],
    related: ['복숭아', '자두'],
    aliases: ['cherry', '앵두'],
  },
  복숭아: {
    name: '복숭아', level: 'caution',
    reason: '과육은 먹어도 되지만 씨에 시안화물 성분이 있고, 크고 단단해 장폐색 위험이 커요.',
    serve: '씨와 껍질을 빼고 과육만 작게 잘라 조금. 통조림은 당이 많아 피하세요.',
    symptoms: ['(씨 섭취 시) 구토', '변을 못 봄', '배를 아파함'],
    related: ['자두', '체리', '살구'],
    aliases: ['peach', '천도복숭아', '살구', 'apricot'],
  },
  자두: {
    name: '자두', level: 'caution',
    reason: '과육은 소량 괜찮지만 씨에 시안화물 성분이 있고 장을 막을 수 있어요.',
    serve: '씨를 반드시 빼고 과육만 조금. 말린 자두(푸룬)는 당이 많아 피하세요.',
    symptoms: ['(씨 섭취 시) 구토', '배를 아파함'],
    related: ['복숭아', '체리'],
    aliases: ['plum', '푸룬'],
  },
  토마토: {
    name: '토마토', level: 'caution',
    reason: '잘 익은 빨간 과육은 괜찮지만, 초록 부분(덜 익은 열매·잎·줄기)에는 솔라닌 성분이 있어요.',
    serve: '잘 익은 과육만 꼭지를 떼고 조금. 케첩·소스는 양파·소금이 들어 있어 안 돼요.',
    symptoms: ['(초록 부분 섭취 시) 구토', '무기력함', '떨림'],
    related: ['감자'],
    aliases: ['tomato', '방울토마토'],
  },
  감자: {
    name: '감자', level: 'caution',
    reason: '익힌 감자는 소량 괜찮지만 생감자·싹·초록색 껍질에는 솔라닌 성분이 있어요.',
    serve: '껍질과 싹을 빼고 푹 익혀 양념 없이 조금. 감자튀김·감자칩은 기름·소금이 많아 안 돼요.',
    symptoms: ['(생감자·싹 섭취 시) 구토, 설사', '무기력함'],
    related: ['고구마', '토마토'],
    aliases: ['potato'],
  },
  옥수수: {
    name: '옥수수', level: 'caution',
    reason: '알갱이는 소량 괜찮지만 옥수수 속대는 소화되지 않아 장을 막는 대표 원인이에요.',
    serve: '알갱이만 익혀서 조금. 속대는 절대 주지 말고, 먹었다면 바로 동물병원에 문의하세요.',
    symptoms: ['(속대 섭취 시) 반복 구토', '변을 못 봄', '식욕 저하'],
    related: ['팝콘'],
    aliases: ['corn', '옥수수알', '콘'],
  },
  귤: {
    name: '귤', level: 'caution',
    reason: '과육은 비타민 C가 있지만 산과 당이 많아 많이 먹으면 배탈이 날 수 있어요.',
    serve: '껍질·씨·흰 속껍질을 빼고 한두 조각만.',
    symptoms: ['구토', '설사'],
    related: ['오렌지', '자몽'],
    aliases: ['orange', '오렌지', '한라봉', '감귤', 'mandarin'],
  },
  땅콩: {
    name: '땅콩', level: 'caution',
    reason: '무염 땅콩은 소량 괜찮지만 지방이 많고, 소금·양념 땅콩은 위험해요. 작은 강아지는 목에 걸릴 수 있어요.',
    serve: '껍질을 벗긴 무염 땅콩을 한두 알만.',
    symptoms: ['구토, 설사', '(많이 먹으면) 복통'],
    related: ['땅콩버터', '호두'],
    aliases: ['peanut', 'peanuts'],
  },
  땅콩버터: {
    name: '땅콩버터', level: 'caution',
    reason: '자일리톨이 들어간 제품은 매우 위험해요. 성분표에 자일리톨(xylitol)이 없는 무가당·무염 제품만 소량 주세요.',
    serve: '자일리톨 없는 제품인지 꼭 확인하고 티스푼 끝만큼.',
    symptoms: ['(자일리톨 제품) 비틀거림', '발작', '구토'],
    related: ['자일리톨', '땅콩'],
    aliases: ['peanut butter', '피넛버터'],
  },
  요거트: {
    name: '요거트', level: 'caution',
    reason: '무가당 플레인 요거트는 소량 괜찮지만 유당이 있어 설사할 수 있어요. 가당·과일맛 제품은 자일리톨이나 당이 들어 있을 수 있어요.',
    serve: '무가당 플레인으로 한두 스푼만.',
    symptoms: ['설사', '복부 팽만'],
    related: ['우유', '치즈'],
    aliases: ['yogurt', '요구르트', '그릭요거트'],
  },
  돼지고기: {
    name: '돼지고기', level: 'caution',
    reason: '완전히 익힌 살코기는 괜찮지만 지방이 많아 췌장염 위험이 있고, 덜 익히면 기생충 위험이 있어요.',
    serve: '기름을 떼고 완전히 익혀 양념 없이 조금. 삼겹살·햄·소시지·베이컨은 안 돼요.',
    symptoms: ['구토', '설사', '배를 아파함'],
    related: ['소고기', '닭고기'],
    aliases: ['pork', '돼지', '삼겹살', '목살'],
  },
  참치: {
    name: '참치', level: 'caution',
    reason: '단백질이 풍부하지만 수은이 쌓일 수 있고, 통조림은 기름과 염분이 많아요.',
    serve: '물에 담긴 무염 참치를 가끔 한두 스푼만. 기름 참치는 기름을 빼도 피하세요.',
    symptoms: ['(많이 먹으면) 구토, 설사'],
    related: ['연어'],
    aliases: ['tuna', '참치캔', '참치통조림'],
  },
  새우: {
    name: '새우', level: 'caution',
    reason: '익힌 새우 살은 소량 괜찮지만 껍질·꼬리는 목에 걸릴 수 있고, 갑각류 알레르기가 있는 강아지도 있어요.',
    serve: '껍질·머리·꼬리를 빼고 완전히 익혀 양념 없이 한두 마리.',
    symptoms: ['구토', '가려움'],
    related: ['게', '연어'],
    aliases: ['shrimp', '대하', '새우살'],
  },
  시금치: {
    name: '시금치', level: 'caution',
    reason: '영양은 많지만 수산(옥살산)이 많아 자주 먹으면 신장·결석에 부담이 될 수 있어요.',
    serve: '데쳐서 양념 없이 아주 조금, 가끔만. 결석이 있던 강아지는 피하세요.',
    symptoms: ['(많이 먹으면) 구토, 설사'],
    related: ['양배추', '브로콜리'],
    aliases: ['spinach'],
  },
  버섯: {
    name: '버섯', level: 'caution',
    reason: '마트에서 파는 식용 버섯은 익혀서 소량 괜찮지만, 산이나 공원에서 자란 버섯은 간·신장을 망가뜨리는 독버섯일 수 있어요.',
    serve: '양송이·표고 같은 식용 버섯만 익혀 양념 없이 조금. 산책 중 버섯을 먹었다면 바로 동물병원에 가세요.',
    symptoms: ['(야생 버섯) 구토, 설사', '침 흘림', '비틀거림', '황달'],
    related: ['양파'],
    aliases: ['mushroom', '양송이', '표고', '팽이버섯', '새송이'],
  },
  멜론: {
    name: '멜론', level: 'caution',
    reason: '과육은 수분이 많아 괜찮지만 당이 높아요. 씨와 껍질은 소화가 안 돼 장을 막을 수 있어요.',
    serve: '씨·껍질을 빼고 과육만 한입 크기로 조금.',
    symptoms: ['(껍질 섭취 시) 구토', '설사'],
    related: ['수박', '참외'],
    aliases: ['melon', '참외'],
  },

  // ── 안전 ──────────────────────────────────────────────
  바나나: {
    name: '바나나', level: 'safe',
    reason: '칼륨과 식이섬유가 있는 간식이에요. 당이 높으니 가끔 조금씩 주세요.',
    serve: '껍질을 벗기고 작게 잘라 한두 조각.',
    nutrition: ['칼륨', '식이섬유', '비타민 B6'],
    related: ['사과', '블루베리'],
    aliases: ['banana'],
  },
  딸기: {
    name: '딸기', level: 'safe',
    reason: '비타민 C와 식이섬유가 풍부한 간식이에요.',
    serve: '꼭지를 떼고 작게 잘라 한두 알. 시럽·설탕 절임은 안 돼요.',
    nutrition: ['비타민 C', '식이섬유', '항산화 물질'],
    related: ['블루베리', '바나나'],
    aliases: ['strawberry'],
  },
  배: {
    name: '배', level: 'safe',
    reason: '수분과 식이섬유가 많은 과일이에요. 단, 씨에는 소량의 독성 성분이 있어요.',
    serve: '씨와 심을 빼고 한입 크기로. 통조림 배는 당이 많아 피하세요.',
    nutrition: ['식이섬유', '비타민 C', '수분'],
    related: ['사과'],
    aliases: ['pear'],
  },
  오이: {
    name: '오이', level: 'safe',
    reason: '수분이 많고 칼로리가 낮아 체중 관리 중인 강아지에게 좋은 간식이에요.',
    serve: '씻어서 얇게 썰어 주세요. 피클(절인 오이)은 염분·양념 때문에 안 돼요.',
    nutrition: ['수분', '비타민 K', '칼륨'],
    related: ['당근', '양배추'],
    aliases: ['cucumber'],
  },
  단호박: {
    name: '단호박', level: 'safe',
    reason: '식이섬유가 풍부해 장 건강에 도움이 돼요.',
    serve: '껍질·씨를 빼고 푹 익혀 양념 없이. 호박 파이 필링은 당·향신료가 있어 안 돼요.',
    nutrition: ['식이섬유', '베타카로틴', '비타민 A'],
    related: ['고구마', '당근'],
    aliases: ['pumpkin', '호박', '애호박'],
  },
  양배추: {
    name: '양배추', level: 'safe',
    reason: '비타민과 식이섬유가 있는 채소예요. 많이 먹으면 가스가 찰 수 있어요.',
    serve: '익혀서 잘게 썰어 조금만.',
    nutrition: ['비타민 C', '비타민 K', '식이섬유'],
    related: ['브로콜리', '오이'],
    aliases: ['cabbage', '배추'],
  },
  계란: {
    name: '계란', level: 'safe',
    reason: '완전히 익힌 계란은 소화가 잘 되는 단백질 간식이에요. 날계란은 살모넬라균 위험이 있어요.',
    serve: '완숙으로 삶거나 기름 없이 익혀 소금 없이. 작은 강아지는 하루 반 개 이하.',
    nutrition: ['단백질', '비타민 B12', '셀레늄'],
    related: ['닭고기'],
    aliases: ['egg', '달걀', '삶은 계란', '노른자', '흰자'],
  },
  소고기: {
    name: '소고기', level: 'safe',
    reason: '양질의 단백질과 철분을 주는 고기예요.',
    serve: '기름을 떼고 완전히 익혀 양념 없이. 불고기·갈비 양념은 마늘·양파가 있어 안 돼요.',
    nutrition: ['단백질', '철분', '아연', '비타민 B12'],
    related: ['닭고기', '돼지고기'],
    aliases: ['beef', '우둔', '안심'],
  },
  연어: {
    name: '연어', level: 'safe',
    reason: '오메가-3 지방산이 풍부해 피부·털 건강에 좋아요. 반드시 익혀서 주세요.',
    serve: '뼈를 발라내고 완전히 익혀 양념 없이. 날연어·훈제 연어는 안 돼요.',
    nutrition: ['오메가-3', '단백질', '비타민 D'],
    related: ['참치', '닭고기'],
    aliases: ['salmon'],
  },
  쌀밥: {
    name: '쌀밥', level: 'safe',
    reason: '소화가 잘 되는 탄수화물이에요. 배탈이 났을 때 수의사들이 닭고기와 함께 권하기도 해요.',
    serve: '흰쌀밥을 양념 없이 조금. 볶음밥·비빔밥은 안 돼요.',
    nutrition: ['탄수화물'],
    related: ['닭고기', '고구마'],
    aliases: ['rice', '밥', '흰쌀밥', '현미밥'],
  },
  파인애플: {
    name: '파인애플', level: 'safe',
    reason: '비타민 C가 있는 과일이에요. 당과 산이 높아 소량만 주세요.',
    serve: '껍질과 단단한 심을 빼고 생과육만 작게. 통조림(시럽)은 안 돼요.',
    nutrition: ['비타민 C', '식이섬유'],
    related: ['망고'],
    aliases: ['pineapple'],
  },
  망고: {
    name: '망고', level: 'safe',
    reason: '비타민이 풍부한 과일이에요. 크고 단단한 씨는 장을 막을 수 있어 반드시 빼야 해요.',
    serve: '씨와 껍질을 빼고 과육만 작게 조금.',
    nutrition: ['비타민 A', '비타민 C', '식이섬유'],
    related: ['파인애플', '바나나'],
    aliases: ['mango'],
  },
};

export const POPULAR_FOODS = ['포도', '초콜릿', '양파', '닭뼈', '사과', '닭고기', '고구마', '수박'];

/** 이름·별칭 부분일치로 다건 검색한다. 빈 질의는 빈 배열. */
export function searchFoods(query: string): FoodEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return Object.values(FOODS).filter(
    (f) => f.name.toLowerCase().includes(q) || f.aliases?.some((a) => a.toLowerCase().includes(q))
  );
}

export function searchFood(query: string): FoodEntry | null {
  const q = query.trim().toLowerCase();
  return FOODS[q] ?? searchFoods(query)[0] ?? null;
}
