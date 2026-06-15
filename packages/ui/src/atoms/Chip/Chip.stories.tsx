import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'brand', 'selected'] },
  },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = { args: { children: '소형견' } };
export const Brand: Story = { args: { children: '추천', variant: 'brand' } };
export const Selected: Story = { args: { children: '활동량 많음', variant: 'selected' } };
export const Removable: Story = {
  args: { children: '닭가슴살', variant: 'brand', onRemove: () => alert('제거') },
};
