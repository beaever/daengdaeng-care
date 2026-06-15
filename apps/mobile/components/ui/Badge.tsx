import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SafetyLevel, GradeLevel } from '@daengdaeng/tokens';
import { colors, radius, fontFamily, typography, safetyColors, palette } from '../../theme';

// ── SafetyBadge ────────────────────────────────────────────────────
const SAFETY: Record<SafetyLevel, { icon: string; label: string }> = {
  safe: { icon: '✅', label: '먹어도 좋아요' },
  caution: { icon: '⚠️', label: '소량만 주세요' },
  danger: { icon: '🚨', label: '절대 안 돼요' },
};

export interface SafetyBadgeProps {
  level: SafetyLevel;
  label?: string;
}

export function SafetyBadge({ level, label }: SafetyBadgeProps) {
  const m = SAFETY[level];
  return (
    <View style={[styles.pill, { backgroundColor: safetyColors[level].soft }]}>
      <Text style={styles.pillText}>{m.icon} </Text>
      <Text style={[styles.pillText, { color: safetyColors[level].strong }]}>
        {label ?? m.label}
      </Text>
    </View>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────
export interface StatusBadgeProps {
  isOpen: boolean;
  is24h?: boolean;
}

export function StatusBadge({ isOpen, is24h }: StatusBadgeProps) {
  let dotColor: string = colors.text3;
  let text = '진료마감';
  if (is24h) {
    dotColor = colors.brand;
    text = '24시간';
  } else if (isOpen) {
    dotColor = palette.safe.base;
    text = '진료중';
  }
  return (
    <View style={styles.status}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.statusText, { color: dotColor }]}>{text}</Text>
    </View>
  );
}

// ── GradeBadge ─────────────────────────────────────────────────────
const GRADE_GRADIENT: Record<GradeLevel, [string, string]> = {
  A: [palette.safe.base, palette.safe.strong],
  B: [palette.safe.base, palette.caution.base],
  C: [palette.caution.base, palette.caution.strong],
  D: [palette.danger.base, palette.danger.strong],
};

export interface GradeBadgeProps {
  grade: GradeLevel;
  label?: string;
}

export function GradeBadge({ grade, label }: GradeBadgeProps) {
  return (
    <View style={styles.gradeWrap}>
      <LinearGradient
        colors={GRADE_GRADIENT[grade]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradeBox}
      >
        <Text style={styles.gradeLetter}>{grade}</Text>
      </LinearGradient>
      {label != null && <Text style={styles.gradeLabel}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  pillText: { fontFamily, fontSize: typography.sub.size, fontWeight: '700' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
  statusText: { fontFamily, fontSize: typography.caption.size, fontWeight: '700' },
  gradeWrap: { alignItems: 'center', gap: 6 },
  gradeBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeLetter: { fontFamily, fontSize: 30, fontWeight: '800', color: palette.stone[0] },
  gradeLabel: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
});
