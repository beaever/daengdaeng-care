import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography, rnShadow } from '../../theme';

export interface SegmentOption {
  label: string;
  value: string;
}

export interface SegmentProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Segment({ options, value, onChange }: SegmentProps) {
  return (
    <View style={styles.track}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[styles.seg, active && styles.segActive]}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: colors.sunken,
    borderRadius: radius.sm,
  },
  seg: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xs,
  },
  segActive: {
    backgroundColor: colors.surface,
    ...rnShadow.sm,
  },
  label: { fontFamily, fontSize: typography.sub.size, fontWeight: '600' },
  labelActive: { color: colors.text },
  labelInactive: { color: colors.text2 },
});
