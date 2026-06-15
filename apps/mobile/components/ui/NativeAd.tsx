import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, fontFamily, typography } from '../../theme';

export interface NativeAdProps {
  title?: string;
  description?: string;
  onPress?: () => void;
}

// 리스트 흐름에 섞이는 네이티브 광고(카드형). [AD] 라벨 + "광고" 표기 필수.
// ⚠️ emergency 레벨 화면에는 절대 렌더하지 말 것 (RULES.md).
export function NativeAd({
  title = '프리미엄 사료 첫 구매 30%',
  description = '믿을 수 있는 성분, 무료 배송',
  onPress,
}: NativeAdProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.thumb} />
      <View style={styles.body}>
        <View style={styles.tagRow}>
          <View style={styles.adTag}>
            <Text style={styles.adTagText}>AD</Text>
          </View>
          <Text style={styles.adLabel}>광고</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.desc} numberOfLines={1}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: colors.sunken },
  body: { flex: 1, minWidth: 0 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  adTag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.xs,
  },
  adTagText: { fontFamily, fontSize: typography.micro.size, fontWeight: '700', color: colors.text3 },
  adLabel: { fontFamily, fontSize: typography.caption.size, color: colors.text3 },
  title: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  desc: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
});
