import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { SeverityLevel } from '@daengdaeng/tokens';
import { colors, space } from '../../../theme';
import { SymptomResult } from '../../../components/compound';
import { SYMPTOM_RESULTS } from '@daengdaeng/constants';

const LEVELS: SeverityLevel[] = ['emergency', 'today', 'watch'];

// SCR-011 · 증상 결과 (증상 탭) — SymptomResult 컴파운드.
// RULES(4): 수의사 면책 고지는 컴파운드(SymptomResult.Disclaimer)가 항상 렌더.
export default function SymptomResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ verdict?: string }>();
  // 값이 없거나 잘못된 링크면 근거 없이 "괜찮다"고 하지 않도록 진료 권장(today)으로 둔다.
  const verdict: SeverityLevel = LEVELS.includes(params.verdict as SeverityLevel)
    ? (params.verdict as SeverityLevel)
    : 'today';
  const result = SYMPTOM_RESULTS[verdict];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space[8] + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SymptomResult result={result} onFindHospital={() => router.push('/hospital')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
