import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HealthRecord } from './HealthRecord';
import type { HealthRecord as Rec } from '../../lib/records';

const base: Rec = {
  id: 1, pet_id: 1, type: 'walk', date: '2026-10-20', title: '32분 산책', sub: '1.2km',
  notes: null, next_date: null, photo: null, has_route: 1, created_at: '',
};

describe('HealthRecord.Entry — onOpen', () => {
  it('경로가 있는 산책은 탭하면 onOpen 이 호출된다', async () => {
    const onOpen = jest.fn();
    const { getByText } = await render(
      <HealthRecord.Entry rec={base} records={[base]} onDelete={jest.fn()} onOpen={onOpen} />
    );
    await fireEvent.press(getByText('32분 산책'));
    expect(onOpen).toHaveBeenCalledWith(1);
  });

  it('경로가 없으면 탭해도 onOpen 이 호출되지 않는다', async () => {
    const onOpen = jest.fn();
    const rec = { ...base, has_route: 0 as const };
    const { getByText, queryByText } = await render(
      <HealthRecord.Entry rec={rec} records={[rec]} onDelete={jest.fn()} onOpen={onOpen} />
    );
    await fireEvent.press(getByText('32분 산책'));
    expect(onOpen).not.toHaveBeenCalled();
    expect(queryByText(/경로 보기/)).toBeNull();
  });
});

describe('HealthRecord — 예방약', () => {
  const med: Rec = {
    id: 2, pet_id: 1, type: 'medicine', date: '2026-11-01', title: '심장사상충', sub: null,
    notes: null, next_date: '2026-12-01', photo: null, has_route: 0, created_at: '',
  };
  const walk: Rec = { ...base, id: 3, has_route: 0 };

  it('라벨·아이콘·다음 투약일을 표시한다', async () => {
    const { getByText } = await render(
      <HealthRecord.Entry rec={med} records={[med]} onDelete={jest.fn()} />
    );
    expect(getByText('예방약')).toBeTruthy();
    expect(getByText('💊')).toBeTruthy();
    expect(getByText('다음 투약: 2026.12.01')).toBeTruthy();
  });

  it('예방약 탭은 예방약 기록만 보여준다', async () => {
    const { getByText, queryByText } = await render(
      <HealthRecord.Timeline records={[med, walk]} tab="medicine" onDelete={jest.fn()} onAdd={jest.fn()} />
    );
    expect(getByText('심장사상충')).toBeTruthy();
    expect(queryByText('32분 산책')).toBeNull();
  });
});
