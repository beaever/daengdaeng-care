import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radius, fontFamily, typography, palette } from '../../theme';

// ── Field ──────────────────────────────────────────────────────────
export interface FieldProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <View style={styles.field}>
      {label != null && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {children}
    </View>
  );
}

// ── Input ──────────────────────────────────────────────────────────
export interface InputProps extends TextInputProps {
  leftIcon?: string;
}

export function Input({ leftIcon, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
      {leftIcon != null && <Text style={styles.icon}>{leftIcon}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text3}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

// ── Textarea ───────────────────────────────────────────────────────
export function Textarea({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      placeholderTextColor={colors.text3}
      style={[styles.textarea, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontFamily, fontSize: typography.sub.size, fontWeight: '700', color: colors.text2 },
  required: { color: palette.danger.base },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.sm,
  },
  inputWrapFocused: { borderColor: colors.brand, backgroundColor: colors.surface },
  icon: { fontSize: 16, color: colors.text3 },
  input: { flex: 1, fontFamily, fontSize: typography.callout.size, color: colors.text },
  textarea: {
    minHeight: 100,
    padding: 14,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    fontFamily,
    fontSize: typography.callout.size,
    color: colors.text,
  },
});
