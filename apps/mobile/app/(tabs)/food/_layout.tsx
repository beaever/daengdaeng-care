import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 음식 탭 내부 스택 — 검색(index) → 결과로 push. 사료 분석(F002)은 v1.1.
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
    </Stack>
  );
}
