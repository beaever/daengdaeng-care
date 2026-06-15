import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HospitalList, type HospitalData } from './HospitalList';
import { NativeAd } from '../../molecules/NativeAd/NativeAd';

const meta: Meta<typeof HospitalList> = {
  title: 'Compound/HospitalList',
  component: HospitalList,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HospitalList>;

const hospitals: HospitalData[] = [
  { name: '댕댕 24시 동물메디컬센터', distance: '0.4km', hours: '24시간 진료', phone: '02-123-4567', isOpen: true, is24h: true },
  { name: '행복한 동물병원', distance: '0.8km', hours: '09:00 - 21:00', phone: '02-234-5678', isOpen: true },
  { name: '우리동네 동물병원', distance: '1.2km', hours: '10:00 - 19:00', phone: '02-345-6789', isOpen: false },
];

export const ListView: Story = {
  render: () => {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [radius, setRadius] = useState('3km');
    return (
      <HospitalList>
        <HospitalList.ViewToggle value={view} onChange={(v) => setView(v as 'list' | 'map')} />
        <HospitalList.RadiusSelector value={radius} onChange={setRadius} />
        {view === 'map' && <HospitalList.Map />}
        <HospitalList.ResultCount count={hospitals.length} />
        {hospitals.map((h, i) => (
          <div key={h.name}>
            <HospitalList.Card hospital={h} />
            {i === 1 && <NativeAd title="반려동물 보험 무료 상담" description="병원비 부담을 덜어보세요" />}
          </div>
        ))}
      </HospitalList>
    );
  },
};
