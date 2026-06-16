import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, space } from '../../../theme';
import { AdBanner } from '../../../components/ui';
import { FoodResult } from '../../../components/compound';
import { foods } from '../../../lib/sampleData';

// SCR-006 · 음식 결과 (음식 탭) — FoodResult 컴파운드 + 하단 AdBanner.
// 음식 안전도(safe/caution/danger)는 응급(emergency) 레벨이 아니므로 광고 허용.
export default function FoodResultScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string }>();
  const food = (params.name != null ? foods[params.name] : undefined) ?? foods['포도']!;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FoodResult food={food} />
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <AdBanner title="우리 아이 맞춤 영양 간식" description="AD · 펫푸드랩" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], paddingBottom: space[8] },
});
