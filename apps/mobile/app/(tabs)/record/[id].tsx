import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, space } from '../../../theme';
import { HealthRecord } from '../../../components/compound';
import { EmptyState, Button } from '../../../components/ui';
import { getRecord, listRoutePoints, type HealthRecord as Rec } from '../../../lib/records';
import type { RoutePoint } from '../../../lib/geo';

// 기록 상세(산책 경로 보기) — HealthRecord.Detail 조립만 한다(RULES 3).
export default function RecordDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<{ rec: Rec | null; points: RoutePoint[] } | undefined>(undefined);

  useEffect(() => {
    const n = Number(id);
    Promise.all([getRecord(db, n), listRoutePoints(db, n)]).then(([rec, points]) => setState({ rec, points }));
  }, [db, id]);

  if (!state) return null;
  if (!state.rec) {
    return (
      <EmptyState
        icon="🗒️"
        title="기록을 찾을 수 없어요"
        action={<Button onPress={() => router.back()}>돌아가기</Button>}
      />
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
    >
      <HealthRecord.Detail rec={state.rec} points={state.points} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
