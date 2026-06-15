import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.sunken,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.brand },
});
