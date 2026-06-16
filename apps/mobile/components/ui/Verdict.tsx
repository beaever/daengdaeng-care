import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { SafetyLevel, SeverityLevel } from '@daengdaeng/tokens';
import { radius, fontFamily, typography, verdictGradients, palette } from '../../theme';

type VerdictLevel = SafetyLevel | SeverityLevel;

const VERDICT: Record<VerdictLevel, { icon: string; label: string }> = {
  safe: { icon: '✅', label: '먹어도 좋아요' },
  caution: { icon: '⚠️', label: '소량만 주세요' },
  danger: { icon: '🚨', label: '절대 안 돼요' },
  emergency: { icon: '🚨', label: '바로 병원으로' },
  today: { icon: '⚠️', label: '오늘 안에 병원' },
  watch: { icon: '✅', label: '지켜봐 주세요' },
};

export interface VerdictProps {
  level: VerdictLevel;
  label?: string;
  sub?: string;
}

// 앱의 주인공 컴포넌트 — 풀컬러 그라데이션 히어로
export function Verdict({ level, label, sub }: VerdictProps) {
  const m = VERDICT[level];
  const gradient = verdictGradients[level] as readonly [string, string];
  return (
    <LinearGradient
      colors={[gradient[0], gradient[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.icon}>{m.icon}</Text>
      <Text style={styles.label}>{label ?? m.label}</Text>
      {sub != null && <Text style={styles.sub}>{sub}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
  },
  icon: { fontSize: 40, marginBottom: 8 },
  label: { fontFamily, fontSize: typography.h1.size, fontWeight: '800', color: palette.stone[0] },
  sub: {
    fontFamily,
    fontSize: typography.sub.size,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    textAlign: 'center',
  },
});
