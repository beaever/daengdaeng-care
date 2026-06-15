import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, space, radius, fontFamily, typography } from '../../../theme';
import { Button } from '../../../components/ui';

// (인터스티셜) · 전면 광고 — 비응급 결과 직전. 5초 카운트다운 후 닫기 노출.
// RULES(1): emergency는 이 화면을 거치지 않는다(questions에서 결과로 직행).
export default function InterstitialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ verdict?: string }>();
  const [sec, setSec] = useState(5);

  useEffect(() => {
    if (sec <= 0) return;
    const t = setTimeout(() => setSec((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec]);

  const close = () => {
    router.replace({ pathname: '/symptom/result', params: { verdict: params.verdict ?? 'watch' } });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        {sec <= 0 && (
          <Pressable onPress={close} style={styles.closeBtn} accessibilityLabel="광고 닫기">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        )}
        <View style={styles.art}>
          <Text style={styles.artEmoji}>🦴</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.adTag}>AD · 광고</Text>
          <Text style={styles.headline}>튼튼한 관절을 위한{'\n'}관절 영양제</Text>
          <Text style={styles.desc}>수의사 추천 · 첫 구매 40% 할인</Text>
          <View style={styles.cta}>
            <Button block size="lg" onPress={close}>
              자세히 보기
            </Button>
          </View>
          <Text style={styles.skip}>{sec > 0 ? `${sec}초 후 결과를 볼 수 있어요` : '닫고 결과 보기'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    paddingHorizontal: space[5],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: space[3],
    right: space[3],
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text2 },
  art: {
    height: 180,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artEmoji: { fontSize: 72 },
  body: { padding: space[5], gap: 6 },
  adTag: {
    fontFamily,
    fontSize: typography.micro.size,
    fontWeight: '800',
    color: colors.text3,
    letterSpacing: typography.micro.letterSpacing,
  },
  headline: {
    fontFamily,
    fontSize: typography.h2.size,
    fontWeight: '800',
    color: colors.text,
    lineHeight: typography.h2.size * typography.h2.lineHeight,
    marginTop: 2,
  },
  desc: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  cta: { marginTop: space[4] },
  skip: { fontFamily, fontSize: typography.caption.size, color: colors.text3, textAlign: 'center', marginTop: space[2] },
});
