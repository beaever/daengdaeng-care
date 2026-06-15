import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../../theme';

// 병원 탭 내부 스택 — 목록(index) → 상세(detail)로 push.
export default function HospitalLayout() {
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
      <Stack.Screen name="index" options={{ title: '근처 동물병원' }} />
      <Stack.Screen name="detail" options={{ title: '병원 정보' }} />
    </Stack>
  );
}
