import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors, space, radius, layout, fontFamily } from '../../../theme';
import { AdBanner } from '../../../components/ui';
import { HealthRecord } from '../../../components/compound';
import type { RecordTab } from '../../../components/compound';
import { pet, records } from '../../../lib/sampleData';

// SCR-014 · 건강 기록 (기록 탭) — HealthRecord 컴파운드 + 우하단 FAB + 하단 AdBanner.
// 건강 기록은 응급(emergency) 화면이 아니므로 광고 허용(RULES 1). 화면은 조립만 한다(RULES 3).
export default function RecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<RecordTab>('all');

  const goAdd = () => router.push('/record/add');

  return (
    <View style={styles.root}>
      {/* 헤더 우측 + 버튼 → 기록 추가 */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={goAdd} hitSlop={10} style={styles.headerAdd}>
              <Text style={styles.headerAddIcon}>＋</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: layout.adBannerHeight + insets.bottom + space[16] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HealthRecord pet={pet} records={records} tab={tab} onTab={setTab} />
      </ScrollView>

      {/* 우하단 FAB — AdBanner 위에 띄움 */}
      <Pressable
        onPress={goAdd}
        style={[styles.fab, { bottom: layout.adBannerHeight + insets.bottom + space[4] }]}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </Pressable>

      <View style={{ paddingBottom: insets.bottom }}>
        <AdBanner title="우리 아이 건강검진 패키지" description="AD · 댕댕동물병원" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
  headerAdd: { paddingHorizontal: space[1] },
  headerAddIcon: { fontFamily, fontSize: 26, fontWeight: '400', color: colors.brandText },
  fab: {
    position: 'absolute',
    right: space[5],
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabIcon: { fontFamily, fontSize: 30, fontWeight: '400', color: colors.onBrand, lineHeight: 34 },
});
