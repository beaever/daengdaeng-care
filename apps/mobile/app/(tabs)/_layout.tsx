import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, layout } from '../../theme';

function tabIcon(emoji: string) {
  const TabIcon = ({ color }: { color: string }) => (
    <Text style={{ fontSize: 20, color }}>{emoji}</Text>
  );
  TabIcon.displayName = `TabIcon(${emoji})`;
  return TabIcon;
}

export default function TabsLayout() {
  // 디자인: 탭바 높이 58px + 하단 safe-area inset (홈 인디케이터/제스처 바 영역).
  // height 에 inset 을 더하지 않으면 inset 이 58 안으로 먹혀 콘텐츠가 쪼그라든다.
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.text3,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: layout.tabbarHeight + insets.bottom,
          paddingTop: 7, // reference app.css .app-tabbar padding-top
          paddingBottom: insets.bottom,
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
