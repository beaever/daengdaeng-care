import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Back: Story = {
  args: { 'aria-label': '뒤로가기', children: '←' },
};

export const Close: Story = {
  args: { 'aria-label': '닫기', children: '✕' },
};

export const More: Story = {
  args: { 'aria-label': '더보기', children: '⋯' },
};
