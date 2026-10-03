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

describe('formatDistance 잘못된 입력', () => {
  it('거리 값이 NaN 이면 "NaN" 문자열을 그대로 보여주지 않아야 한다 (상세 화면 params 누락 시 재현됨)', () => {
    // detail.tsx 가 useLocalSearchParams 의 distance 파라미터를 Number()로 변환하는데,
    // 딥링크 등으로 해당 파라미터가 없으면 Number(undefined) === NaN 이 되어
    // formatDistance(NaN) 결과가 "NaNkm" 으로 사용자에게 그대로 노출된다.
    expect(formatDistance(NaN)).not.toMatch(/NaN/);
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
