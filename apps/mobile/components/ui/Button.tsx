import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, space, radius, fontFamily, typography, palette } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  variant = 'primary',
  size = 'default',
  block = false,
  disabled = false,
  onPress,
  children,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        block && styles.block,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, labelSize[size], labelVariant[variant]]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: space[5],
    borderRadius: radius.sm,
  },
  block: { alignSelf: 'stretch' },
  pressed: { transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.45 },
  label: { fontFamily, fontWeight: '700' },
});

const sizeStyles = StyleSheet.create({
  sm: { minHeight: 36, paddingHorizontal: 14 },
  default: {},
  lg: { minHeight: 54, paddingHorizontal: space[7], borderRadius: radius.md },
});

const labelSize = StyleSheet.create({
  sm: { fontSize: typography.sub.size },
  default: { fontSize: typography.callout.size },
  lg: { fontSize: typography.title.size },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.brand },
  secondary: { backgroundColor: colors.surface2 },
  outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderStrong },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: palette.danger.base },
});

const labelVariant = StyleSheet.create({
  primary: { color: colors.onBrand },
  secondary: { color: colors.text },
  outline: { color: colors.text },
  ghost: { color: colors.brandText },
  danger: { color: palette.stone[0] },
});
