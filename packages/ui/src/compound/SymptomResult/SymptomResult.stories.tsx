import type { Meta, StoryObj } from '@storybook/react';
import { SymptomResult, type SymptomResultData } from './SymptomResult';

const meta: Meta<typeof SymptomResult> = {
  title: 'Compound/SymptomResult',
  component: SymptomResult,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SymptomResult>;

const emergency: SymptomResultData = {
  level: 'emergency',
  reason: '반복적인 구토와 무기력은 응급 상황일 수 있어요. 탈수나 중독 가능성이 있습니다.',
  actions: ['음식과 물 급여를 중단하세요', '토사물 상태를 사진으로 기록하세요', '가까운 24시간 병원에 연락하세요'],
  watchList: ['혈변·혈토가 보일 때', '의식이 흐려질 때', '경련이 동반될 때'],
};

const watch: SymptomResultData = {
  level: 'watch',
  reason: '가벼운 증상으로 보여요. 집에서 경과를 지켜봐도 괜찮습니다.',
  actions: ['8~12시간 금식 후 소량 급여', '신선한 물을 제공하세요', '활동량을 줄여주세요'],
  watchList: ['증상이 24시간 이상 지속될 때', '식욕이 완전히 사라질 때'],
};

export const Emergency: Story = {
  render: () => (
    <SymptomResult result={emergency} onFindHospital={() => alert('병원 찾기')}>
      <SymptomResult.SeverityBadge />
      <SymptomResult.Reason />
      <SymptomResult.ActionList />
      <SymptomResult.WatchList />
      <SymptomResult.HospitalButton />
      <SymptomResult.Disclaimer />
    </SymptomResult>
  ),
};

export const Watch: Story = {
  render: () => (
    <SymptomResult result={watch}>
      <SymptomResult.SeverityBadge />
      <SymptomResult.Reason />
      <SymptomResult.ActionList />
      <SymptomResult.WatchList />
      <SymptomResult.HospitalButton />
      <SymptomResult.Disclaimer />
    </SymptomResult>
  ),
};
