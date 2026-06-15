import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

export type ChipVariant = 'default' | 'brand' | 'selected';

export interface ChipProps {
  variant?: ChipVariant;
  onPress?: () => void;
  onRemove?: () => void;
  children: string;
}

export function Chip({ variant = 'default', onPress, onRemove, children }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        variantStyles[variant],
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, labelVariant[variant]]}>{children}</Text>
      {onRemove && (
        <Pressable accessibilityLabel="제거" onPress={onRemove} hitSlop={8}>
          <Text style={[styles.remove, labelVariant[variant]]}>✕</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  pressed: { transform: [{ scale: 0.95 }] },
  label: { fontFamily, fontSize: typography.sub.size, fontWeight: '600' },
  remove: { fontSize: 11 },
});

const variantStyles = StyleSheet.create({
  default: { backgroundColor: colors.surface2 },
  brand: { backgroundColor: colors.brandSoft },
  selected: { backgroundColor: colors.brand },
});

const labelVariant = StyleSheet.create({
  default: { color: colors.text },
  brand: { color: colors.brandText },
  selected: { color: colors.onBrand },
});
