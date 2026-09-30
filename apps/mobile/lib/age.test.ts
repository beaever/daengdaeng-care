import { formatAge } from './age';

// new Date(y, m, d) 로컬 생성자만 쓴다 — ISO 문자열(new Date('YYYY-MM-DD'))은 UTC로
// 파싱되어 CI 타임존에 따라 날짜가 하루 밀릴 수 있다.
describe('formatAge', () => {
  it('생일 당일이면 0개월', () => {
    expect(formatAge('2026-10-01', new Date(2026, 9, 1))).toBe('0개월');
  });

  it('11개월이면 "11개월"', () => {
    expect(formatAge('2025-11-01', new Date(2026, 9, 1))).toBe('11개월');
  });

  it('12개월이면 "1살"로 올림 표기', () => {
    expect(formatAge('2025-10-01', new Date(2026, 9, 1))).toBe('1살');
  });

  it('윤년 2/29 생일 — 평년에는 아직 생일이 안 지난 것으로 계산', () => {
    expect(formatAge('2024-02-29', new Date(2025, 1, 28))).toBe('11개월');
    expect(formatAge('2024-02-29', new Date(2025, 2, 1))).toBe('1살');
  });

  it('dob 가 null 이면 빈 문자열', () => {
    expect(formatAge(null)).toBe('');
  });
});
