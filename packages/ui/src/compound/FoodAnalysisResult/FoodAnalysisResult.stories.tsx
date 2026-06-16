import type { Meta, StoryObj } from '@storybook/react';
import { FoodAnalysisResult, type ProductData } from './FoodAnalysisResult';

const meta: Meta<typeof FoodAnalysisResult> = {
  title: 'Compound/FoodAnalysisResult',
  component: FoodAnalysisResult,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FoodAnalysisResult>;

const product: ProductData = {
  name: '오리젠 오리지널 독',
  brand: 'ORIJEN',
  grade: 'A',
  gradeLabel: '아주 좋아요',
  ingredients: [
    { name: '닭고기', status: 'safe' },
    { name: '칠면조', status: 'safe' },
    { name: '청어', status: 'safe' },
    { name: '렌틸콩', status: 'caution' },
    { name: '병아리콩', status: 'caution' },
  ],
  warnings: ['렌틸콩·병아리콩 등 콩류 함량이 높아 일부 견에게 소화 불량을 유발할 수 있어요.'],
};

export const GradeA: Story = {
  render: () => (
    <FoodAnalysisResult product={product}>
      <FoodAnalysisResult.ProductHeader />
      <FoodAnalysisResult.Grade />
      <FoodAnalysisResult.IngredientList />
      <FoodAnalysisResult.WarningSection />
    </FoodAnalysisResult>
  ),
};
