import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, typography, space } from '../../theme';
import { ProgressBar, Option } from '../ui';
import type { SymptomOption } from '../../lib/sampleData';

// SCR-010 · 단계별 증상 질문 — 진행바 + 질문 + 라디오 보기.
// 보기별 분기(verdict/next)는 화면이 onSelect로 처리, 컴파운드는 표시만 담당.
export interface SymptomCheckerProps {
  /** 현재 질문 번호 (1-base) */
  current: number;
  total: number;
  question: string;
  options: SymptomOption[];
  onSelect: (option: SymptomOption) => void;
}

function SymptomCheckerRoot({ current, total, question, options, onSelect }: SymptomCheckerProps) {
  return (
    <View style={styles.root}>
      <SymptomChecker.Progress current={current} total={total} />
      <SymptomChecker.Question text={question} />
      <SymptomChecker.Options>
        {options.map((o, i) => (
          <Option key={i} label={o.label} onSelect={() => onSelect(o)} />
        ))}
      </SymptomChecker.Options>
    </View>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <View style={styles.progress}>
      <View style={styles.progressBar}>
        <ProgressBar value={pct} />
      </View>
      <Text style={styles.progressLabel}>{`${current}/${total}`}</Text>
    </View>
  );
}

function Question({ text }: { text: string }) {
  return <Text style={styles.question}>{text}</Text>;
}

function Options({ children }: { children: React.ReactNode }) {
  return <View style={styles.options}>{children}</View>;
}

export const SymptomChecker = Object.assign(SymptomCheckerRoot, {
  Progress,
  Question,
  Options,
});

const styles = StyleSheet.create({
  root: { gap: space[6] },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  progressBar: { flex: 1 },
  progressLabel: {
    fontFamily,
    fontSize: typography.caption.size,
    fontWeight: '700',
    color: colors.text2,
    fontVariant: ['tabular-nums'],
  },
  question: {
    fontFamily,
    fontSize: typography.h1.size,
    fontWeight: '800',
    lineHeight: typography.h1.size * typography.h1.lineHeight,
    color: colors.text,
  },
  options: { gap: space[2] + 2 },
});
