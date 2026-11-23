// 로컬 알림 — 접종(D-7·당일)·예방약(전날·당일) 예정일. 원격 푸시·토큰 없음. records.ts·pets.ts 를 import 하지 않는다(순환 방지).
import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import { parseLocalDate } from './recordSummary';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface NotifySettings {
  enabled: boolean;
  time: string; // 'HH:MM'
}

export interface ReminderRow {
  id: number;
  pet_id: number;
  pet_name: string;
  type: string;
  title: string;
  date: string;
  next_date: string | null;
}

export interface PlannedNotification {
  id?: number;
  date: Date;
  title: string;
  body: string;
}

// iOS 는 예약 로컬 알림을 64개까지만 유지한다.
const MAX_SCHEDULED = 64;

export async function getNotifySettings(db: SQLiteDatabase): Promise<NotifySettings> {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    `SELECT key, value FROM settings WHERE key IN ('notify_enabled', 'notify_time')`
  );
  const get = (k: string) => rows.find((r) => r.key === k)?.value;
  return { enabled: get('notify_enabled') !== '0', time: get('notify_time') ?? '09:00' };
}

export async function setNotifySettings(db: SQLiteDatabase, s: Partial<NotifySettings>): Promise<void> {
  const put = (k: string, v: string) =>
    db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ($k, $v)`, { $k: k, $v: v });
  if (s.enabled !== undefined) await put('notify_enabled', s.enabled ? '1' : '0');
  if (s.time !== undefined) await put('notify_time', s.time);
}

// 예정일 기준 며칠 전에 알릴지(일 단위). 예정일 당일은 0.
const OFFSETS: Record<string, number[]> = { vaccine: [-7, 0], medicine: [-1, 0] };

function message(r: ReminderRow, offset: number): { title: string; body: string } {
  const [, m, d] = (r.next_date as string).split('-').map(Number);
  if (r.type === 'medicine') {
    return offset === 0
      ? { title: `${r.pet_name} 오늘 예방약 날이에요`, body: `오늘은 ${r.title} 투약 예정일이에요.` }
      : { title: `${r.pet_name} 내일 예방약 날이에요`, body: `내일은 ${r.title} 투약 예정일이에요.` };
  }
  return offset === 0
    ? { title: `${r.pet_name} 접종 예정일이에요`, body: `오늘 ${r.title} 접종 예정일이에요.` }
    : { title: `${r.pet_name} 접종 예정일이 일주일 남았어요`, body: `${m}월 ${d}일은 ${r.title} 접종 예정일이에요.` };
}

/** 반려견·종류·title별 최신 회차의 next_date 만 취해 now 이후 알림 목록을 만든다. recordSummary.nextVaccineDays 와 같은 규칙. */
export function planNotifications(rows: ReminderRow[], settings: NotifySettings, now: Date): PlannedNotification[] {
  if (!settings.enabled) return [];
  const [h, min] = settings.time.split(':').map(Number);
  const latest = new Map<string, ReminderRow>();
  for (const r of rows) {
    if (!OFFSETS[r.type]) continue;
    const key = `${r.pet_id}\u0000${r.type}\u0000${r.title}`;
    const cur = latest.get(key);
    if (!cur || r.date > cur.date || (r.date === cur.date && r.id > cur.id)) latest.set(key, r);
  }
  return Array.from(latest.values())
    .filter((r) => r.next_date)
    .flatMap((r) =>
      OFFSETS[r.type].map((offset) => {
        const base = parseLocalDate(r.next_date as string);
        const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset, h, min, 0, 0);
        return { id: r.id, date, ...message(r, offset) };
      })
    )
    .filter((n) => n.date.getTime() > now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, MAX_SCHEDULED); // shortcut: 가까운 64개만 예약, 앱을 열 때마다 다시 채우므로 열지 않는 장기 사용자는 누락 — 백그라운드 재예약 필요 시
}

let queue: Promise<void> = Promise.resolve();

/** 예약을 전부 지우고 현재 DB 기준으로 다시 건다. 실패해도 던지지 않는다. */
export function rescheduleAll(db: SQLiteDatabase): Promise<void> {
  // 동시 호출(앱 시작·저장·설정 변경)이 취소/예약 사이에 끼어 중복 예약되지 않도록 한 줄로 세운다.
  queue = queue.then(() => reschedule(db));
  return queue;
}

async function reschedule(db: SQLiteDatabase): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const settings = await getNotifySettings(db);
    if (!settings.enabled) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    const rows = await db.getAllAsync<ReminderRow>(
      `SELECT r.id, r.pet_id, p.name AS pet_name, r.type, r.title, r.date, r.next_date
       FROM records r JOIN pets p ON p.id = r.pet_id WHERE r.type IN ('vaccine','medicine')`
    );
    for (const n of planNotifications(rows, settings, new Date())) {
      await Notifications.scheduleNotificationAsync({
        content: { title: n.title, body: n.body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: n.date },
      });
    }
  } catch (e) {
    console.warn('알림 예약 실패', e);
  }
}

/** 권한을 요청하고 허용이면 예약한다. 허용 여부를 돌려준다(거부는 정상 흐름). */
export async function requestPermissionAndReschedule(db: SQLiteDatabase): Promise<boolean> {
  const { granted } = await Notifications.requestPermissionsAsync();
  await rescheduleAll(db);
  return granted;
}
