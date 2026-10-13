// 병원 검색 데이터 계층. Kakao Local 키워드 검색으로 현재 위치 주변 동물병원을 찾는다.
// distanceMeters/formatDistance 는 네이티브 import 가 없는 geo.ts 에 둬서
// jest 가 expo-location 을 끌어오지 않게 한다 (age.ts / recordSummary.ts 패턴).
import * as Location from 'expo-location';
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

interface KakaoPlace {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  x: string; // 경도
  y: string; // 위도
}

const SEARCH_RADIUS_M = 5000;

/** 현재 위치 기준 반경 5km 거리순 병원 목록 (최대 15곳). 키 없음·HTTP 오류·네트워크 실패 시 throw. */
export async function searchHospitals(center: LatLng): Promise<Hospital[]> {
  // REST 키는 앱 번들에 포함된다 — 카카오 콘솔 사용량 알림으로 감시한다 (IOS_RELEASE_PLAN.md T1.7).
  const key = process.env.EXPO_PUBLIC_KAKAO_KEY;
  if (!key) throw new Error('EXPO_PUBLIC_KAKAO_KEY 가 설정되지 않았어요');

  const params = new URLSearchParams({
    query: '동물병원',
    x: String(center.lng),
    y: String(center.lat),
    radius: String(SEARCH_RADIUS_M),
    sort: 'distance',
    size: '15',
  });
  const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
    headers: { Authorization: `KakaoAK ${key}` },
  });
  if (!res.ok) throw new Error(`Kakao Local 검색 실패 (${res.status})`);
  const { documents } = (await res.json()) as { documents: KakaoPlace[] };

  return documents
    .map((d) => {
      const lat = Number(d.y);
      const lng = Number(d.x);
      return {
        id: d.id,
        name: d.place_name,
        address: d.road_address_name || d.address_name,
        phone: d.phone,
        lat,
        lng,
        distance: distanceMeters(center, { lat, lng }),
      };
    })
    .sort((a, b) => a.distance - b.distance);
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
