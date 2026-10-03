import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, fontFamily, typography } from '../../theme';
import { formatDistance, type Hospital } from '../../lib/hospitals';

// SCR-012 · 병원 카드 — 거리 / 이름 / 주소 · 전화.
export interface HospitalCardProps {
  hospital: Hospital;
  onPress?: () => void;
}

function HospitalCardRoot({ hospital, onPress }: HospitalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${hospital.name}, ${formatDistance(hospital.distance)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <HospitalCard.Name value={hospital.name} />
        <HospitalCard.Distance value={formatDistance(hospital.distance)} />
      </View>
      <HospitalCard.Address value={hospital.address} />
      <HospitalCard.Phone value={hospital.phone} />
    </Pressable>
  );
}

function Name({ value }: { value: string }) {
  return <Text style={styles.name}>{value}</Text>;
}

function Distance({ value }: { value: string }) {
  return <Text style={styles.dist}>{value}</Text>;
}

function Address({ value }: { value: string }) {
  return <Text style={styles.address}>📍 {value}</Text>;
}

function Phone({ value }: { value: string }) {
  return <Text style={styles.phone}>📞 {value}</Text>;
}

export const HospitalCard = Object.assign(HospitalCardRoot, {
  Name,
  Distance,
  Address,
  Phone,
});

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    padding: 16,
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.6 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[2] },
  name: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text, flexShrink: 1 },
  dist: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.text2 },
  address: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  phone: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.brandText },
});
