import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { SafetyLevel } from '@daengdaeng/tokens';
import { colors, radius, fontFamily, typography, safetyColors } from '../../theme';

const STATUS_LABEL: Record<SafetyLevel, string> = {
  safe: '좋아요',
  caution: '주의',
  danger: '위험',
};

export interface IngredientItemProps {
  rank: number;
  name: string;
  status: SafetyLevel;
}

export function IngredientItem({ rank, name, status }: IngredientItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.rank}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={[styles.tag, { backgroundColor: safetyColors[status].soft }]}>
        <Text style={[styles.tagText, { color: safetyColors[status].strong }]}>
          {STATUS_LABEL[status]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rank: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.text2 },
  name: { flex: 1, fontFamily, fontSize: typography.body.size, fontWeight: '600', color: colors.text },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontFamily, fontSize: typography.caption.size, fontWeight: '700' },
});
