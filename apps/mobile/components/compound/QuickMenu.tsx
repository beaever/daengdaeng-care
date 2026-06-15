import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

// 홈 "바로가기" 2×2 그리드 — 컴파운드(QuickMenu + QuickMenu.Item).
export interface QuickMenuProps {
  children: React.ReactNode;
}

export interface QuickMenuItemProps {
  /** 이모지 아이콘 */
  icon: string;
  label: string;
  sub?: string;
  onPress?: () => void;
}

function QuickMenuRoot({ children }: QuickMenuProps) {
  return <View style={styles.grid}>{children}</View>;
}

function QuickMenuItem({ icon, label, sub, onPress }: QuickMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.label}>{label}</Text>
        {sub != null && <Text style={styles.sub}>{sub}</Text>}
      </View>
    </Pressable>
  );
}

export const QuickMenu = Object.assign(QuickMenuRoot, { Item: QuickMenuItem });

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 10,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    // colors.shadowSm 대응
    shadowColor: '#281914',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: { backgroundColor: colors.surface2, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24 },
  textBox: { gap: 3 },
  label: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  sub: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
});
