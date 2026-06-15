import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { colors, fontFamily, layout } from '../../theme';

function tabIcon(emoji: string) {
  const TabIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 20, color }}>{emoji}</Text>
  );
  TabIcon.displayName = `TabIcon(${emoji})`;
  return TabIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.text3,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: layout.tabbarHeight,
        },
        tabBarLabelStyle: { fontFamily, fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: '홈', tabBarIcon: tabIcon('🏠') }} />
      <Tabs.Screen name="food" options={{ title: '음식', tabBarIcon: tabIcon('🍖') }} />
      <Tabs.Screen name="symptom" options={{ title: '증상', tabBarIcon: tabIcon('🩺') }} />
      <Tabs.Screen name="hospital" options={{ title: '병원', tabBarIcon: tabIcon('🏥') }} />
      <Tabs.Screen name="record" options={{ title: '기록', tabBarIcon: tabIcon('📋') }} />
    </Tabs>
  );
}
