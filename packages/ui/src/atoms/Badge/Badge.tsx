import React from 'react';
import { gradeGradients, type SafetyLevel, type GradeLevel } from '@daengdaeng/tokens';
import styles from './Badge.module.css';

// ── SafetyBadge ──────────────────────────────────────────────────
const SAFETY_MAP: Record<SafetyLevel, { icon: string; label: string }> = {
  safe:    { icon: '✅', label: '먹어도 좋아요' },
  caution: { icon: '⚠️', label: '소량만 주세요' },
  danger:  { icon: '🚨', label: '절대 안 돼요' },
};

export interface SafetyBadgeProps {
  level: SafetyLevel;
  label?: string;
}

export function SafetyBadge({ level, label }: SafetyBadgeProps) {
  const m = SAFETY_MAP[level];
  return (
    <span className={`${styles.safety} ${styles[`safety--${level}`]}`}>
      <span className={styles.icon}>{m.icon}</span>
      {label ?? m.label}
    </span>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────
export interface StatusBadgeProps {
  isOpen: boolean;
  is24h?: boolean | undefined;
}

export function StatusBadge({ isOpen, is24h }: StatusBadgeProps) {
  if (is24h) {
    return (
      <span className={`${styles.status} ${styles['status--24h']}`}>
        <span className={styles.dot} />
        24시간
      </span>
    );
  }
  if (isOpen) {
    return (
      <span className={`${styles.status} ${styles['status--open']}`}>
        <span className={styles.dot} />
        진료중
      </span>
    );
  }
  return (
    <span className={`${styles.status} ${styles['status--closed']}`}>
      <span className={styles.dot} />
      진료마감
    </span>
  );
}

// ── GradeBadge ────────────────────────────────────────────────────
export interface GradeBadgeProps {
  grade: GradeLevel;
  label?: string;
}

const gradeGradientFor = (grade: GradeLevel) =>
  `linear-gradient(135deg, ${gradeGradients[grade].join(', ')})`;

export function GradeBadge({ grade, label }: GradeBadgeProps) {
  return (
    <div className={styles.grade} style={{ background: gradeGradientFor(grade) }}>
      <span className={styles.gradeLetter}>{grade}</span>
      {label && <span className={styles.gradeLabel}>{label}</span>}
    </div>
  );
}
