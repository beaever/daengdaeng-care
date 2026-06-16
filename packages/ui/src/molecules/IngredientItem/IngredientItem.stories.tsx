import type { Meta, StoryObj } from '@storybook/react';
import { IngredientItem } from './IngredientItem';

const meta: Meta<typeof IngredientItem> = {
  title: 'Molecules/IngredientItem',
  component: IngredientItem,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof IngredientItem>;

export const Safe: Story = { args: { rank: 1, name: '닭고기', status: 'safe' } };
export const Caution: Story = { args: { rank: 4, name: '옥수수', status: 'caution' } };
export const Danger: Story = { args: { rank: 7, name: '인공 색소', status: 'danger' } };
