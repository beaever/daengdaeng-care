import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
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
export default function SymptomQuestionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ cat?: string }>();
  // 방문한 질문 인덱스 경로. 마지막 원소가 현재 질문 — 분기 트리에서도 정확한 뒤로가기를 보장한다.
  const [history, setHistory] = useState<number[]>([0]);
  const questions = params.cat != null ? SYMPTOM_QUESTIONS[params.cat] : undefined;
  const idx = history[history.length - 1]!;

  // 카테고리가 바뀌면 새 질문 트리의 처음부터 시작.
  useEffect(() => {
    setHistory([0]);
  }, [params.cat]);

  // 뒤로가기: 방문 경로가 남아 있으면 직전 질문으로, 첫 질문이면 카테고리로(기본 동작).
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (history.length > 1) {
        e.preventDefault();
        setHistory((h) => h.slice(0, -1));
      }
    });
    return unsub;
  }, [navigation, history]);

  // 카테고리가 없거나 질문 트리가 없으면 증상 탭으로 안전하게 복귀.
  useEffect(() => {
    if (questions == null) {
      router.replace('/symptom');
    }
  }, [questions, router]);

  if (questions == null) return null;

  const question = questions[idx]!;
  const current = history.length;
  const total = history.length - 1 + longestRemainingPath(questions, idx);

  const onSelect = (opt: SymptomOption) => {
    if (opt.verdict) {
      router.push({ pathname: '/symptom/result', params: { verdict: opt.verdict } });
    } else if (typeof opt.next === 'number') {
      setHistory((h) => [...h, opt.next as number]);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SymptomChecker
        current={current}
        total={total}
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
