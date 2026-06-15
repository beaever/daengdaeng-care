// 댕댕케어 — 데모 샘플 데이터 (Korean).
// 실제 데이터 연동 전까지 화면 조립에 사용. 기능 PR이 진행되며 항목이 추가됨.

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
