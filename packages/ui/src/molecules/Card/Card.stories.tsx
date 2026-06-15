import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Padded: Story = {
  args: { pad: true, children: '카드 내용입니다.' },
};

export const Flat: Story = {
  args: { pad: true, flat: true, children: '그림자 없는 카드.' },
};
