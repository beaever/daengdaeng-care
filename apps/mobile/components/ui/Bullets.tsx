import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, typography, radius, palette } from '../../theme';

export type BulletsVariant = 'default' | 'danger' | 'safe';

export interface BulletsProps {
  items: string[];
  variant?: BulletsVariant;
}

export function Bullets({ items, variant = 'default' }: BulletsProps) {
  const dotColor =
    variant === 'danger' ? palette.danger.base : variant === 'safe' ? palette.safe.base : colors.text3;
  return (
    <View style={styles.list}>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  item: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: radius.pill, marginTop: 7 },
  text: {
    flex: 1,
    fontFamily,
    fontSize: typography.body.size,
    lineHeight: typography.body.size * typography.body.lineHeight,
    color: colors.text,
  },
});
