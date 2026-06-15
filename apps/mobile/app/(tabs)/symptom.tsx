import React from 'react';
import { Placeholder } from '../../components/Placeholder';

// 증상 탭 — 증상 체크
export default function SymptomScreen() {
  return (
    <Placeholder
      emoji="🩺"
      title="증상"
      description="증상 체크 · 응급도 진단"
      screens={[
        'SCR-009 증상 카테고리',
        'SCR-010 증상 질문 (SymptomChecker)',
        '(인터스티셜) 전면 광고',
        'SCR-011 증상 결과 (SymptomResult)',
      ]}
    />
  );
}
