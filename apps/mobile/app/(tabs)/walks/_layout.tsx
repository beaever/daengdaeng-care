import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 산책 탭 내부 스택 — 산책 목록(index) → 경로 보기([id])로 push. 탭을 벗어나지 않아야 뒤로 가기가 산책 목록으로 온다.
export default function WalksLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false, title: '산책' }} />
      <Stack.Screen name="[id]" options={{ title: '산책 기록' }} />
    </Stack>
  );
}
