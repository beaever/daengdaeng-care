import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

export interface RowProps {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  chevron?: boolean;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

export function Row({ icon, title, sub, chevron = true, trailing, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      {icon != null && (
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {sub != null && <Text style={styles.sub}>{sub}</Text>}
      </View>
      {trailing ?? (chevron && <Text style={styles.chevron}>›</Text>)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.surface2 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20, color: colors.brandText },
  body: { flex: 1, gap: 4 }, // title↔sub 간격 4px 고정
  title: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  sub: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  chevron: { fontFamily, fontSize: 22, color: colors.text3 },
});
