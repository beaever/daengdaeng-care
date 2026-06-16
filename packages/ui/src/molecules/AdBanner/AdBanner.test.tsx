import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdBanner } from './AdBanner';

// RULES: 모든 광고는 [AD] 라벨을 반드시 표시해야 한다.
describe('AdBanner', () => {
  it('항상 AD 라벨을 렌더한다', () => {
    render(<AdBanner />);
    expect(screen.getByText('AD')).toBeInTheDocument();
  });

  it('title·description을 렌더한다', () => {
    render(<AdBanner title="사료 할인" description="이번 주만" />);
    expect(screen.getByText('사료 할인')).toBeInTheDocument();
    expect(screen.getByText('이번 주만')).toBeInTheDocument();
  });
});
