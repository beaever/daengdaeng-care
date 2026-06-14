import type { Meta, StoryObj } from '@storybook/react';
import { FoodResult } from './FoodResult';

const meta: Meta<typeof FoodResult> = {
  title: 'Compound/FoodResult',
  component: FoodResult,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FoodResult>;

const dangerFood = {
  name: '포도',
  level: 'danger' as const,
  reason: '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있어요. 아주 적은 양도 위험합니다.',
  ingredient: '타르타르산(추정)',
  symptoms: ['구토, 설사', '무기력함', '소변량 감소'],
  related: ['건포도', '포도주스', '포도씨유'],
};

const safeFood = {
  name: '당근',
  level: 'safe' as const,
  reason: '저칼로리에 식이섬유가 풍부해요. 치아 건강에도 좋은 안전한 간식입니다.',
  serve: '생으로도, 익혀서도 OK. 목에 걸리지 않게 작게 잘라 주세요.',
  nutrition: ['베타카로틴', '식이섬유', '비타민 A', '비타민 K'],
  related: ['고구마', '브로콜리', '호박'],
};

export const Danger: Story = {
  render: () => (
    <FoodResult food={dangerFood}>
      <FoodResult.Header />
      <FoodResult.SafetyBadge />
      <FoodResult.Description />
      <FoodResult.Symptoms />
      <FoodResult.RelatedFoods />
      <FoodResult.AdBanner />
    </FoodResult>
  ),
};

export const Safe: Story = {
  render: () => (
    <FoodResult food={safeFood}>
      <FoodResult.Header />
      <FoodResult.SafetyBadge />
      <FoodResult.Description />
      <FoodResult.Nutrition />
      <FoodResult.RelatedFoods />
      <FoodResult.AdBanner />
    </FoodResult>
  ),
};
