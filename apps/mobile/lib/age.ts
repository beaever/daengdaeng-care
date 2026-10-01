// 순수 로직만 둔다 — expo-sqlite/expo-file-system 등 네이티브 모듈을 import 하지 않는다.
// (jest 에서 네이티브 모듈을 끌어오지 않도록 pets.ts 와 분리)

/**
 * ISO 날짜 문자열(YYYY-MM-DD)과 견종의 만 나이를 "N살"(1년 이상) 또는 "N개월"(미만)로 포맷한다.
 * dob 가 null 이거나 파싱 불가하면 빈 문자열을 반환한다.
 */
export function formatAge(dob: string | null, now: Date = new Date()): string {
  if (!dob) return '';

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob);
  if (!match) return '';

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]) - 1;
  const birthDate = Number(match[3]);

  let months = (now.getFullYear() - birthYear) * 12 + (now.getMonth() - birthMonth);
  if (now.getDate() < birthDate) months -= 1;
  months = Math.max(months, 0);

  if (months >= 12) return `${Math.floor(months / 12)}살`;
  return `${months}개월`;
}
