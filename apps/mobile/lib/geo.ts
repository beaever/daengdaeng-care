// 순수 로직만 둔다 — expo-location 등 네이티브 모듈을 import 하지 않는다.
// (jest 에서 네이티브 모듈을 끌어오지 않도록 hospitals.ts 와 분리. age.ts 와 같은 패턴)

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 두 좌표 사이의 거리(m)를 haversine 공식으로 계산한다. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * 거리(m)를 사용자에게 보여줄 문자열로 포맷한다.
 * 1000m 미만은 10m 단위로 반올림한 "350m", 그 이상은 소수 1자리 "1.2km".
 * 반올림 결과가 1000m 가 되는 경계(995m 등)는 "1.0km" 로 표기한다.
 */
export function formatDistance(m: number): string {
  const roundedTens = Math.round(m / 10) * 10;
  if (roundedTens < 1000) return `${roundedTens}m`;
  return `${(m / 1000).toFixed(1)}km`;
}
