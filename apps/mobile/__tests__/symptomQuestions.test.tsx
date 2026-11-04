import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SYMPTOM_QUESTIONS } from '@daengdaeng/constants';
import SymptomQuestionsScreen from '../app/(tabs)/symptom/questions';

const mockRouter = { push: jest.fn(), replace: jest.fn() };
let mockParams: Record<string, string> = {};
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

describe('증상 질문 화면', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('다음 질문으로 갈 때 뒤로 가기가 직전 질문으로 오도록 화면을 쌓는다', async () => {
    mockParams = { cat: 'digest' };
    await render(<SymptomQuestionsScreen />);
    const opt = SYMPTOM_QUESTIONS.digest![0]!.options.find((o) => typeof o.next === 'number')!;
    fireEvent.press(screen.getByText(opt.label));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/symptom/questions',
      params: { cat: 'digest', q: String(opt.next), step: '2' },
    });
  });

  it('없는 질문 번호(잘못된 링크)면 증상 탭으로 돌아간다', async () => {
    mockParams = { cat: 'digest', q: '999' };
    await render(<SymptomQuestionsScreen />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/symptom');
  });
});
