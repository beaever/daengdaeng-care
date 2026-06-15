import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../../theme';
import { AdBanner } from '../../../components/ui';
import { FoodAnalysisResult } from '../../../components/compound';
import { product } from '../../../lib/sampleData';

// SCR-008 · 사료 분석 결과 (음식 탭) — FoodAnalysisResult 컴파운드 + 하단 AdBanner.
export default function FoodAnalysisScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FoodAnalysisResult product={product} />
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <AdBanner title="우리 아이 맞춤 사료 추천받기" description="AD · 펫푸드랩" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], paddingBottom: space[8] },
});
