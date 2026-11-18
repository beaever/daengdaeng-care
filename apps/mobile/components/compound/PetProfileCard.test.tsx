import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PetProfileCard } from './PetProfileCard';
import type { Pet } from '../../lib/pets';

const mk = (id: number, name: string): Pet =>
  ({ id, name, breed: null, dob: null, sex: null, neutered: null, photo: null } as Pet);
const pets = [mk(1, '뭉치'), mk(2, '콩이')];

describe('PetProfileCard.Switcher', () => {
  it('선택된 칩은 selected 상태다', async () => {
    const { getByLabelText } = await render(
      <PetProfileCard.Switcher pets={pets} currentId={1} onSelect={jest.fn()} onAdd={jest.fn()} />
    );
    expect(getByLabelText('🐶 뭉치').props.accessibilityState).toEqual({ selected: true });
    expect(getByLabelText('🐕 콩이').props.accessibilityState).toEqual({ selected: false });
  });

  it('다른 칩은 onSelect(id), 추가 칩은 onAdd', async () => {
    const onSelect = jest.fn();
    const onAdd = jest.fn();
    const { getByText } = await render(
      <PetProfileCard.Switcher pets={pets} currentId={1} onSelect={onSelect} onAdd={onAdd} />
    );
    await fireEvent.press(getByText('🐕 콩이'));
    expect(onSelect).toHaveBeenCalledWith(2);
    await fireEvent.press(getByText('＋ 추가'));
    expect(onAdd).toHaveBeenCalled();
  });

  it('1마리여도 추가 칩이 보인다', async () => {
    const { getByText } = await render(
      <PetProfileCard.Switcher pets={[pets[0]]} currentId={1} onSelect={jest.fn()} onAdd={jest.fn()} />
    );
    expect(getByText('＋ 추가')).toBeTruthy();
  });
});
