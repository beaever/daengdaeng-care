// 댕댕케어 — 데모 샘플 데이터 (Korean).
// 병원 샘플만 남아 있다. T1.7(Kakao Local 연동)에서 이 파일째 삭제된다.

// ── 근처 동물병원 (SCR-012·013) ──────────────────────────────────────
// 가상의 데모 데이터 — 실명·실번호·실주소가 아니다. T1.7에서 Kakao Local 검색 결과로 교체되며
// 이 샘플은 삭제된다 (IOS_RELEASE_PLAN.md T1.7).
// Kakao Local 응답 필드(id, place_name, road_address_name, phone, y, x)에 맞춘 형태.
// distance 는 searchHospitals 가 현재 위치 기준으로 계산해 붙인다 (hospitals.ts 의 Hospital 참고).
export interface SampleHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export const hospitals: SampleHospital[] = [
  { id: '1', name: '샘플 동물병원 A', address: '서울 강남구 강남대로', phone: '02-0000-0001', lat: 37.4986, lng: 127.0281 },
  { id: '2', name: '샘플 동물병원 B', address: '서울 강남구 테헤란로', phone: '02-0000-0002', lat: 37.5012, lng: 127.0396 },
  { id: '3', name: '샘플 동물병원 C', address: '서울 강남구 역삼로', phone: '02-0000-0003', lat: 37.4953, lng: 127.0312 },
  { id: '4', name: '샘플 동물병원 D', address: '서울 서초구 서초대로', phone: '02-0000-0004', lat: 37.4937, lng: 127.0147 },
];
