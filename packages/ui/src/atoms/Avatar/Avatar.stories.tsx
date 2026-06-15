import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const EmojiFallback: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const WithImage: Story = {
  args: { size: 'lg', src: 'https://placedog.net/200/200', alt: '반려견' },
};
