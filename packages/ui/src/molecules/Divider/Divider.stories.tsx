import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Molecules/Divider',
  component: Divider,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = { args: {} };
export const Inset: Story = { args: { inset: true } };
