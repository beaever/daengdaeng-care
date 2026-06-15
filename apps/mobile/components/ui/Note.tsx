import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';

export interface NoteProps {
  icon?: string;
  children: string;
}

export function Note({ icon = 'ℹ️', children }: NoteProps) {
  return (
    <View style={styles.note}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
  },
  icon: { fontSize: typography.caption.size },
  text: {
    flex: 1,
    fontFamily,
    fontSize: typography.caption.size,
    lineHeight: typography.caption.size * typography.caption.lineHeight,
    color: colors.text2,
  },
});
