import type { Meta, StoryObj } from '@storybook/react';
import { QuickMenu } from './QuickMenu';

const meta: Meta<typeof QuickMenu> = {
  title: 'Compound/QuickMenu',
  component: QuickMenu,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof QuickMenu>;

export const Default: Story = {
  args: {
    items: [
      { icon: '🍖', label: '음식 판별', sub: '먹어도 될까?' },
      { icon: '🥫', label: '사료 분석', sub: '성분 확인' },
      { icon: '🩺', label: '증상 체크', sub: '응급도 진단' },
      { icon: '🏥', label: '병원 찾기', sub: '주변 병원' },
    ],
  },
};
