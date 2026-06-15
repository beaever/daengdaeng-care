import React from 'react';
import { Placeholder } from '../../components/Placeholder';

// SCR-004 · 홈 (탭1) — 허브
export default function HomeScreen() {
  return (
    <Placeholder
      emoji="🐶"
      title="홈"
      description="반려견 건강 관리 허브"
      screens={[
        'SCR-001 스플래시',
        'SCR-002 온보딩',
        'SCR-003 프로필 등록',
        'SCR-004 홈 (PetProfileCard · QuickMenu · HealthSummaryCard)',
        'SCR-016 설정',
      ]}
    />
  );
}
