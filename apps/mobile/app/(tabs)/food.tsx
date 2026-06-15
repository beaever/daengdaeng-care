import React from 'react';
import { Placeholder } from '../../components/Placeholder';

// 음식 탭 — 음식 판별 / 사료 분석
export default function FoodScreen() {
  return (
    <Placeholder
      emoji="🍖"
      title="음식"
      description="음식 판별 · 사료 성분 분석"
      screens={[
        'SCR-005 음식 검색',
        'SCR-006 음식 결과 (FoodResult)',
        'SCR-007 사료 스캔',
        'SCR-008 사료 분석 결과 (FoodAnalysisResult)',
      ]}
    />
  );
}
