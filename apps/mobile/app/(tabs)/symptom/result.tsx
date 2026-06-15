import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { SeverityLevel } from '@daengdaeng/tokens';
import { colors, space } from '../../../theme';
import { AdBanner } from '../../../components/ui';
import { SymptomResult } from '../../../components/compound';
import { symptomResults } from '../../../lib/sampleData';

const LEVELS: SeverityLevel[] = ['emergency', 'today', 'watch'];

// SCR-011 · 증상 결과 (증상 탭) — SymptomResult 컴파운드.
// RULES(1): emergency 레벨에는 광고를 절대 렌더하지 않는다.
// RULES(4): 수의사 면책 고지는 컴파운드(SymptomResult.Disclaimer)가 항상 렌더.
export default function SymptomResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ verdict?: string }>();
  const verdict: SeverityLevel = LEVELS.includes(params.verdict as SeverityLevel)
    ? (params.verdict as SeverityLevel)
    : 'watch';
  const result = symptomResults[verdict];
  const showAd = verdict !== 'emergency';

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SymptomResult result={result} onFindHospital={() => router.push('/hospital')} />
      </ScrollView>
      {showAd && (
        <View style={{ paddingBottom: insets.bottom }}>
          <AdBanner
            title={verdict === 'watch' ? '소화가 편한 처방 사료' : '우리 아이 맞춤 건강검진'}
            description="AD · 벳다이어트"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], paddingBottom: space[8] },
});
