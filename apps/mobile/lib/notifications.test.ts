import * as Notifications from 'expo-notifications';
import { getNotifySettings, planNotifications, rescheduleAll, requestPermissionAndReschedule, setNotifySettings, type VaccineRow } from './notifications';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

const on = { enabled: true, time: '09:00' };
const now = new Date(2026, 10, 23, 10, 0); // 2026-11-23 10:00
let seq = 0;
const row = (o: Partial<VaccineRow>): VaccineRow => ({
  id: ++seq, pet_id: 1, pet_name: '콩이', title: '종합백신', date: '2026-01-01', next_date: '2026-12-01', ...o,
});

describe('planNotifications', () => {
  it('반려견·백신별 최신 회차의 예정일만 쓴다', () => {
    const r = planNotifications(
      [row({ date: '2025-01-01', next_date: '2026-12-01' }), row({ date: '2026-01-01', next_date: '2027-01-01' }), row({ pet_id: 2, pet_name: '보리', date: '2025-01-01', next_date: '2026-12-05' })],
      on, now
    );
    expect(r.map((n) => n.title)).toEqual(['보리 접종 예정일이에요', '콩이 접종 예정일이에요']);
    expect(r).toHaveLength(2);
  });

  it('같은 날짜면 id 큰 쪽이 최신이다', () => {
    const r = planNotifications([row({ id: 100, next_date: '2026-12-01' }), row({ id: 101, next_date: '2026-12-09' })], on, now);
    expect(r).toHaveLength(1);
    expect(r[0].date.getDate()).toBe(9);
  });

  it('지난 날짜와 오늘이지만 시각이 지난 것은 제외한다', () => {
    expect(planNotifications([row({ next_date: '2026-11-22' })], on, now)).toEqual([]);
    expect(planNotifications([row({ next_date: '2026-11-23' })], on, now)).toEqual([]);
    expect(planNotifications([row({ next_date: '2026-11-23' })], { enabled: true, time: '18:00' }, now)).toHaveLength(1);
  });

  it('알림 시각을 반영하고 본문에 백신명을 넣는다', () => {
    const [n] = planNotifications([row({})], { enabled: true, time: '07:30' }, now);
    expect([n.date.getHours(), n.date.getMinutes()]).toEqual([7, 30]);
    expect(n.body).toBe('오늘 종합백신 접종 예정일이에요.');
  });

  it('꺼져 있으면 비어 있다', () => {
    expect(planNotifications([row({})], { enabled: false, time: '09:00' }, now)).toEqual([]);
  });

  it('65개는 64개로 자르고 날짜 오름차순이다', () => {
    const rows = Array.from({ length: 65 }, (_, i) =>
      row({ title: `백신${i}`, next_date: `2027-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + Math.floor(i / 12)).padStart(2, '0')}` })
    );
    const r = planNotifications(rows, on, now);
    expect(r).toHaveLength(64);
    expect(r.every((n, i) => i === 0 || r[i - 1].date <= n.date)).toBe(true);
  });
});

describe('rescheduleAll', () => {
  const mocked = Notifications as jest.Mocked<typeof Notifications>;
  const db = (rows: unknown[], settings: unknown[] = []) =>
    ({ getAllAsync: jest.fn(async (sql: string) => (sql.includes('FROM settings') ? settings : rows)) }) as never;
  beforeEach(() => jest.clearAllMocks());

  it('권한 거부면 취소만 한다', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false } as never);
    await rescheduleAll(db([row({ next_date: '2999-01-01' })]));
    expect(mocked.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('허용이면 취소 1회 + 예약 N회', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never);
    await rescheduleAll(db([row({ title: 'a', next_date: '2999-01-01' }), row({ title: 'b', next_date: '2999-02-01' })]));
    expect(mocked.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledTimes(2);
  });
});

describe('rescheduleAll 직렬화·권한 요청', () => {
  const mocked = Notifications as jest.Mocked<typeof Notifications>;
  beforeEach(() => jest.clearAllMocks());

  it('동시 호출은 취소→예약이 겹치지 않고 순서대로 실행된다', async () => {
    const log: string[] = [];
    mocked.cancelAllScheduledNotificationsAsync.mockImplementation(async () => {
      log.push('cancel');
      await new Promise((r) => setTimeout(r, 5));
    });
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never);
    mocked.scheduleNotificationAsync.mockImplementation((async () => { log.push('schedule'); }) as never);
    const d = { getAllAsync: jest.fn(async (sql: string) => (sql.includes('FROM settings') ? [] : [row({ next_date: '2999-01-01' })])) } as never;
    await Promise.all([rescheduleAll(d), rescheduleAll(d)]);
    expect(log).toEqual(['cancel', 'schedule', 'cancel', 'schedule']);
    mocked.cancelAllScheduledNotificationsAsync.mockReset();
  });

  it('requestPermissionAndReschedule 은 허용 여부를 돌려준다', async () => {
    mocked.requestPermissionsAsync.mockResolvedValue({ granted: false } as never);
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false } as never);
    const d = { getAllAsync: jest.fn(async () => []) } as never;
    expect(await requestPermissionAndReschedule(d)).toBe(false);
  });
});

describe('setNotifySettings', () => {
  it('주어진 키만 저장한다', async () => {
    const runAsync = jest.fn();
    await setNotifySettings({ runAsync } as never, { enabled: false });
    await setNotifySettings({ runAsync } as never, { time: '07:30' });
    expect(runAsync.mock.calls.map((c) => c[1])).toEqual([{ $k: 'notify_enabled', $v: '0' }, { $k: 'notify_time', $v: '07:30' }]);
  });
});

describe('getNotifySettings', () => {
  it('키가 없으면 켜짐·09:00', async () => {
    const d = { getAllAsync: jest.fn(async () => []) } as never;
    expect(await getNotifySettings(d)).toEqual({ enabled: true, time: '09:00' });
  });
});
