import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, radius, fontFamily, typography } from '../theme';

export interface PlaceholderProps {
  emoji: string;
  title: string;
  description: string;
  /** 이 탭/스택에서 구현 예정인 화면 목록 */
  screens?: string[];
}

// 단계적 스캐폴딩용 플레이스홀더 — 실제 화면은 mobile-screens 단계에서 구현.
export function Placeholder({ emoji, title, description, screens }: PlaceholderProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + space[6] }]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {screens && screens.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>구현 예정 화면</Text>
          {screens.map((s) => (
            <Text key={s} style={styles.screenItem}>
              • {s}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: space[5],
    paddingBottom: space[10],
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: space[3],
  },
  title: {
    fontFamily,
    fontSize: typography.h1.size,
    fontWeight: '800',
    color: colors.text,
    marginBottom: space[2],
  },
  description: {
    fontFamily,
    fontSize: typography.sub.size,
    color: colors.text2,
    textAlign: 'center',
    marginBottom: space[6],
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space[5],
  },
  cardTitle: {
    fontFamily,
    fontSize: typography.sub.size,
    fontWeight: '800',
    color: colors.text2,
    marginBottom: space[3],
  },
  screenItem: {
    fontFamily,
    fontSize: typography.body.size,
    color: colors.text,
    lineHeight: typography.body.size * typography.body.lineHeight,
  },
});
