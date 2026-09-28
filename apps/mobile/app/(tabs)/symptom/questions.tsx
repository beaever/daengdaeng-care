import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { colors, space } from '../../../theme';
import { SymptomChecker } from '../../../components/compound';
import { SYMPTOM_QUESTIONS, type SymptomOption } from '@daengdaeng/constants';

// SCR-010 · 증상 질문 (증상 탭) — SymptomChecker 조립. 보기 선택으로 분기.
export default function SymptomQuestionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ cat?: string }>();
  const [idx, setIdx] = useState(0);
  const questions = params.cat != null ? SYMPTOM_QUESTIONS[params.cat] : undefined;

  // 뒤로가기: 첫 질문이 아니면 이전 질문으로, 첫 질문이면 카테고리로.
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (idx > 0) {
        e.preventDefault();
        setIdx((i) => i - 1);
      }
    });
    return unsub;
  }, [navigation, idx]);

  // 카테고리가 없거나 질문 트리가 없으면 증상 탭으로 안전하게 복귀.
  useEffect(() => {
    if (questions == null) {
      router.replace('/symptom');
    }
  }, [questions, router]);

  if (questions == null) return null;

  const total = questions.length;
  const question = questions[idx]!;

  const onSelect = (opt: SymptomOption) => {
    if (opt.verdict) {
      router.push({ pathname: '/symptom/result', params: { verdict: opt.verdict } });
    } else if (typeof opt.next === 'number') {
      setIdx(opt.next);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <SymptomChecker
        current={idx + 1}
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
