import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, space } from '../../../theme';
import { FoodResult } from '../../../components/compound';
import { EmptyState } from '../../../components/ui';
import { FOODS, searchFood } from '@daengdaeng/constants';

// SCR-006 · 음식 결과 (음식 탭) — FoodResult 컴파운드.
export default function FoodResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string }>();
  const food = params.name != null ? (FOODS[params.name] ?? searchFood(params.name)) : null;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space[8] + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {food != null ? (
          <FoodResult food={food} />
        ) : (
          <EmptyState
            icon="🔍"
            title="확인되지 않은 음식이에요"
            description="걱정되는 증상이 있다면 가까운 수의사와 상담해 주세요."
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
