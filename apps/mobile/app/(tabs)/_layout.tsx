import React from 'react';
import { Text, type ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, layout, fontScale } from '../../theme';

function tabIcon(emoji: string) {
  const TabIcon = ({ color }: { color: ColorValue }) => (
    <Text style={{ fontSize: 20, color }} maxFontSizeMultiplier={fontScale.icon}>
      {emoji}
    </Text>
  );
  TabIcon.displayName = `TabIcon(${emoji})`;
  return TabIcon;
}

const TABS = [
  ['home', '홈', '🏠'],
  ['walks', '산책', '🐾'],
  ['symptom', '증상', '🩺'],
  ['hospital', '병원', '🏥'],
  ['record', '기록', '📋'],
] as const;

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
      {TABS.map(([name, title, emoji], i) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: tabIcon(emoji),
            // 기본 라벨은 숨긴 food 까지 세어 "of 6" 으로 읽히고 영어가 섞인다.
            tabBarAccessibilityLabel: `${title}, 탭, ${TABS.length}개 중 ${i + 1}번째`,
          }}
        />
      ))}
      {/* 음식 판별은 탭바에서 빼고 홈 바로가기로만 진입 (탭 5개 유지, HIG) */}
      <Tabs.Screen name="food" options={{ href: null }} />
    </Tabs>
  );
}
