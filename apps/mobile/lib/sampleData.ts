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
