import type { Meta, StoryObj } from '@storybook/react';
import { PetProfileCard } from './PetProfileCard';

const meta: Meta<typeof PetProfileCard> = {
  title: 'Compound/PetProfileCard',
  component: PetProfileCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PetProfileCard>;

export const Default: Story = {
  args: {
    name: '댕댕이',
    breed: '말티즈',
    age: '3살',
    nextVaccine: '다음 접종 D-15',
  },
};
