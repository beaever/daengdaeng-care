import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SymptomResult, type SymptomResultData } from './SymptomResult';

const baseResult: SymptomResultData = {
  level: 'today',
  reason: '구토가 반복되고 있어요.',
  actions: ['물을 조금씩 주세요'],
};

describe('SymptomResult.Disclaimer', () => {
  // RULES(4): 증상 결과 화면의 수의사 면책 고지는 항상 표시되어야 한다.
  it('수의사 면책 고지를 항상 렌더한다', () => {
    render(
      <SymptomResult result={baseResult}>
        <SymptomResult.Disclaimer />
      </SymptomResult>,
    );
    expect(screen.getByText(/수의사의 진단을 대신하지 않습니다/)).toBeInTheDocument();
  });
});

describe('SymptomResult.HospitalButton', () => {
  it('emergency 레벨에서 병원 찾기 버튼을 렌더한다', () => {
    render(
      <SymptomResult result={{ ...baseResult, level: 'emergency' }}>
        <SymptomResult.HospitalButton />
      </SymptomResult>,
    );
    expect(screen.getByText('지금 병원 찾기')).toBeInTheDocument();
  });

  it('watch 레벨에서는 병원 찾기 버튼을 렌더하지 않는다', () => {
    render(
      <SymptomResult result={{ ...baseResult, level: 'watch' }}>
        <SymptomResult.HospitalButton />
      </SymptomResult>,
    );
    expect(screen.queryByText('지금 병원 찾기')).not.toBeInTheDocument();
  });
});

describe('SymptomResult.SeverityBadge', () => {
  it('결과 레벨에 맞는 Verdict 라벨을 렌더한다', () => {
    render(
      <SymptomResult result={{ ...baseResult, level: 'emergency' }}>
        <SymptomResult.SeverityBadge />
      </SymptomResult>,
    );
    expect(screen.getByText('바로 병원으로')).toBeInTheDocument();
  });
});
