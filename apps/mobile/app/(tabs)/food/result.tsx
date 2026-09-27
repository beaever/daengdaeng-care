import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, space } from '../../../theme';
import { FoodResult } from '../../../components/compound';
import { foods } from '../../../lib/sampleData';

// SCR-006 · 음식 결과 (음식 탭) — FoodResult 컴파운드.
export default function FoodResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string }>();
  const food = (params.name != null ? foods[params.name] : undefined) ?? foods['포도']!;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space[8] + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <FoodResult food={food} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
