import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, space, radius, fontFamily, typography, safetyColors } from '../../../theme';
import { symptomCats } from '../../../lib/sampleData';

// SCR-009 · 증상 카테고리 (증상 탭) — 2열 그리드 + 응급 증상 배너.
export default function SymptomCategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + space[2] }]}>
        <Text style={styles.title}>어디가 안 좋아 보이나요?</Text>
        <Text style={styles.sub}>증상을 선택하면 단계별로 확인해드려요</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {symptomCats.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.push('/symptom/questions')}
              style={({ pressed }) => [styles.cat, pressed && styles.catPressed]}
            >
              <Text style={styles.catEmoji}>{c.emoji}</Text>
              <Text style={styles.catLabel}>{c.label}</Text>
              <Text style={styles.catSub}>{c.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* 응급 배너 — 결과(emergency)로 직행. 면책상 항상 노출. */}
        <Pressable
          onPress={() => router.push({ pathname: '/symptom/result', params: { verdict: 'emergency' } })}
          style={({ pressed }) => [styles.emergency, pressed && styles.emergencyPressed]}
        >
          <Text style={styles.emergencyEmoji}>🚨</Text>
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>응급 증상</Text>
            <Text style={styles.emergencySub}>발작 · 의식 없음 · 호흡 곤란</Text>
          </View>
          <Text style={styles.emergencyChevron}>›</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space[5], paddingBottom: space[3], gap: 4 },
  title: { fontFamily, fontSize: typography.h2.size, fontWeight: '800', color: colors.text },
  sub: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  content: { paddingHorizontal: space[5], paddingTop: space[3], gap: space[4] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  cat: {
    width: '47.8%',
    flexGrow: 1,
    gap: 6,
    padding: space[4],
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catPressed: { backgroundColor: colors.surface2 },
  catEmoji: { fontSize: 28, marginBottom: 2 },
  catLabel: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  catSub: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
    borderRadius: radius.md,
    backgroundColor: safetyColors.emergency.soft,
    borderWidth: 1,
    borderColor: safetyColors.emergency.base,
  },
  emergencyPressed: { opacity: 0.85 },
  emergencyEmoji: { fontSize: 26 },
  emergencyText: { flex: 1, gap: 2 },
  emergencyTitle: { fontFamily, fontSize: typography.callout.size, fontWeight: '800', color: safetyColors.emergency.strong },
  emergencySub: { fontFamily, fontSize: typography.caption.size, color: safetyColors.emergency.strong },
  emergencyChevron: { fontSize: 22, fontWeight: '700', color: safetyColors.emergency.strong },
});
