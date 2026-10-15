import React from 'react';
import { render } from '@testing-library/react-native';
import { FOODS } from '@daengdaeng/constants';
import { FoodResult } from './FoodResult';

// RULES(4) · App Store 1.4.1: 수의사 상담 고지는 음식 레벨과 무관하게 항상 렌더되어야 한다.
describe('FoodResult — 면책 고지 (RULES 4)', () => {
  it.each(Object.keys(FOODS))('%s 결과에 수의사 상담 고지가 보인다', async (name) => {
    const { getByText } = await render(<FoodResult food={FOODS[name]} />);
    expect(getByText(/참고용 정보예요. 이미 먹었거나 이상 증상이 있으면 수의사와 상담하세요/)).toBeTruthy();
    expect(getByText(/근거 자료:/)).toBeTruthy();
  });
});
