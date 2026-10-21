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
