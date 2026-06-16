import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const NoRecords: Story = {
  args: {
    icon: '📋',
    title: '아직 기록이 없어요',
    description: '첫 건강 기록을 추가해보세요.',
    action: <Button>기록 추가하기</Button>,
  },
};
