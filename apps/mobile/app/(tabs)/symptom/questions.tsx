import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { colors, space } from '../../../theme';
import { SymptomChecker } from '../../../components/compound';
import { symptomQuestions, type SymptomOption } from '../../../lib/sampleData';

// SCR-010 · 증상 질문 (증상 탭) — SymptomChecker 조립. 보기 선택으로 분기.
export default function SymptomQuestionsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [idx, setIdx] = useState(0);
  const total = symptomQuestions.length;
  const question = symptomQuestions[idx]!;

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

  const onSelect = (opt: SymptomOption) => {
    if (opt.verdict) {
      // emergency는 전면광고 없이 결과 직행, 그 외는 전면광고 경유.
      if (opt.verdict === 'emergency') {
        router.push({ pathname: '/symptom/result', params: { verdict: opt.verdict } });
      } else {
        router.push({ pathname: '/symptom/interstitial', params: { verdict: opt.verdict } });
      }
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
