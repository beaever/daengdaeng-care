import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Verdict } from './Verdict';

describe('Verdict', () => {
  it('레벨별 기본 라벨·아이콘을 렌더한다', () => {
    render(<Verdict level="safe" />);
    expect(screen.getByText('먹어도 좋아요')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('danger 레벨은 위험 라벨과 🚨 아이콘을 렌더한다', () => {
    render(<Verdict level="danger" />);
    expect(screen.getByText('절대 안 돼요')).toBeInTheDocument();
    expect(screen.getByText('🚨')).toBeInTheDocument();
  });

  it('emergency(증상 심각도) 레벨도 렌더된다', () => {
    render(<Verdict level="emergency" />);
    expect(screen.getByText('바로 병원으로')).toBeInTheDocument();
  });

  it('label·sub prop으로 기본 문구를 덮어쓴다', () => {
    render(<Verdict level="caution" label="포도" sub="신장 손상 위험" />);
    expect(screen.getByText('포도')).toBeInTheDocument();
    expect(screen.getByText('신장 손상 위험')).toBeInTheDocument();
    // 커스텀 label이 있으면 기본 라벨은 표시되지 않는다.
    expect(screen.queryByText('소량만 주세요')).not.toBeInTheDocument();
  });

  it('sub가 없으면 sub 노드를 렌더하지 않는다', () => {
    const { container } = render(<Verdict level="safe" />);
    // verdict 컨테이너 + icon + label = 자식 span 2개(icon, label)
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(2);
  });
});
