import React from 'react';
import { render } from '@testing-library/react-native';
import { SYMPTOM_RESULTS } from '@daengdaeng/constants';
import { SymptomResult } from './SymptomResult';

// RULES(4): 면책 고지는 level 과 무관하게 항상 렌더되어야 한다 — 삭제 금지.
// RULES(1): emergency 레벨 화면에는 광고가 렌더되지 않아야 한다.
describe('SymptomResult — 면책 고지 (RULES 4)', () => {
  it.each(Object.keys(SYMPTOM_RESULTS) as (keyof typeof SYMPTOM_RESULTS)[])(
    '%s 레벨에서 수의사 면책 고지가 보인다',
    async (level) => {
      const { getByText, queryByText } = await render(
        <SymptomResult result={SYMPTOM_RESULTS[level]} />
      );

      expect(getByText(/수의사의 진단을 대신하지 않아요/)).toBeTruthy();

      // RULES(1): 광고 관련 텍스트가 결과 화면에 없어야 한다.
      expect(queryByText(/광고/)).toBeNull();
      expect(queryByText(/^AD$/)).toBeNull();
    }
  );
});
