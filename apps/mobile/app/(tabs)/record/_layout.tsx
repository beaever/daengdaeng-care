import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 기록 탭 내부 스택 — 타임라인(index) → 기록 추가(add) 시트로 push.
export default function RecordLayout() {
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
      <Stack.Screen name="index" options={{ title: '건강 기록' }} />
      <Stack.Screen name="add" options={{ title: '기록 추가', presentation: 'modal' }} />
    </Stack>
  );
}
