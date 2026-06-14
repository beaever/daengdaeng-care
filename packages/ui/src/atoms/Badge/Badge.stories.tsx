import type { Meta, StoryObj } from '@storybook/react';
import { SafetyBadge, StatusBadge, GradeBadge } from './Badge';

const meta: Meta = { title: 'Atoms/Badge', tags: ['autodocs'] };
export default meta;

export const SafetyLevels: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <SafetyBadge level="safe" />
      <SafetyBadge level="caution" />
      <SafetyBadge level="danger" />
    </div>
  ),
};

export const HospitalStatus: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 10 }}>
      <StatusBadge isOpen is24h />
      <StatusBadge isOpen />
      <StatusBadge isOpen={false} />
    </div>
  ),
};

export const FoodGrades: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <GradeBadge grade="A" label="최상" />
      <GradeBadge grade="B" label="괜찮아요" />
      <GradeBadge grade="C" label="주의" />
      <GradeBadge grade="D" label="비추천" />
    </div>
  ),
};
