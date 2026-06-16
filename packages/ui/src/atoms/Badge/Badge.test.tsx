import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SafetyBadge, StatusBadge, GradeBadge } from './Badge';

describe('SafetyBadge', () => {
  it('레벨별 기본 라벨을 렌더한다', () => {
    render(<SafetyBadge level="safe" />);
    expect(screen.getByText('먹어도 좋아요')).toBeInTheDocument();
  });

  it('label prop으로 문구를 덮어쓴다', () => {
    render(<SafetyBadge level="danger" label="초콜릿" />);
    expect(screen.getByText('초콜릿')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it('is24h면 "24시간"을 우선 렌더한다', () => {
    render(<StatusBadge isOpen={false} is24h />);
    expect(screen.getByText('24시간')).toBeInTheDocument();
  });

  it('진료중이면 "진료중"을 렌더한다', () => {
    render(<StatusBadge isOpen />);
    expect(screen.getByText('진료중')).toBeInTheDocument();
  });

  it('닫혀 있으면 "진료마감"을 렌더한다', () => {
    render(<StatusBadge isOpen={false} />);
    expect(screen.getByText('진료마감')).toBeInTheDocument();
  });
});

describe('GradeBadge', () => {
  it('등급 문자를 렌더한다', () => {
    render(<GradeBadge grade="A" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('label이 있으면 함께 렌더한다', () => {
    render(<GradeBadge grade="B" label="좋음" />);
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('좋음')).toBeInTheDocument();
  });
});
