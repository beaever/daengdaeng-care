import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, typography } from '../../theme';
import { Card, Divider } from '../ui';
import type { Pet } from '../../lib/sampleData';

// 홈 "건강 요약" 카드 — 컴파운드(체중 · 최근 방문 · 다음 접종 행).
export interface HealthSummaryCardProps {
  pet: Pet;
}

function HealthSummaryCardRoot({ pet }: HealthSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <HealthSummaryCard.WeightRow value={pet.weight} />
      <Divider inset />
      <HealthSummaryCard.LastVisitRow value={pet.lastVisit} />
      <Divider inset />
      <HealthSummaryCard.NextVaccineRow value={`D-${pet.nextVaccineDays}`} />
    </Card>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const WeightRow = ({ value }: { value: string }) => (
  <SummaryRow icon="⚖️" label="최근 체중" value={value} />
);
const LastVisitRow = ({ value }: { value: string }) => (
  <SummaryRow icon="🏥" label="최근 병원 방문" value={value} />
);
const NextVaccineRow = ({ value }: { value: string }) => (
  <SummaryRow icon="💉" label="다음 예방접종" value={value} />
);

export const HealthSummaryCard = Object.assign(HealthSummaryCardRoot, {
  WeightRow,
  LastVisitRow,
  NextVaccineRow,
});

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: { fontSize: 19 },
  label: { fontFamily, fontSize: typography.sub.size, fontWeight: '600', color: colors.text2, flex: 1 },
  value: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
});
