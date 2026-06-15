import type { Meta, StoryObj } from '@storybook/react';
import { Field, Input, Textarea } from './Input';

const meta: Meta = {
  title: 'Atoms/Input',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const PlainInput: Story = {
  render: () => <Input placeholder="반려견 이름을 입력하세요" />,
};

export const WithIcon: Story = {
  render: () => <Input leftIcon="🔍" placeholder="음식 이름 검색" />,
};

export const FieldWithInput: Story = {
  render: () => (
    <Field label="반려견 이름" required htmlFor="name">
      <Input id="name" placeholder="예) 댕댕이" />
    </Field>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <Field label="메모">
      <Textarea placeholder="증상이나 특이사항을 적어주세요" />
    </Field>
  ),
};
