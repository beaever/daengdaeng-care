import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../../theme';
import { FoodAnalysisResult } from '../../../components/compound';
import { product } from '../../../lib/sampleData';

// SCR-008 · 사료 분석 결과 (음식 탭) — FoodAnalysisResult 컴파운드.
export default function FoodAnalysisScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space[8] + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <FoodAnalysisResult product={product} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
