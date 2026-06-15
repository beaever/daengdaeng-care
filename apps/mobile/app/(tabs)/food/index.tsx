import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, space, fontFamily, typography } from '../../../theme';
import { Input, SectionHeading, Chip, EmptyState } from '../../../components/ui';
import { foods, popularFoods, recentFoods } from '../../../lib/sampleData';

// SCR-005 · 음식 검색 (음식 탭) — 검색어 유무에 따라 분기.
export default function FoodSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(recentFoods);

  const names = Object.keys(foods);
  const matches = query ? names.filter((n) => n.includes(query)) : [];

  const go = (name: string) => {
    setQuery('');
    router.push({ pathname: '/food/result', params: { name } });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + space[2] }]}>
        <Text style={styles.title}>음식 판별</Text>
        <Text style={styles.sub}>먹어도 되는지 검색해보세요</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Input
          leftIcon="🔍"
          placeholder="음식 이름을 검색하세요"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />

        {query ? (
          matches.length > 0 ? (
            <View style={styles.matchList}>
              {matches.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => go(n)}
                  style={({ pressed }) => [styles.matchRow, pressed && styles.matchRowPressed]}
                >
                  <Text style={styles.matchIcon}>🔍</Text>
                  <Text style={styles.matchName}>{n}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <EmptyState icon="🔍" title="검색 결과가 없어요" description="아직 확인되지 않은 음식이에요." />
          )
        ) : (
          <View style={styles.sections}>
            <View>
              <SectionHeading>많이 찾는 음식</SectionHeading>
              <View style={styles.chips}>
                {popularFoods.map((n) => (
                  <Chip key={n} variant="brand" onPress={() => go(n)}>
                    {n}
                  </Chip>
                ))}
              </View>
            </View>

            <View>
              <SectionHeading>최근 검색</SectionHeading>
              <View>
                {recent.map((n) => (
                  <View key={n} style={styles.recentRow}>
                    <Pressable onPress={() => go(n)} style={styles.recentName} hitSlop={8}>
                      <Text style={styles.recentNameText}>{n}</Text>
                    </Pressable>
                    <Pressable
                      accessibilityLabel={`${n} 검색 기록 삭제`}
                      onPress={() => setRecent((prev) => prev.filter((x) => x !== n))}
                      hitSlop={8}
                    >
                      <Text style={styles.recentRemove}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space[5], paddingBottom: space[3], gap: 4 },
  title: { fontFamily, fontSize: typography.h2.size, fontWeight: '800', color: colors.text },
  sub: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  content: { paddingHorizontal: space[5], paddingTop: space[2], gap: space[5] },
  matchList: { gap: 0 },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  matchRowPressed: { opacity: 0.55 },
  matchIcon: { fontSize: 16 },
  matchName: { fontFamily, fontSize: typography.callout.size, fontWeight: '600', color: colors.text },
  sections: { gap: space[5] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  recentName: { flex: 1 },
  recentNameText: { fontFamily, fontSize: typography.callout.size, fontWeight: '600', color: colors.text },
  recentRemove: { fontFamily, fontSize: 14, color: colors.text3, paddingHorizontal: 4 },
});
