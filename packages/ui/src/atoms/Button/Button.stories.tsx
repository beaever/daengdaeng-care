import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: '음식 확인하기', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: '취소', variant: 'secondary' },
};

export const Outline: Story = {
  args: { children: '더 보기', variant: 'outline' },
};

export const Ghost: Story = {
  args: { children: '건너뛰기', variant: 'ghost' },
};

export const Danger: Story = {
  args: { children: '기록 삭제', variant: 'danger' },
};

export const Large: Story = {
  args: { children: '병원 찾기', variant: 'primary', size: 'lg', block: true },
};

export const Disabled: Story = {
  args: { children: '저장하기', variant: 'primary', disabled: true },
};
