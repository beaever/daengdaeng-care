import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, space, radius, fontFamily, fontScale } from '../../../theme';
import { HealthRecord } from '../../../components/compound';
import type { RecordTab } from '../../../components/compound';
import { usePet } from '../../../lib/pets';
import { useRecords, deleteRecord } from '../../../lib/records';

// SCR-014 · 건강 기록 (기록 탭) — HealthRecord 컴파운드 + 우하단 FAB. 화면은 조립만 한다(RULES 3).
export default function RecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const [tab, setTab] = useState<RecordTab>('all');
  const { pet } = usePet();
  const { records, reload } = useRecords();

  const goAdd = () => router.push('/record/add');

  const handleDelete = (id: number) => {
    Alert.alert('기록을 삭제할까요?', undefined, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteRecord(db, id).then(reload);
        },
      },
    ]);
  };

  if (!pet) return null; // 로딩 중이거나(undefined) 프로필 없음(null) — 라우팅으로 대부분 방지됨

  return (
    <View style={styles.root}>
      {/* 헤더 우측 + 버튼 → 기록 추가 */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={goAdd}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="기록 추가"
              style={styles.headerAdd}
            >
              <Text style={styles.headerAddIcon} maxFontSizeMultiplier={fontScale.icon}>
                ＋
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[16] }]}
        showsVerticalScrollIndicator={false}
      >
        <HealthRecord
          pet={pet}
          records={records}
          tab={tab}
          onTab={setTab}
          onDelete={handleDelete}
          onAdd={goAdd}
        />
      </ScrollView>

      {/* 우하단 FAB */}
      <Pressable
        onPress={goAdd}
        accessibilityRole="button"
        accessibilityLabel="기록 추가"
        style={[styles.fab, { bottom: insets.bottom + space[4] }]}
      >
        <Text style={styles.fabIcon} maxFontSizeMultiplier={fontScale.icon}>
          ＋
        </Text>
      </Pressable>
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
