import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Segment } from './Segment';

const meta: Meta<typeof Segment> = {
  title: 'Atoms/Segment',
  component: Segment,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Segment>;

export const MapList: Story = {
  render: () => {
    const [v, setV] = useState('list');
    return (
      <Segment
        value={v}
        onChange={setV}
        options={[
          { label: '목록', value: 'list' },
          { label: '지도', value: 'map' },
        ]}
      />
    );
  },
};

export const Three: Story = {
  render: () => {
    const [v, setV] = useState('week');
    return (
      <Segment
        value={v}
        onChange={setV}
        options={[
          { label: '일', value: 'day' },
          { label: '주', value: 'week' },
          { label: '월', value: 'month' },
        ]}
      />
    );
  },
};
