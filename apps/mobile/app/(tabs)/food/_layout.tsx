import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 음식 탭 내부 스택 — 검색(index) → 결과/스캔/분석으로 push.
export default function FoodLayout() {
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
      <Stack.Screen name="result" options={{ title: '이거 먹어도 될까요?' }} />
      <Stack.Screen name="scan" options={{ title: '사료 성분 분석' }} />
      <Stack.Screen name="analysis" options={{ title: '사료 성분 분석' }} />
    </Stack>
  );
}
