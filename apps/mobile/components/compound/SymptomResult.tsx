import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamily, typography, space, colors } from '../../theme';
import { Verdict, Bullets, Button, Note, SectionHeading } from '../ui';
import type { SymptomResultData } from '../../lib/sampleData';

// SCR-011 · 증상 결과 — 판정 + 행동 지침 + (관찰 항목) + (병원 버튼) + 면책 고지.
// RULES(4): 수의사 면책 고지(Disclaimer)는 레벨과 무관하게 항상 렌더한다 — 삭제 금지.
// 광고는 화면(result.tsx)에서 비응급일 때만 붙인다(컴파운드는 광고를 모름).
export interface SymptomResultProps {
  result: SymptomResultData;
  onFindHospital?: () => void;
}

function SymptomResultRoot({ result, onFindHospital }: SymptomResultProps) {
  return (
    <View style={styles.root}>
      <Verdict level={result.level} label={result.title} />
      <SymptomResult.Reason level={result.level} text={result.reason} />
      <SymptomResult.Actions level={result.level} items={result.actions} />
      {result.watchList != null && <SymptomResult.WatchList items={result.watchList} />}
      {result.hospital && <SymptomResult.HospitalButton onPress={onFindHospital} />}
      <SymptomResult.Disclaimer />
    </View>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </View>
  );
}

function Reason({ level, text }: { level: SymptomResultData['level']; text: string }) {
  const title = level === 'watch' ? '지금 상태는요' : level === 'emergency' ? '왜 급한가요?' : '왜 가봐야 하나요?';
  return (
    <Block title={title}>
      <Text style={styles.body}>{text}</Text>
    </Block>
  );
}

function Actions({ level, items }: { level: SymptomResultData['level']; items: string[] }) {
  const title = level === 'watch' ? '집에서 이렇게 해주세요' : '지금 바로 해주세요';
  return (
    <Block title={title}>
      <Bullets items={items} variant={level === 'watch' ? 'safe' : 'default'} />
    </Block>
  );
}

function WatchList({ items }: { items: string[] }) {
  return (
    <Block title="이럴 땐 병원으로">
      <Bullets items={items} variant="danger" />
    </Block>
  );
}

function HospitalButton({ onPress }: { onPress?: () => void }) {
  return (
    <Button variant="danger" size="lg" block onPress={onPress}>
      🏥 근처 병원 찾기
    </Button>
  );
}

function Disclaimer() {
  return <Note icon="ℹ️">이 결과는 참고용이며 수의사의 진단을 대신하지 않아요.</Note>;
}

export const SymptomResult = Object.assign(SymptomResultRoot, {
  Reason,
  Actions,
  WatchList,
  HospitalButton,
  Disclaimer,
});

const styles = StyleSheet.create({
  root: { gap: space[5] },
  body: {
    fontFamily,
    fontSize: typography.body.size,
    lineHeight: typography.body.size * typography.body.lineHeight,
    color: colors.text,
  },
});
