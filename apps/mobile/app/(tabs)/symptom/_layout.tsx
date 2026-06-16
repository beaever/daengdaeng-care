import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 증상 탭 내부 스택 — 카테고리(index) → 질문 → (전면광고) → 결과로 push.
export default function SymptomLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackTitle: '',
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="questions" options={{ title: '증상 체크' }} />
      <Stack.Screen name="interstitial" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ title: '증상 체크 결과' }} />
    </Stack>
  );
}
