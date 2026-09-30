import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { colors } from '../theme';
import { DATABASE_NAME, migrate } from '../lib/db';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              title: '설정',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
            }}
          />
          {/* profile: 등록 모드는 헤더 없음(온보딩 흐름), 편집 모드 헤더는 profile.tsx 에서 Stack.Screen 으로 켠다 */}
          <Stack.Screen name="profile" />
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
