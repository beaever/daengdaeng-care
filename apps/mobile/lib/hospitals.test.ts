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
  const center = { lat: 37.4979, lng: 127.0276 }; // 강남역
  const place = (id: string, y: number, x: number, extra: object = {}) => ({
    id,
    place_name: `병원 ${id}`,
    road_address_name: `도로명 ${id}`,
    address_name: `지번 ${id}`,
    phone: '02-123-4567',
    x: String(x),
    y: String(y),
    ...extra,
  });
  const mockFetch = (body: unknown, ok = true, status = 200) =>
    (globalThis.fetch = jest.fn().mockResolvedValue({ ok, status, json: async () => body }) as jest.Mock);

  beforeEach(() => {
    process.env.EXPO_PUBLIC_KAKAO_KEY = 'test-key';
  });
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_KAKAO_KEY;
  });

  it('Kakao 응답을 Hospital 로 바꿔 거리순으로 반환한다', async () => {
    const fetchMock = mockFetch({
      documents: [place('far', 37.51, 127.04), place('near', 37.498, 127.028, { road_address_name: '' })],
    });

    const result = await searchHospitals(center);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('x=127.0276');
    expect(url).toContain('y=37.4979');
    expect(init.headers.Authorization).toBe('KakaoAK test-key');
    expect(result.map((h) => h.id)).toEqual(['near', 'far']);
    expect(result[0].address).toBe('지번 near'); // 도로명 없으면 지번
    expect(result[0].lat).toBe(37.498);
  });

  it('HTTP 오류면 throw 한다 (화면이 에러 상태로 전환)', async () => {
    mockFetch({}, false, 401);
    await expect(searchHospitals(center)).rejects.toThrow('401');
  });

  it('키가 없으면 요청하지 않고 throw 한다', async () => {
    delete process.env.EXPO_PUBLIC_KAKAO_KEY;
    const fetchMock = mockFetch({ documents: [] });
    await expect(searchHospitals(center)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
