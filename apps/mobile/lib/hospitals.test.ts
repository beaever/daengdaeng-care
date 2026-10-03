import { distanceMeters, formatDistance } from './geo';
import { searchHospitals } from './hospitals';

// expo-location 은 네이티브 모듈이라 jest 환경에 그대로 두면 import 에러가 난다.
// searchHospitals 는 geocodeRegion(expo-location 경유) 없이도 동작하므로 mock으로 대체한다.
// jest-hoist 가 이 호출을 import 보다 먼저 실행되도록 끌어올린다.
jest.mock('expo-location', () => ({
  geocodeAsync: jest.fn(),
}));

describe('distanceMeters', () => {
  it('서울시청 - 강남역 ≈ 8.78km (haversine 정확값, 오차 1% 이내)', () => {
    const cityHall = { lat: 37.5663, lng: 126.9779 };
    const gangnam = { lat: 37.4979, lng: 127.0276 };
    const d = distanceMeters(cityHall, gangnam);
    const expected = 8778; // 직선거리 haversine 계산값
    expect(d).toBeGreaterThan(expected * 0.99);
    expect(d).toBeLessThan(expected * 1.01);
  });
});

describe('formatDistance', () => {
  it.each([
    [0, '0m'],
    [994, '990m'],
    [995, '1.0km'],
    [999, '1.0km'],
    [1000, '1.0km'],
    [1049, '1.0km'],
    [12345, '12.3km'],
  ])('%i -> %s', (input, expected) => {
    expect(formatDistance(input)).toBe(expected);
  });
});

describe('searchHospitals', () => {
  it('거리순으로 정렬된 목록을 반환한다', async () => {
    const center = { lat: 37.4979, lng: 127.0276 }; // 강남역
    const result = await searchHospitals(center);

    expect(result.length).toBeGreaterThan(0);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].distance).toBeGreaterThanOrEqual(result[i - 1].distance);
    }
  });
});
