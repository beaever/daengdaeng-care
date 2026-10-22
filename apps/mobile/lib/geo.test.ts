import { acceptPoint, distanceMeters, routeDistance, type RoutePoint } from './geo';

// 위도 1e-4도 ≈ 11.1m
const P = (seg: number, ts: number, lat: number): RoutePoint => ({ seg, ts, lat, lng: 127 });
const raw = (ts: number, lat: number, accuracy: number | null = 10) => ({ ts, lat, lng: 127, accuracy });

describe('routeDistance', () => {
  it('빈 배열·단일 포인트는 0', () => {
    expect(routeDistance([])).toBe(0);
    expect(routeDistance([P(0, 0, 37)])).toBe(0);
  });

  it('같은 seg 의 연속 포인트 거리를 합한다', () => {
    const pts = [P(0, 0, 37), P(0, 1, 37.0001), P(0, 2, 37.0002)];
    expect(routeDistance(pts)).toBeCloseTo(distanceMeters(pts[0], pts[2]), 3);
  });

  it('seg 경계의 거리는 잇지 않는다', () => {
    const pts = [P(0, 0, 37), P(0, 1, 37.0001), P(1, 100, 37.01), P(1, 101, 37.0101)];
    const expected = distanceMeters(pts[0], pts[1]) + distanceMeters(pts[2], pts[3]);
    expect(routeDistance(pts)).toBeCloseTo(expected, 3);
  });
});

describe('acceptPoint', () => {
  const prev = P(0, 10_000, 37);

  it('첫 포인트(prev 없음)는 정확도·시작시각만 통과하면 받는다', () => {
    expect(acceptPoint(null, raw(10_000, 37), 5_000)).toBe(true);
  });

  it('정확도 null 또는 30m 초과는 버린다 (30m 는 허용)', () => {
    expect(acceptPoint(null, raw(10_000, 37, null), 0)).toBe(false);
    expect(acceptPoint(null, raw(10_000, 37, 30.1), 0)).toBe(false);
    expect(acceptPoint(null, raw(10_000, 37, 30), 0)).toBe(true);
  });

  it('시작 시각 이전(캐시 위치)은 버린다', () => {
    expect(acceptPoint(null, raw(4_999, 37), 5_000)).toBe(false);
  });

  it('직전과 3m 미만이면 버린다', () => {
    expect(acceptPoint(prev, raw(15_000, 37.00001), 0)).toBe(false);
  });

  it('속도 7m/s 초과(GPS 튐)는 버린다', () => {
    // 약 111m / 10초 = 11m/s
    expect(acceptPoint(prev, raw(20_000, 37.001), 0)).toBe(false);
  });

  it('정상 보행(약 11m / 10초)은 받는다', () => {
    expect(acceptPoint(prev, raw(20_000, 37.0001), 0)).toBe(true);
  });

  it('시간이 거꾸로이거나 같으면 버린다', () => {
    expect(acceptPoint(prev, raw(10_000, 37.0001), 0)).toBe(false);
  });
});
