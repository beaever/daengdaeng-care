import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Option } from './Option';

const meta: Meta<typeof Option> = {
  title: 'Atoms/Option',
  component: Option,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Option>;

export const Single: Story = {
  args: { label: '구토를 했어요', selected: true },
};

export const Group: Story = {
  render: () => {
    const [sel, setSel] = useState('a');
    const items = [
      { value: 'a', label: '1회', description: '한 번만 토했어요' },
      { value: 'b', label: '2~3회', description: '여러 번 반복돼요' },
      { value: 'c', label: '4회 이상', description: '계속 토하고 있어요' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 320 }}>
        {items.map((i) => (
          <Option
            key={i.value}
            label={i.label}
            description={i.description}
            selected={sel === i.value}
            onSelect={() => setSel(i.value)}
          />
        ))}
      </div>
    );
  },
};
