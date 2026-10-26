export interface BreedEntry {
  name: string;
  aliases: string[];
}

export const BREEDS: BreedEntry[] = [
  { name: '말티즈', aliases: ['maltese'] },
  { name: '푸들', aliases: ['poodle', '토이푸들', '미니어처 푸들'] },
  { name: '포메라니안', aliases: ['pomeranian', '포메'] },
  { name: '비숑 프리제', aliases: ['bichon frise', '비숑'] },
  { name: '시츄', aliases: ['shih tzu', '시추'] },
  { name: '치와와', aliases: ['chihuahua'] },
  { name: '골든 리트리버', aliases: ['golden retriever'] },
  { name: '래브라도 리트리버', aliases: ['labrador retriever', '래브라도'] },
  { name: '웰시 코기', aliases: ['welsh corgi', '코기'] },
  { name: '진돗개', aliases: ['jindo', '진도'] },
  { name: '시바 이누', aliases: ['shiba inu', '시바견'] },
  { name: '요크셔 테리어', aliases: ['yorkshire terrier', '요키'] },
  { name: '닥스훈트', aliases: ['dachshund'] },
  { name: '프렌치 불독', aliases: ['french bulldog', '프렌치불독'] },
  { name: '비글', aliases: ['beagle'] },
  { name: '보더 콜리', aliases: ['border collie'] },
  { name: '사모예드', aliases: ['samoyed'] },
  { name: '미니어처 슈나우저', aliases: ['miniature schnauzer', '슈나우저'] },
  { name: '스피츠', aliases: ['japanese spitz', '재패니즈 스피츠'] },
  { name: '페키니즈', aliases: ['pekingese'] },
  { name: '퍼그', aliases: ['pug'] },
  { name: '잭 러셀 테리어', aliases: ['jack russell terrier'] },
  { name: '코카 스파니엘', aliases: ['cocker spaniel'] },
  { name: '시베리안 허스키', aliases: ['siberian husky', '허스키'] },
  { name: '알래스칸 말라뮤트', aliases: ['alaskan malamute', '말라뮤트'] },
  { name: '저먼 셰퍼드', aliases: ['german shepherd', '셰퍼드'] },
  { name: '도베르만', aliases: ['doberman'] },
  { name: '카발리에 킹 찰스 스패니얼', aliases: ['cavalier king charles spaniel'] },
  { name: '파피용', aliases: ['papillon'] },
  { name: '미니어처 핀셔', aliases: ['miniature pinscher', '미니핀'] },
  { name: '베들링턴 테리어', aliases: ['bedlington terrier'] },
  { name: '이탈리안 그레이하운드', aliases: ['italian greyhound', '이탈리안그레이하운드'] },
  { name: '휘핏', aliases: ['whippet'] },
  { name: '불독', aliases: ['bulldog', '잉글리시 불독'] },
  { name: '삽살개', aliases: ['sapsali'] },
  { name: '풍산개', aliases: ['poongsan'] },
  { name: '보스턴 테리어', aliases: ['boston terrier'] },
  { name: '셔틀랜드 쉽독', aliases: ['shetland sheepdog', '셸티'] },
  { name: '믹스견', aliases: ['mix', '믹스', '잡종'] },
];

export const POPULAR_BREEDS: string[] = [
  '말티즈',
  '푸들',
  '포메라니안',
  '비숑 프리제',
  '시츄',
  '믹스견',
];

/** 공백 제거 + 소문자화 후 포함 여부를 비교한다 (예: "골든리트리버" → 골든 리트리버). */
function normalize(s: string): string {
  return s.toLowerCase().replace(/\s/g, '');
}

/** 견종명·별칭 부분일치로 다건 검색한다. 빈 질의는 빈 배열. */
export function searchBreeds(query: string): BreedEntry[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return BREEDS.filter(
    (b) => normalize(b.name).includes(q) || b.aliases.some((a) => normalize(a).includes(q))
  );
}
