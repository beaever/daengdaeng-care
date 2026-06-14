import React from 'react';
import type { SafetyLevel, SeverityLevel } from '@daengdaeng/tokens';
import styles from './Verdict.module.css';

type VerdictLevel = SafetyLevel | SeverityLevel;

const VERDICT_MAP: Record<VerdictLevel, { icon: string; label: string; gradient: string }> = {
  safe:      { icon: '✅', label: '먹어도 좋아요',        gradient: 'linear-gradient(135deg,#1FB85A,#14924A)' },
  caution:   { icon: '⚠️', label: '소량만 주세요',        gradient: 'linear-gradient(135deg,#EBA417,#C98A05)' },
  danger:    { icon: '🚨', label: '절대 안 돼요',         gradient: 'linear-gradient(135deg,#ED5A52,#C32D2D)' },
  emergency: { icon: '🚨', label: '바로 병원으로',        gradient: 'linear-gradient(135deg,#EF4B43,#B01F1F)' },
  today:     { icon: '⚠️', label: '오늘 안에 병원',       gradient: 'linear-gradient(135deg,#EBA417,#C98A05)' },
  watch:     { icon: '✅', label: '지켜봐 주세요',        gradient: 'linear-gradient(135deg,#1FB85A,#14924A)' },
};

export interface VerdictProps {
  level: VerdictLevel;
  label?: string;
  sub?: string;
}

export function Verdict({ level, label, sub }: VerdictProps) {
  const m = VERDICT_MAP[level];
  return (
    <div className={styles.verdict} style={{ background: m.gradient }}>
      <span className={styles.icon}>{m.icon}</span>
      <span className={styles.label}>{label ?? m.label}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
