import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily } from '../../theme';

export interface IconButtonProps {
  /** 이모지/문자 아이콘 */
  icon: React.ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function IconButton({ icon, accessibilityLabel, onPress, disabled }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.surface2, transform: [{ scale: 0.92 }] },
  disabled: { opacity: 0.45 },
  icon: { fontFamily, fontSize: 20, color: colors.text },
});
