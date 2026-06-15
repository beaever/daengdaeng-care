import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PillGroup } from './PillGroup';

const meta: Meta<typeof PillGroup> = {
  title: 'Atoms/PillGroup',
  component: PillGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PillGroup>;

export const Gender: Story = {
  render: () => {
    const [v, setV] = useState('female');
    return (
      <PillGroup
        value={v}
        onChange={setV}
        options={[
          { label: '남아', value: 'male' },
          { label: '여아', value: 'female' },
        ]}
      />
    );
  },
};

export const Neutered: Story = {
  render: () => {
    const [v, setV] = useState('yes');
    return (
      <PillGroup
        value={v}
        onChange={setV}
        options={[
          { label: '했어요', value: 'yes' },
          { label: '안했어요', value: 'no' },
          { label: '몰라요', value: 'unknown' },
        ]}
      />
    );
  },
};
