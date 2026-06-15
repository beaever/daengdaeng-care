import type { Meta, StoryObj } from '@storybook/react';
import { HealthSummaryCard } from './HealthSummaryCard';

const meta: Meta<typeof HealthSummaryCard> = {
  title: 'Compound/HealthSummaryCard',
  component: HealthSummaryCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HealthSummaryCard>;

export const Default: Story = {
  args: {
    weight: '5.2kg (+0.1)',
    lastVisit: '2026.05.20 정기검진',
    nextVaccine: '6/30 종합백신',
  },
};
