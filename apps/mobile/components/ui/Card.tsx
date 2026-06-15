import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, radius, space } from '../../theme';

export interface CardProps {
  pad?: boolean;
  flat?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ pad = false, flat = false, children, style }: CardProps) {
  return (
    <View style={[styles.card, !flat && styles.shadow, pad && styles.pad, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pad: { padding: 18 },
  // colors.shadowSm 대응 — iOS/Android 그림자
  shadow: {
    shadowColor: '#281914',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
