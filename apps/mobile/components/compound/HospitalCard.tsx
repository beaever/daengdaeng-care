import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, fontFamily, typography } from '../../theme';
import { StatusBadge } from '../ui';
import type { Hospital } from '../../lib/sampleData';

// SCR-012 · 병원 카드 — 상태 배지 + 거리 / 이름 / 진료시간 · 전화.
export interface HospitalCardProps {
  hospital: Hospital;
  onPress?: () => void;
}

function HospitalCardRoot({ hospital, onPress }: HospitalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <StatusBadge isOpen={hospital.open} is24h={hospital.is24h} />
        <HospitalCard.Distance value={hospital.dist} />
      </View>
      <HospitalCard.Name value={hospital.name} />
      <View style={styles.metaRow}>
        <HospitalCard.Hours value={hospital.hours} />
        <HospitalCard.Phone value={hospital.phone} />
      </View>
    </Pressable>
  );
}

function Name({ value }: { value: string }) {
  return <Text style={styles.name}>{value}</Text>;
}

function Distance({ value }: { value: string }) {
  return <Text style={styles.dist}>{value}</Text>;
}

function Hours({ value }: { value: string }) {
  return <Text style={styles.hours}>🕘 {value}</Text>;
}

function Phone({ value }: { value: string }) {
  return <Text style={styles.phone}>📞 {value}</Text>;
}

export const HospitalCard = Object.assign(HospitalCardRoot, {
  Name,
  Distance,
  Hours,
  Phone,
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text },
  dist: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.text2 },
  metaRow: { flexDirection: 'row', gap: space[4], marginTop: 2 },
  hours: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  phone: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.brandText },
});
