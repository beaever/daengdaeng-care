import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export interface DividerProps {
  inset?: boolean;
}

export function Divider({ inset = false }: DividerProps) {
  return <View style={[styles.divider, inset && styles.inset]} />;
}

const styles = StyleSheet.create({
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  inset: { marginLeft: 18 },
});
