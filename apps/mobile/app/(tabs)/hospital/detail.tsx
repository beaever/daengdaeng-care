import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, space, fontFamily, typography } from '../../../theme';
import { Button, StatusBadge } from '../../../components/ui';
import { HospitalList } from '../../../components/compound';
import { hospitals } from '../../../lib/sampleData';

// SCR-013 · 병원 상세 (병원 탭) — 지도 + 이름/상태 + 정보 행 + 전화·길찾기 CTA.
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function HospitalDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const hospital =
    hospitals.find((h) => String(h.id) === params.id) ?? hospitals[1]!;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <HospitalList.Map height={170} />

        <View style={styles.head}>
          <Text style={styles.name}>{hospital.name}</Text>
          <StatusBadge isOpen={hospital.open} is24h={hospital.is24h} />
        </View>

        <View style={styles.info}>
          <InfoRow icon="📍" label="주소" value={hospital.addr} />
          <InfoRow icon="🕘" label="진료 시간" value={hospital.hours} />
          <InfoRow icon="📞" label="전화" value={hospital.phone} />
        </View>

        <View style={styles.cta}>
          <View style={styles.ctaItem}>
            <Button variant="secondary" block>📞 전화</Button>
          </View>
          <View style={styles.ctaItem}>
            <Button block>🧭 길찾기</Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], gap: space[4] },
  head: { gap: space[2] },
  name: { fontFamily, fontSize: typography.h1.size, fontWeight: '800', color: colors.text },
  info: { gap: space[4] },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  rowIcon: { fontSize: 20, width: 24, textAlign: 'center' },
  rowBody: { flex: 1, gap: 2 },
  rowLabel: { fontFamily, fontSize: typography.caption.size, color: colors.text3 },
  rowValue: { fontFamily, fontSize: typography.callout.size, fontWeight: '600', color: colors.text },
  cta: { flexDirection: 'row', gap: space[3], marginTop: space[2] },
  ctaItem: { flex: 1 },
});
