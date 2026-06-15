import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, space, radius, fontFamily, typography, palette } from '../../../theme';
import { Button } from '../../../components/ui';

const FRAME = 230;

// SCR-007 · 사료 스캔 (음식 탭) — 카메라 뷰 + 스캔 프레임(레이저 애니메이션) + 보조 검색.
export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const laser = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(laser, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(laser, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [laser]);

  const translateY = laser.interpolate({ inputRange: [0, 1], outputRange: [6, FRAME - 6] });
  const toAnalysis = () => router.push('/food/analysis');

  return (
    <View style={styles.root}>
      <Pressable style={styles.camWrap} onPress={toAnalysis}>
        <LinearGradient
          colors={[palette.stone[800], palette.stone[900]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cam}
        >
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
          </View>
          <Text style={styles.hint}>바코드를 사각형 안에 맞춰주세요 · 탭하여 데모</Text>
        </LinearGradient>
      </Pressable>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + space[5] }]}>
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>또는</Text>
          <View style={styles.orLine} />
        </View>
        <Button variant="secondary" block size="lg" onPress={toAnalysis}>
          🔍 제품명으로 검색
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  camWrap: { flex: 1 },
  cam: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  frame: { width: FRAME, height: FRAME },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: palette.stone[0],
    borderWidth: 3,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  laser: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: palette.brand[400],
  },
  hint: {
    fontFamily,
    fontSize: typography.caption.size,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    paddingHorizontal: space[6],
  },
  bottom: { paddingHorizontal: space[5], paddingTop: space[5], gap: space[4] },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  orText: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: colors.text3 },
});
