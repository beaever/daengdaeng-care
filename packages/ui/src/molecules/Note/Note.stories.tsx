import type { Meta, StoryObj } from '@storybook/react';
import { Note } from './Note';

const meta: Meta<typeof Note> = {
  title: 'Molecules/Note',
  component: Note,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Note>;

export const Disclaimer: Story = {
  args: {
    children:
      '본 결과는 참고용이며 수의사의 진단을 대신하지 않습니다. 증상이 지속되면 병원을 방문하세요.',
  },
};
