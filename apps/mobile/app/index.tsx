import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { palette, fontFamily, typography } from '../theme';
import { getPet } from '../lib/pets';

// SCR-001 · 스플래시 — 1.7초 후 가입 여부에 따라 홈/온보딩으로 자동 전환.
export default function SplashScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 로고 pop (ease-spring 느낌)
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => {
      getPet(db).then((pet) => router.replace(pet ? '/home' : '/onboarding'));
    }, 1700);
    return () => clearTimeout(t);
  }, [router, db, scale, opacity]);

  return (
    <LinearGradient
      colors={[palette.brand[400], palette.brand[600]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <Animated.View style={[styles.mark, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.markEmoji}>🐶</Text>
      </Animated.View>
      <Animated.Text style={[styles.word, { opacity }]}>댕댕케어</Animated.Text>
      <Animated.Text style={[styles.tag, { opacity }]}>
        강아지와 함께하는 매일, 더 안심하게
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  markEmoji: { fontSize: 48 },
  word: {
    fontFamily,
    fontSize: typography.display.size,
    fontWeight: '800',
    color: palette.stone[0],
    marginBottom: 10,
  },
  tag: {
    fontFamily,
    fontSize: typography.sub.size,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.92)',
  },
});
