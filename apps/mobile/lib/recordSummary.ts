// 순수 로직만 둔다 — expo-sqlite 등 네이티브 모듈을 import 하지 않는다.
// (jest 에서 네이티브 모듈을 끌어오지 않도록 records.ts 와 분리. age.ts 와 같은 패턴)
// HealthRecord는 타입만 가져온다 — `import type`은 컴파일 시 제거되어 records.ts의
// 런타임 의존성(expo-sqlite)을 끌어오지 않는다.
import type { HealthRecord } from './records';

/** toISOString은 UTC 변환으로 날짜가 하루 밀릴 수 있어 로컬 기준으로 직접 포맷한다. */
export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseLocalDate(s: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function diffInDays(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

/**
 * ISO 날짜 문자열에 n년을 더한다. `new Date(y, m, d)` 생성자는 목표 연도에 그 날이
 * 없으면(2/29 + 1년처럼) 다음 달로 넘겨버린다(2/29 -> 3/1) — 월이 밀렸으면 해당 월의
 * 마지막 날(2/28)로 보정한다.
 */
export function addYears(iso: string, n: number): string {
  const d = parseLocalDate(iso);
  const month = d.getMonth();
  const result = new Date(d.getFullYear() + n, month, d.getDate());
  if (result.getMonth() !== month) {
    result.setDate(0); // 밀려난 달의 0일 = 목표 월의 말일
  }
  return toLocalDateString(result);
}

function latestByDate(records: HealthRecord[]): HealthRecord | undefined {
  return [...records].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id))[0];
}

export function latestWeight(records: HealthRecord[]): HealthRecord | undefined {
  return latestByDate(records.filter((r) => r.type === 'weight'));
}

/** 같은 타입의 직전(날짜가 더 이른) 기록 대비 kg 차이. 소수 1자리로 반올림한다. */
export function weightDelta(records: HealthRecord[], rec: HealthRecord): number | undefined {
  const prev = latestByDate(records.filter((r) => r.type === rec.type && r.date < rec.date));
  if (!prev) return undefined;
  const delta = Number(rec.title) - Number(prev.title);
  return Math.round(delta * 10) / 10;
}

/** vet 최신 기록 기준 "오늘" / "N일 전"(<7일) / "N주 전"(<30일) / "N개월 전". */
export function lastVisitLabel(records: HealthRecord[], now: Date = new Date()): string | undefined {
  const latest = latestByDate(records.filter((r) => r.type === 'vet'));
  if (!latest) return undefined;

  const days = diffInDays(parseLocalDate(latest.date), now);
  if (days <= 0) return '오늘';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

/**
 * 백신 종류(title)별로 가장 최근 접종 기록의 next_date만 취하고(이전 회차 예정일은 무시),
 * 그중 가장 이른 날짜까지 남은 일수를 반환한다. 예정일이 지났으면 음수를 반환한다.
 */
export function nextVaccineDays(records: HealthRecord[], now: Date = new Date()): number | undefined {
  const latestByTitle = new Map<string, HealthRecord>();
  for (const r of records) {
    if (r.type !== 'vaccine') continue;
    const current = latestByTitle.get(r.title);
    if (!current || r.date > current.date || (r.date === current.date && r.id > current.id)) {
      latestByTitle.set(r.title, r);
    }
  }

  const nextDates = Array.from(latestByTitle.values())
    .map((r) => r.next_date)
    .filter((d): d is string => !!d)
    .sort();
  if (nextDates.length === 0) return undefined;

  return diffInDays(now, parseLocalDate(nextDates[0]));
}

export function formatDday(n: number): string {
  if (n === 0) return 'D-day';
  if (n > 0) return `D-${n}`;
  return `D+${Math.abs(n)}`;
}

/** 입력 순서(날짜 내림차순)를 유지하며 같은 날짜의 기록을 묶는다. */
export function groupByDate(records: HealthRecord[]): { date: string; items: HealthRecord[] }[] {
  const groups: { date: string; items: HealthRecord[] }[] = [];
  for (const r of records) {
    const last = groups[groups.length - 1];
    if (last && last.date === r.date) {
      last.items.push(r);
    } else {
      groups.push({ date: r.date, items: [r] });
    }
  }
  return groups;
}
