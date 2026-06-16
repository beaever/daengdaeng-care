import React from 'react';
import { verdictGradients, type SafetyLevel, type SeverityLevel } from '@daengdaeng/tokens';
import styles from './Verdict.module.css';

type VerdictLevel = SafetyLevel | SeverityLevel;

// RULES(2): 색은 단일 출처(@daengdaeng/tokens)에서만 가져온다 — 그라데이션 hex 하드코딩 금지.
// 아이콘·문구만 여기서 정의하고, 그라데이션은 verdictGradients 토큰을 조합해 만든다.
const VERDICT_MAP: Record<VerdictLevel, { icon: string; label: string }> = {
  safe:      { icon: '✅', label: '먹어도 좋아요' },
  caution:   { icon: '⚠️', label: '소량만 주세요' },
  danger:    { icon: '🚨', label: '절대 안 돼요' },
  emergency: { icon: '🚨', label: '바로 병원으로' },
  today:     { icon: '⚠️', label: '오늘 안에 병원' },
  watch:     { icon: '✅', label: '지켜봐 주세요' },
};

const gradientFor = (level: VerdictLevel) =>
  `linear-gradient(135deg,${verdictGradients[level].join(',')})`;

export interface VerdictProps {
  level: VerdictLevel;
  label?: string | undefined;
  sub?: string | undefined;
}

export function Verdict({ level, label, sub }: VerdictProps) {
  const m = VERDICT_MAP[level];
  return (
    <div className={styles.verdict} style={{ background: gradientFor(level) }}>
      <span className={styles.icon}>{m.icon}</span>
      <span className={styles.label}>{label ?? m.label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
