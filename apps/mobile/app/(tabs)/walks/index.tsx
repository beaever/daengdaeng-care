import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, space, fontFamily, typography, fontScale } from '../../../theme';
import { Button } from '../../../components/ui';
import { HealthRecord } from '../../../components/compound';
import { promptPendingWalk } from '../../../lib/walkRecover';
import { useRecords, deleteRecord } from '../../../lib/records';

// 산책 탭 — 산책 시작 CTA + 산책 기록 타임라인(HealthRecord.Timeline 재사용). 화면은 조립만 한다(RULES 3).
export default function WalksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const { records, reload } = useRecords();

  const startWalk = async () => {
    await promptPendingWalk(db).catch(() => {});
    router.push('/walk');
  };

  const handleDelete = (id: number) => {
    Alert.alert('기록을 삭제할까요?', undefined, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteRecord(db, id).then(reload) },
    ]);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + space[4], paddingBottom: space[8] }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title} maxFontSizeMultiplier={fontScale.heading} accessibilityRole="header">
        산책
      </Text>
      <Button block size="lg" onPress={startWalk}>
        🐾 산책 시작
      </Button>
      <View style={styles.list}>
        <HealthRecord.Timeline
          records={records}
          tab="walk"
          onDelete={handleDelete}
          onOpen={(id) => router.push(`/walks/${id}` as Href)}
          onAdd={startWalk}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space[5], gap: space[5] },
  title: { fontFamily, fontSize: typography.h2.size, fontWeight: '800', color: colors.text },
  list: { gap: space[4] },
});
