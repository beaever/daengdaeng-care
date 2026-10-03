import React from 'react';
import { View, Text, ScrollView, Linking, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, space, fontFamily, typography } from '../../../theme';
import { Button } from '../../../components/ui';
import { HospitalList } from '../../../components/compound';
import { formatDistance } from '../../../lib/hospitals';

// SCR-013 · 병원 상세 (병원 탭) — 지도 + 이름 + 정보 행 + 전화·길찾기 CTA.
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
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    address: string;
    phone: string;
    lat: string;
    lng: string;
    distance: string;
  }>();

  const hospital = {
    id: params.id,
    name: params.name,
    address: params.address,
    phone: params.phone,
    lat: Number(params.lat),
    lng: Number(params.lng),
    distance: Number(params.distance),
  };

  async function handleCall() {
    const url = `tel:${hospital.phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('전화를 걸 수 없어요', '이 기기(시뮬레이터)에서는 전화 기능을 사용할 수 없어요.');
      return;
    }
    Linking.openURL(url);
  }

  function handleDirections() {
    const url = `https://maps.apple.com/?daddr=${hospital.lat},${hospital.lng}&q=${encodeURIComponent(hospital.name)}`;
    Linking.openURL(url);
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <HospitalList.Map
          center={{ lat: hospital.lat, lng: hospital.lng }}
          hospitals={[hospital]}
          selectedId={hospital.id}
          height={170}
          interactive={false}
        />

        <View style={styles.head}>
          <Text style={styles.name}>{hospital.name}</Text>
        </View>

        <View style={styles.info}>
          <InfoRow icon="📍" label="주소" value={hospital.address} />
          <InfoRow icon="📞" label="전화" value={hospital.phone} />
          <InfoRow icon="📏" label="거리" value={formatDistance(hospital.distance)} />
        </View>

        <View style={styles.cta}>
          <View style={styles.ctaItem}>
            <Button variant="secondary" block onPress={handleCall}>
              📞 전화
            </Button>
          </View>
          <View style={styles.ctaItem}>
            <Button block onPress={handleDirections}>
              🧭 길찾기
            </Button>
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
