import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

export interface OptionProps {
  label: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function Option({ label, description, selected = false, onSelect }: OptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        {description != null && <Text style={styles.desc}>{description}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 58,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  optionSelected: { borderColor: colors.brand, backgroundColor: colors.brandSoft },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  checkMark: { color: colors.onBrand, fontSize: 13, fontWeight: '800' },
  body: { flex: 1, gap: 2 },
  label: { fontFamily, fontSize: typography.callout.size, fontWeight: '600', color: colors.text },
  desc: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
});
