import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeading } from './SectionHeading';

const meta: Meta<typeof SectionHeading> = {
  title: 'Molecules/SectionHeading',
  component: SectionHeading,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = { args: { children: '오늘의 건강 기록' } };
