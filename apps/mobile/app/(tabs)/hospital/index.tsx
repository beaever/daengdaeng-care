import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, space } from '../../../theme';
import { NativeAd } from '../../../components/ui';
import { HospitalCard, HospitalList } from '../../../components/compound';
import { hospitals } from '../../../lib/sampleData';

// SCR-012 · 병원 목록 (병원 탭) — 툴바 + 지도 + 카드 리스트(3번째에 NativeAd).
export default function HospitalListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('list');

  return (
    <View style={styles.root}>
      <View style={styles.toolbar}>
        <View style={styles.toggle}>
          <HospitalList.ViewToggle value={view} onChange={setView} />
        </View>
        <View style={styles.spacer} />
        <HospitalList.RadiusSelector value="1km" />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <HospitalList>
          <HospitalList.Map />
          <HospitalList.ResultCount count={hospitals.length} />
          {hospitals.map((h, i) => (
            <React.Fragment key={h.id}>
              {i === 2 && <NativeAd />}
              <HospitalCard
                hospital={h}
                onPress={() => router.push({ pathname: '/hospital/detail', params: { id: String(h.id) } })}
              />
            </React.Fragment>
          ))}
        </HospitalList>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    gap: space[3],
  },
  toggle: { width: 150 },
  spacer: { flex: 1 },
  content: { paddingHorizontal: space[5], paddingTop: space[1] },
});
