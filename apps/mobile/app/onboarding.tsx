import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, palette, safetyColors, radius, space, fontFamily, typography } from '../theme';
import { Button } from '../components/ui';

// SCR-002 · 온보딩 (3슬라이드, 최초 1회).
interface Slide {
  emoji: string;
  bg: string;
  title: string;
  sub: string;
}

const SLIDES: Slide[] = [
  {
    emoji: '🥦',
    bg: safetyColors.safe.soft,
    title: '뭘 먹여도 되는지\n헷갈리세요?',
    sub: '검색 한 번으로 우리 아이가 먹어도 되는 음식인지 바로 확인해요.',
  },
  {
    emoji: '🩺',
    bg: palette.info.soft,
    title: '병원에 가야 할지\n고민될 때',
    sub: '증상을 입력하면 지금 병원에 가야 하는지 알려드려요.',
  },
  {
    emoji: '📋',
    bg: colors.brandSoft,
    title: '접종·체중·병원 기록\n한 곳에서',
    sub: '우리 아이 건강 기록을 깔끔하게 모아 관리해요.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx]!;
  const last = idx === SLIDES.length - 1;

  const goProfile = () => router.replace('/profile');
  const next = () => (last ? goProfile() : setIdx((i) => i + 1));

  return (
    <View style={[styles.root, { paddingTop: insets.top + space[2], paddingBottom: insets.bottom + space[6] }]}>
      <Pressable
        onPress={goProfile}
        style={[styles.skip, { opacity: last ? 0 : 1 }]}
        disabled={last}
      >
        <Text style={styles.skipText}>건너뛰기</Text>
      </Pressable>

      <View style={styles.art}>
        <View style={[styles.illu, { backgroundColor: slide.bg }]}>
          <Text style={styles.illuEmoji}>{slide.emoji}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.sub}>{slide.sub}</Text>
      </View>

      <View style={styles.dots}>
        {SLIDES.map((_, j) => (
          <View key={j} style={[styles.dot, j === idx && styles.dotOn]} />
        ))}
      </View>

      <Button block size="lg" onPress={next}>
        {last ? '시작하기' : '다음'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: space[5], backgroundColor: colors.bg },
  skip: { alignSelf: 'flex-end', paddingVertical: space[2], paddingHorizontal: space[2] },
  skipText: { fontFamily, fontSize: typography.sub.size, fontWeight: '600', color: colors.text3 },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illu: {
    width: 200,
    height: 200,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illuEmoji: { fontSize: 88 },
  body: { gap: 12, marginBottom: space[8] },
  title: {
    fontFamily,
    fontSize: typography.h1.size,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: typography.h1.size * typography.h1.lineHeight,
  },
  sub: {
    fontFamily,
    fontSize: typography.body.size,
    color: colors.text2,
    textAlign: 'center',
    lineHeight: typography.body.size * typography.body.lineHeight,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: space[6] },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.borderStrong },
  dotOn: { width: 22, backgroundColor: colors.brand },
});
