import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HealthRecord, type HealthRecordEntry, type RecordTab } from './HealthRecord';

const meta: Meta<typeof HealthRecord> = {
  title: 'Compound/HealthRecord',
  component: HealthRecord,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HealthRecord>;

const records: HealthRecordEntry[] = [
  { type: 'vaccine', title: '광견병 예방접종', sub: '행복한 동물병원', date: '2026년 6월' },
  { type: 'weight', title: '체중 5.2kg', sub: '+0.1kg', date: '2026년 6월' },
  { type: 'vet', title: '정기 건강검진', sub: '이상 없음', date: '2026년 5월' },
  { type: 'weight', title: '체중 5.1kg', sub: '-0.2kg', date: '2026년 5월' },
];

export const Timeline: Story = {
  render: () => {
    const [tab, setTab] = useState<RecordTab>('all');
    return (
      <HealthRecord pet={{ name: '댕댕이' }} records={records} tab={tab} onTab={setTab}>
        <HealthRecord.PetHeader />
        <HealthRecord.CategoryTabs />
        <HealthRecord.Timeline />
      </HealthRecord>
    );
  },
};
