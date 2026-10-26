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
 * m 이 NaN/Infinity 등 유한수가 아니면 빈 문자열을 반환한다 (호출부는 빈 값이면 거리 표시를 숨긴다).
 */
export function formatDistance(m: number): string {
  if (!Number.isFinite(m)) return '';
  const roundedTens = Math.round(m / 10) * 10;
  if (roundedTens < 1000) return `${roundedTens}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

/** 저장되는 경로 포인트. seg 는 일시정지/재개마다 +1 — 다른 seg 끼리는 잇지 않는다. */
export interface RoutePoint extends LatLng {
  seg: number;
  /** epoch ms */
  ts: number;
}

/** acceptPoint 입력용. accuracy = 수평 정확도(m), 알 수 없으면 null. */
export interface RawPoint extends LatLng {
  ts: number;
  accuracy: number | null;
}

export const MAX_ACCURACY_M = 30;
export const MAX_SPEED_MPS = 7;
export const MIN_MOVE_M = 3;

/** 같은 seg 안의 연속 포인트 사이 거리(m)의 합. */
export function routeDistance(points: RoutePoint[]): number {
  let sum = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].seg === points[i - 1].seg) sum += distanceMeters(points[i - 1], points[i]);
  }
  return sum;
}

/**
 * 새 위치를 경로에 넣을지 판단한다. 버림: 정확도 > 30m 또는 null, 시작 전 캐시 위치(ts < startedAt),
 * 직전 대비 속도 > 7m/s(GPS 튐), 직전과 < 3m(제자리 떨림). prev 없으면 앞 두 조건만 본다.
 */
export function acceptPoint(prev: RoutePoint | null, next: RawPoint, startedAt: number): boolean {
  if (next.accuracy === null || next.accuracy > MAX_ACCURACY_M) return false;
  if (next.ts < startedAt) return false;
  if (!prev) return true;
  const d = distanceMeters(prev, next);
  if (d < MIN_MOVE_M) return false;
  const dt = (next.ts - prev.ts) / 1000;
  // 일시정지 후 재개 첫 포인트는 시간차가 커서 속도 검사를 자연 통과한다.
  return dt > 0 && d / dt <= MAX_SPEED_MPS;
}
