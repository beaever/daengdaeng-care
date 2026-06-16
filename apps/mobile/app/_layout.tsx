import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
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
      </Stack>
    </SafeAreaProvider>
  );
}
