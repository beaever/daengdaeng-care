import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZES: Record<AvatarSize, { box: number; emoji: number }> = {
  sm: { box: 40, emoji: 20 },
  md: { box: 52, emoji: 26 },
  lg: { box: 92, emoji: 46 },
};

export interface AvatarProps {
  src?: string;
  emoji?: string;
  size?: AvatarSize;
}

export function Avatar({ src, emoji = '🐶', size = 'md' }: AvatarProps) {
  const s = SIZES[size];
  const box = { width: s.box, height: s.box, borderRadius: radius.pill };
  if (src) {
    return <Image source={{ uri: src }} style={[styles.base, box]} />;
  }
  return (
    <View style={[styles.base, box]}>
      <Text style={{ fontSize: s.emoji }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
