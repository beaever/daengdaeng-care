import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography, layout } from '../../theme';

export interface AdBannerProps {
  title?: string;
  description?: string;
  onPress?: () => void;
}

// 높이 52px 고정. 모든 광고는 [AD] 라벨 필수.
// ⚠️ emergency 레벨 화면에는 절대 렌더하지 말 것 (RULES.md).
export function AdBanner({ title = '광고 제목', description = '광고 설명', onPress }: AdBannerProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.banner}>
      <View style={styles.adTag}>
        <Text style={styles.adTagText}>AD</Text>
      </View>
      <View style={styles.thumb} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.desc} numberOfLines={1}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: layout.adBannerHeight,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  adTag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.xs,
  },
  adTagText: { fontFamily, fontSize: typography.micro.size, fontWeight: '700', color: colors.text3 },
  thumb: { width: 34, height: 34, borderRadius: radius.xs, backgroundColor: colors.surface2 },
  text: { flex: 1 },
  title: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.text },
  desc: { fontFamily, fontSize: typography.micro.size, color: colors.text3 },
});
