import React from 'react';
import { Placeholder } from '../../components/Placeholder';

// 기록 탭 — 건강 기록
export default function RecordScreen() {
  return (
    <Placeholder
      emoji="📋"
      title="기록"
      description="건강 기록 타임라인"
      screens={[
        'SCR-014 건강 기록 (HealthRecord)',
        'SCR-015 기록 추가 (모달/시트)',
      ]}
    />
  );
}
