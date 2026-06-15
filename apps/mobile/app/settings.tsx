import React from 'react';
import { Placeholder } from '../components/Placeholder';

// SCR-016 · 설정
export default function SettingsScreen() {
  return (
    <Placeholder
      emoji="⚙️"
      title="설정"
      description="프로필 · 알림 · 앱 정보"
      screens={['SCR-016 설정']}
    />
  );
}
