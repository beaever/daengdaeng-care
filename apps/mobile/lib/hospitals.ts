// 병원 검색 데이터 계층. T1.7 전까지는 샘플 데이터를 거리순으로 반환한다.
// distanceMeters/formatDistance 는 네이티브 import 가 없는 geo.ts 에 둬서
// jest 가 expo-location 을 끌어오지 않게 한다 (age.ts / recordSummary.ts 패턴).
import * as Location from 'expo-location';
import { hospitals as sampleHospitals, type SampleHospital } from './sampleData';
import { distanceMeters, type LatLng } from './geo';

export type { LatLng } from './geo';
export { distanceMeters, formatDistance } from './geo';

// Kakao Local 응답 필드(id, place_name, road_address_name, phone, y, x, distance)에 맞춘 형태.
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  /** 현재 위치 기준 거리 (m) */
  distance: number;
}

function withDistance(h: SampleHospital, center: LatLng): Hospital {
  return { ...h, distance: distanceMeters(center, { lat: h.lat, lng: h.lng }) };
}

/** 현재 위치 기준 거리순 병원 목록. */
// T1.7: Kakao Local 키워드 검색으로 교체
export async function searchHospitals(center: LatLng): Promise<Hospital[]> {
  return sampleHospitals.map((h) => withDistance(h, center)).sort((a, b) => a.distance - b.distance);
}

/** 지역명/주소 문자열을 좌표로 변환한다. 결과 없음/예외 시 null. */
export async function geocodeRegion(query: string): Promise<LatLng | null> {
  try {
    const results = await Location.geocodeAsync(query);
    const first = results[0];
    if (!first) return null;
    return { lat: first.latitude, lng: first.longitude };
  } catch {
    return null;
  }
}
