import type { Meta, StoryObj } from '@storybook/react';
import { NativeAd } from './NativeAd';

const meta: Meta<typeof NativeAd> = {
  title: 'Molecules/NativeAd',
  component: NativeAd,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof NativeAd>;

export const Default: Story = {
  args: {
    title: '강아지 영양제 30% 할인',
    description: '관절 건강을 위한 프리미엄 영양제',
  },
};
