// 댕댕케어 로고 — 발바닥 + 하트 패드 마크(MarkA, brand.jsx 재현) + 워드마크.
// 색은 currentColor / var(--brand) 로만 — hex 직접 사용 안 함 (RULES 2).

export function PawMark({ size = 40, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill={color} aria-hidden="true">
      <ellipse cx="24" cy="43" rx="7.5" ry="9.5" transform="rotate(-20 24 43)" />
      <ellipse cx="39" cy="32" rx="8" ry="10.5" />
      <ellipse cx="57" cy="32" rx="8" ry="10.5" />
      <ellipse cx="72" cy="43" rx="7.5" ry="9.5" transform="rotate(20 72 43)" />
      <path d="M48 82 C 25 65 21 51 32 45 C 39 41 45 45 48 50 C 51 45 57 41 64 45 C 75 51 71 65 48 82 Z" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="logo">
      <PawMark size={size} color="var(--brand)" />
      <strong className="logo__word">댕댕케어</strong>
    </span>
  );
}
