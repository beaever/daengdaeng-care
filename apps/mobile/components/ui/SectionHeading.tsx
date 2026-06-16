import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontFamily, typography } from '../../theme';

export interface SectionHeadingProps {
  children: string;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return <Text style={styles.heading}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontFamily,
    fontSize: typography.sub.size,
    fontWeight: '800',
    color: colors.text2,
    marginBottom: 10,
  },
});
