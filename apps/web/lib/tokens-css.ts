// 댕댕케어 웹 — 디자인 토큰을 CSS 커스텀 프로퍼티로 변환.
// RULES(2) 토큰 단일 출처: 모든 색/간격/반경/그림자는 @daengdaeng/tokens 에서만 온다.
// 컴포넌트는 hex 를 직접 쓰지 않고 var(--brand) 등 여기서 만든 변수만 참조한다.
import {
  light,
  dark,
  palette,
  space,
  radius,
  type as typography,
  safetyColors,
  fontFamily,
  motion,
} from '@daengdaeng/tokens';

/** camelCase·중첩 키를 --kebab-case 변수명으로 */
function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
}

/** 시맨틱 색 테마(light/dark)를 CSS 선언 묶음으로 */
function themeVars(theme: Record<string, string>): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(theme)) {
    // 그림자는 별도 접두사(--shadow-*), 그 외는 그대로 토큰명 사용
    const name = k.startsWith('shadow') ? `--${kebab(k)}` : `--${kebab(k)}`;
    out.push(`  ${name}: ${v};`);
  }
  return out;
}

/** 정적(테마 무관) 토큰 — 팔레트·간격·반경·타이포·모션 */
function staticVars(): string[] {
  const out: string[] = [];

  // 브랜드 팔레트 스케일 (--brand-50 … --brand-900)
  for (const [k, v] of Object.entries(palette.brand)) out.push(`  --brand-${k}: ${v};`);

  // 안전도 시맨틱 (--safe / --safe-soft / --caution-soft / --info-soft …)
  for (const [name, set] of Object.entries(safetyColors)) {
    for (const [variant, v] of Object.entries(set)) {
      const suffix = variant === 'base' ? '' : `-${kebab(variant)}`;
      out.push(`  --${name}${suffix}: ${v};`);
    }
  }

  // 간격 (--space-1 … --space-16)
  for (const [k, v] of Object.entries(space)) out.push(`  --space-${k}: ${v}px;`);
  // 반경 (--radius-md …)
  for (const [k, v] of Object.entries(radius)) {
    out.push(`  --radius-${k}: ${k === 'pill' ? '999px' : `${v}px`};`);
  }
  // 타이포 사이즈/행간/굵기 (--text-body-size …)
  for (const [k, t] of Object.entries(typography)) {
    out.push(`  --font-${k}-size: ${t.size}px;`);
    out.push(`  --font-${k}-lh: ${(t.size * t.lineHeight).toFixed(1)}px;`);
    out.push(`  --font-${k}-weight: ${t.weight};`);
  }
  // 모션
  out.push(`  --ease-out: ${motion.easeOut};`);
  out.push(`  --ease-spring: ${motion.easeSpring};`);
  // 폰트 패밀리
  out.push(`  --font-family: ${fontFamily};`);

  return out;
}

/** :root(라이트) + [data-theme="dark"] 전체 CSS 문자열 생성 */
export function buildTokensCss(): string {
  const root = [...themeVars(light), ...staticVars()].join('\n');
  const darkRoot = themeVars(dark).join('\n');
  return `:root {\n${root}\n}\n\n[data-theme="dark"] {\n${darkRoot}\n}\n`;
}
