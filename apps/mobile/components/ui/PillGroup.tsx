import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

export interface PillGroupOption {
  label: string;
  value: string;
}

export interface PillGroupProps {
  options: PillGroupOption[];
  value: string;
  onChange: (value: string) => void;
}

export function PillGroup({ options, value, onChange }: PillGroupProps) {
  return (
    <View style={styles.group}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  pillActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  label: { fontFamily, fontSize: typography.sub.size, fontWeight: '600', color: colors.text2 },
  labelActive: { color: colors.brandText },
});
