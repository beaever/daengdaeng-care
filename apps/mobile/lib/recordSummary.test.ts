import {
  addYears,
  formatDday,
  groupByDate,
  lastVisitLabel,
  latestWeight,
  nextVaccineDays,
  parseLocalDate,
  toLocalDateString,
  weightDelta,
} from './recordSummary';
import type { HealthRecord } from './records';

// new Date(y, m, d) 로컬 생성자만 쓴다 — ISO 문자열(new Date('YYYY-MM-DD'))은 UTC로
// 파싱되어 CI 타임존에 따라 날짜가 하루 밀릴 수 있다.

function rec(partial: Partial<HealthRecord> & Pick<HealthRecord, 'id' | 'type' | 'date' | 'title'>): HealthRecord {
  return {
    pet_id: 1,
    sub: null,
    notes: null,
    next_date: null,
    created_at: '2026-01-01 00:00:00',
    ...partial,
  };
}

describe('toLocalDateString / parseLocalDate', () => {
  it('왕복 변환이 동일한 날짜를 유지한다', () => {
    const d = new Date(2026, 1, 28);
    expect(toLocalDateString(d)).toBe('2026-02-28');
    expect(toLocalDateString(parseLocalDate('2026-02-28'))).toBe('2026-02-28');
  });
});

describe('addYears', () => {
  it('일반적인 날짜는 그대로 1년을 더한다', () => {
    expect(addYears('2026-05-10', 1)).toBe('2027-05-10');
  });

  it('윤년 2/29 + 1년은 다음 해 2/28로 보정한다 (Date 오버플로로 3/1이 되면 안 됨)', () => {
    expect(addYears('2024-02-29', 1)).toBe('2025-02-28');
  });

  it('윤년 2/29 + 4년은 다시 윤년이라 2/29를 유지한다', () => {
    expect(addYears('2024-02-29', 4)).toBe('2028-02-29');
  });
});

describe('groupByDate', () => {
  it('기록이 0건이면 빈 배열', () => {
    expect(groupByDate([])).toEqual([]);
  });

  it('같은 날 여러 건은 입력 순서를 유지한 채 한 그룹으로 묶인다', () => {
    const records = [
      rec({ id: 3, type: 'vaccine', date: '2026-03-01', title: '광견병' }),
      rec({ id: 2, type: 'weight', date: '2026-03-01', title: '3.2' }),
      rec({ id: 1, type: 'vet', date: '2026-02-01', title: '행복동물병원' }),
    ];

    const groups = groupByDate(records);

    expect(groups).toEqual([
      { date: '2026-03-01', items: [records[0], records[1]] },
      { date: '2026-02-01', items: [records[2]] },
    ]);
  });
});

describe('latestWeight / weightDelta', () => {
  it('기록이 없으면 undefined', () => {
    expect(latestWeight([])).toBeUndefined();
  });

  it('weight 기록 중 날짜가 가장 최신인 것을 반환한다', () => {
    const records = [
      rec({ id: 1, type: 'weight', date: '2026-01-01', title: '3.0' }),
      rec({ id: 2, type: 'weight', date: '2026-03-01', title: '3.5' }),
      rec({ id: 3, type: 'vet', date: '2026-04-01', title: '병원' }),
    ];
    expect(latestWeight(records)?.id).toBe(2);
  });

  it('직전(이전 날짜) 기록 대비 kg 차이를 소수 1자리로 반올림한다', () => {
    const older = rec({ id: 1, type: 'weight', date: '2026-01-01', title: '3.0' });
    const newer = rec({ id: 2, type: 'weight', date: '2026-03-01', title: '3.26' });
    expect(weightDelta([older, newer], newer)).toBe(0.3);
  });

  it('직전 기록이 없으면 undefined', () => {
    const only = rec({ id: 1, type: 'weight', date: '2026-01-01', title: '3.0' });
    expect(weightDelta([only], only)).toBeUndefined();
  });
});

describe('lastVisitLabel', () => {
  const vet = (date: string) => rec({ id: 1, type: 'vet', date, title: '행복동물병원' });

  it('기록이 없으면 undefined', () => {
    expect(lastVisitLabel([])).toBeUndefined();
  });

  it('방문일이 오늘이면 "오늘"', () => {
    expect(lastVisitLabel([vet('2026-10-03')], new Date(2026, 9, 3))).toBe('오늘');
  });

  it('6일 전이면 "6일 전"', () => {
    expect(lastVisitLabel([vet('2026-09-27')], new Date(2026, 9, 3))).toBe('6일 전');
  });

  it('7일 전이면 "1주 전"', () => {
    expect(lastVisitLabel([vet('2026-09-26')], new Date(2026, 9, 3))).toBe('1주 전');
  });

  it('29일 전이면 "4주 전"', () => {
    expect(lastVisitLabel([vet('2026-09-04')], new Date(2026, 9, 3))).toBe('4주 전');
  });

  it('30일 전이면 "1개월 전"', () => {
    expect(lastVisitLabel([vet('2026-09-03')], new Date(2026, 9, 3))).toBe('1개월 전');
  });
});

describe('nextVaccineDays', () => {
  it('백신 기록이 없으면 undefined', () => {
    expect(nextVaccineDays([])).toBeUndefined();
  });

  it('같은 백신 재접종 시 이전 회차의 next_date는 무시하고 최신 회차 기준으로 계산한다', () => {
    const records = [
      rec({ id: 1, type: 'vaccine', date: '2025-01-01', title: '광견병', next_date: '2026-01-01' }),
      rec({ id: 2, type: 'vaccine', date: '2026-01-01', title: '광견병', next_date: '2027-01-01' }),
    ];
    // 2026-01-01 회차(최신)의 next_date인 2027-01-01만 봐야 한다 — 2026-01-01(이전 회차 예정일)은 무시.
    expect(nextVaccineDays(records, new Date(2026, 9, 3))).toBe(90);
  });

  it('예정일이 지났으면 음수를 반환한다', () => {
    const records = [rec({ id: 1, type: 'vaccine', date: '2025-01-01', title: '광견병', next_date: '2025-06-01' })];
    expect(nextVaccineDays(records, new Date(2026, 9, 3))).toBeLessThan(0);
  });

  it('여러 백신 종류 중 가장 이른 예정일까지 남은 일수를 반환한다', () => {
    const records = [
      rec({ id: 1, type: 'vaccine', date: '2026-01-01', title: '광견병', next_date: '2027-01-01' }),
      rec({ id: 2, type: 'vaccine', date: '2026-01-01', title: '종합백신', next_date: '2026-10-10' }),
    ];
    expect(nextVaccineDays(records, new Date(2026, 9, 3))).toBe(7);
  });
});

describe('formatDday', () => {
  it('양수는 "D-N"', () => {
    expect(formatDday(15)).toBe('D-15');
  });
  it('0은 "D-day"', () => {
    expect(formatDday(0)).toBe('D-day');
  });
  it('음수는 "D+N"', () => {
    expect(formatDday(-3)).toBe('D+3');
  });
});
