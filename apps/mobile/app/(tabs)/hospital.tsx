import React from 'react';
import { Placeholder } from '../../components/Placeholder';

// 병원 탭 — 병원 찾기
export default function HospitalScreen() {
  return (
    <Placeholder
      emoji="🏥"
      title="병원"
      description="주변 동물병원 찾기"
      screens={[
        'SCR-012 병원 목록 (HospitalList)',
        'SCR-013 병원 상세',
      ]}
    />
  );
}
