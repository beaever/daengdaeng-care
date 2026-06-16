import type { Meta, StoryObj } from '@storybook/react';
import { Bullets } from './Bullets';

const meta: Meta<typeof Bullets> = {
  title: 'Molecules/Bullets',
  component: Bullets,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Bullets>;

export const Danger: Story = {
  args: {
    variant: 'danger',
    items: ['초콜릿은 절대 금지', '포도·건포도 금지', '양파·마늘 금지'],
  },
};

export const Safe: Story = {
  args: {
    variant: 'safe',
    items: ['익힌 닭가슴살', '삶은 고구마', '당근'],
  },
};
