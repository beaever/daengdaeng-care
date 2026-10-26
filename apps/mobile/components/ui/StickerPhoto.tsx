import React from 'react';
import { View, Image, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, space, rnShadow, fontScale } from '../../theme';
import { Avatar } from './Avatar';

export interface StickerPhotoProps {
  uri: string;
  /** 프로필 사진 URI — 없으면 Avatar 기본 이모지로 스티커를 그린다 */
  stickerUri?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * 산책 사진 + 우하단 반려견 프로필 스티커(흰 테두리 원형 + 🐾 배지).
 * 원본 파일은 건드리지 않고 표시할 때만 겹친다 — 프로필 사진을 바꾸면 스티커도 따라 바뀐다.
 */
export function StickerPhoto({ uri, stickerUri, style }: StickerPhotoProps) {
  return (
    <View style={[styles.root, style]}>
      <Image source={{ uri }} style={styles.photo} accessibilityIgnoresInvertColors />
      <View style={styles.sticker} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.ring}>
          <Avatar src={stickerUri} size="md" />
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText} maxFontSizeMultiplier={fontScale.icon}>
            🐾
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', aspectRatio: 4 / 3 },
  photo: { width: '100%', height: '100%', backgroundColor: colors.surface2 },
  sticker: { position: 'absolute', right: space[3], bottom: space[3] },
  ring: {
    padding: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    // 사진 위에서 떠 보이도록 lg 그림자, 회전으로 스티커 느낌
    ...rnShadow.lg,
    transform: [{ rotate: '-8deg' }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    left: -6,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11 },
});
