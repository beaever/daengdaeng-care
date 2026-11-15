import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, space } from '../../../theme';
import { SymptomChecker } from '../../../components/compound';
import { SYMPTOM_QUESTIONS, type SymptomOption, type SymptomQuestion } from '@daengdaeng/constants';

// 현재 질문부터 verdict(끝)까지 도달 가능한 가장 긴 경로의 문항 수.
// next는 항상 뒤쪽 인덱스만 가리키므로(순환 없음 — symptoms.test.ts로 보장) 재귀가 항상 종료된다.
function longestRemainingPath(questions: SymptomQuestion[], idx: number): number {
  const q = questions[idx];
  if (q == null) return 0;
  let max = 1;
  for (const opt of q.options) {
    if (typeof opt.next === 'number') {
      max = Math.max(max, 1 + longestRemainingPath(questions, opt.next));
    }
  }
  return max;
}

// SCR-010 · 증상 질문 (증상 탭) — SymptomChecker 조립. 보기 선택으로 분기.
// 질문마다 화면을 쌓는다 — 뒤로 가기·스와이프가 그대로 직전 질문으로 간다
// (native-stack 은 beforeRemove 로 뒤로 가기를 막을 수 없다).
export default function SymptomQuestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cat?: string; q?: string; step?: string }>();
  const idx = Number(params.q ?? 0);
  const step = Number(params.step ?? 1);
  const questions = params.cat != null ? SYMPTOM_QUESTIONS[params.cat] : undefined;
  const question = questions?.[idx];

  // 카테고리나 질문이 없으면(잘못된 링크) 증상 탭으로 안전하게 복귀.
  useEffect(() => {
    if (question == null) {
      router.replace('/symptom');
    }
  }, [question, router]);

  if (questions == null || question == null) return null;

  const onSelect = (opt: SymptomOption) => {
    if (opt.verdict) {
      router.push({ pathname: '/symptom/result', params: { verdict: opt.verdict } });
    } else if (typeof opt.next === 'number') {
      router.push({
        pathname: '/symptom/questions',
        params: { cat: params.cat, q: String(opt.next), step: String(step + 1) },
      });
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SymptomChecker
        current={step}
        total={step - 1 + longestRemainingPath(questions, idx)}
        question={question.q}
        options={question.options}
        onSelect={onSelect}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5] },
});
