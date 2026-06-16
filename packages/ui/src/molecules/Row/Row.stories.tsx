import type { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';

const meta: Meta<typeof Row> = {
  title: 'Molecules/Row',
  component: Row,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Row>;

export const WithIcon: Story = {
  args: { icon: '🍖', title: '음식 판별', sub: '먹어도 되는지 확인하세요', onClick: () => {} },
};

export const NoChevron: Story = {
  args: { icon: '📋', title: '건강 기록', sub: '최근 3건', chevron: false },
};
