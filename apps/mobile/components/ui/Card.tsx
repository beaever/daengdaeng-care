import React from 'react';
import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { colors, radius, rnShadow } from '../../theme';

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
  // 그림자는 rnShadow.md 토큰 사용 (웹 --shadow-md 대응)
  shadow: rnShadow.md,
});
