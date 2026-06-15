import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamily, typography, space, colors } from '../../theme';
import { Avatar, Card, Segment } from '../ui';
import type { Pet, HealthRecordItem, RecordType } from '../../lib/sampleData';

// SCR-014 · 건강 기록 — 펫 헤더 + 카테고리 탭 + 타임라인.
// 화면(record/index.tsx)은 이 컴파운드를 조립만 한다. FAB·AdBanner는 화면 chrome.
// 기록 종류별 아이콘·라벨 분기는 컴파운드 내부(RECORD_META)에 둔다(RULES 3).

/** 기록 종류 메타 — 아이콘·라벨 단일 출처 */
export const RECORD_META: Record<RecordType, { emoji: string; label: string }> = {
  vaccine: { emoji: '💉', label: '예방접종' },
  weight: { emoji: '⚖️', label: '체중' },
  vet: { emoji: '🏥', label: '병원 방문' },
};

/** 카테고리 탭 값 — 전체 + 기록 종류 */
export type RecordTab = 'all' | RecordType;

export interface HealthRecordProps {
  pet: Pet;
  records: HealthRecordItem[];
  tab: RecordTab;
  onTab: (tab: RecordTab) => void;
}

function HealthRecordRoot({ pet, records, tab, onTab }: HealthRecordProps) {
  const filtered = tab === 'all' ? records : records.filter((r) => r.type === tab);
  return (
    <View style={styles.root}>
      <HealthRecord.PetHeader pet={pet} />
      <HealthRecord.CategoryTabs tab={tab} onTab={onTab} />
      <HealthRecord.Timeline records={filtered} />
    </View>
  );
}

function PetHeader({ pet }: { pet: Pet }) {
  return (
    <View style={styles.petHeader}>
      <Avatar size="sm" emoji="🐶" />
      <Text style={styles.petName}>{pet.name}</Text>
    </View>
  );
}

const TAB_OPTIONS: { value: RecordTab; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'vaccine', label: '접종' },
  { value: 'weight', label: '체중' },
  { value: 'vet', label: '병원' },
];

function CategoryTabs({ tab, onTab }: { tab: RecordTab; onTab: (tab: RecordTab) => void }) {
  return (
    <Segment
      options={TAB_OPTIONS}
      value={tab}
      onChange={(v) => onTab(v as RecordTab)}
    />
  );
}

function Timeline({ records }: { records: HealthRecordItem[] }) {
  return (
    <View style={styles.timeline}>
      {records.map((rec) => (
        <HealthRecord.TimelineGroup key={rec.id} date={rec.date}>
          <HealthRecord.Entry rec={rec} />
        </HealthRecord.TimelineGroup>
      ))}
    </View>
  );
}

function TimelineGroup({ date, children }: { date: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupDate}>{date}</Text>
      {children}
    </View>
  );
}

function Entry({ rec }: { rec: HealthRecordItem }) {
  const m = RECORD_META[rec.type];
  return (
    <Card pad style={styles.entry}>
      <Text style={styles.entryEmoji}>{m.emoji}</Text>
      <View style={styles.entryBody}>
        <Text style={styles.entryLabel}>{m.label}</Text>
        <Text style={styles.entryTitle}>{rec.title}</Text>
        <Text style={styles.entrySub}>{rec.sub}</Text>
      </View>
    </Card>
  );
}

export const HealthRecord = Object.assign(HealthRecordRoot, {
  PetHeader,
  CategoryTabs,
  Timeline,
  TimelineGroup,
  Entry,
});

const styles = StyleSheet.create({
  root: { gap: space[4] },
  petHeader: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  petName: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text },
  timeline: { gap: space[4] },
  group: { gap: space[2] },
  groupDate: {
    fontFamily,
    fontSize: typography.caption.size,
    fontWeight: '700',
    color: colors.text3,
  },
  entry: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  entryEmoji: { fontSize: 22 },
  entryBody: { flex: 1, gap: space[1] },
  entryLabel: {
    fontFamily,
    fontSize: typography.micro.size,
    fontWeight: '700',
    letterSpacing: typography.micro.letterSpacing,
    color: colors.text3,
  },
  entryTitle: { fontFamily, fontSize: typography.callout.size, fontWeight: '700', color: colors.text },
  entrySub: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
});
