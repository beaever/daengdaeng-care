import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { fontFamily, typography, space, colors } from '../../theme';
import { Avatar, Card, Segment, EmptyState, Button } from '../ui';
import { photoUri, type Pet } from '../../lib/pets';
import { type HealthRecord as LibHealthRecord, type RecordType } from '../../lib/records';
import { groupByDate, weightDelta } from '../../lib/recordSummary';

// SCR-014 · 건강 기록 — 펫 헤더 + 카테고리 탭 + 타임라인.
// 화면(record/index.tsx)은 이 컴파운드를 조립만 한다. FAB는 화면 chrome.
// 기록 종류별 아이콘·라벨·필드 분기는 컴파운드 내부(RECORD_META)에 둔다(RULES 3).

/** 기록 종류 메타 — 아이콘·라벨 단일 출처 */
export const RECORD_META: Record<RecordType, { emoji: string; label: string }> = {
  vaccine: { emoji: '💉', label: '예방접종' },
  weight: { emoji: '⚖️', label: '체중' },
  vet: { emoji: '🏥', label: '병원 방문' },
};

/** 카테고리 탭 값 — 전체 + 기록 종류 */
export type RecordTab = 'all' | RecordType;

export interface HealthRecordProps {
  pet: Pick<Pet, 'name' | 'photo'>;
  /** undefined = 로딩 중 (useRecords) */
  records: LibHealthRecord[] | undefined;
  tab: RecordTab;
  onTab: (tab: RecordTab) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function HealthRecordRoot({ pet, records, tab, onTab, onDelete, onAdd }: HealthRecordProps) {
  return (
    <View style={styles.root}>
      <HealthRecord.PetHeader pet={pet} />
      <HealthRecord.CategoryTabs tab={tab} onTab={onTab} />
      <HealthRecord.Timeline records={records} tab={tab} onDelete={onDelete} onAdd={onAdd} />
    </View>
  );
}

function PetHeader({ pet }: { pet: Pick<Pet, 'name' | 'photo'> }) {
  return (
    <View style={styles.petHeader}>
      <Avatar size="sm" src={photoUri(pet.photo)} />
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
  return <Segment options={TAB_OPTIONS} value={tab} onChange={(v) => onTab(v as RecordTab)} />;
}

function Timeline({
  records,
  tab,
  onDelete,
  onAdd,
}: {
  records: LibHealthRecord[] | undefined;
  tab: RecordTab;
  onDelete: (id: number) => void;
  onAdd: () => void;
}) {
  if (records === undefined) return null; // 로딩 중 — 깜빡임 방지

  const filtered = tab === 'all' ? records : records.filter((r) => r.type === tab);

  if (filtered.length === 0) {
    return tab === 'all' ? (
      <EmptyState
        icon="🗒️"
        title="아직 기록이 없어요"
        action={
          <Button onPress={onAdd}>기록 추가</Button>
        }
      />
    ) : (
      <EmptyState title={`${RECORD_META[tab].label} 기록이 없어요`} />
    );
  }

  const groups = groupByDate(filtered);
  return (
    <View style={styles.timeline}>
      {groups.map((g) => (
        <HealthRecord.TimelineGroup key={g.date} date={g.date}>
          {g.items.map((rec) => (
            <HealthRecord.Entry key={rec.id} rec={rec} records={filtered} onDelete={onDelete} />
          ))}
        </HealthRecord.TimelineGroup>
      ))}
    </View>
  );
}

function TimelineGroup({ date, children }: { date: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupDate}>{date.replace(/-/g, '.')}</Text>
      {children}
    </View>
  );
}

/** 기록 종류별 제목 표기 — vaccine/vet은 title 그대로, weight는 'kg' 단위를 붙인다. */
function entryTitle(rec: LibHealthRecord): string {
  return rec.type === 'weight' ? `${rec.title} kg` : rec.title;
}

/** 기록 종류별 부가 설명 — 다음 접종일 / 직전 대비 체중 증감 / 방문 사유. */
function entrySub(rec: LibHealthRecord, records: LibHealthRecord[]): string | undefined {
  if (rec.type === 'vaccine') {
    return rec.next_date ? `다음 접종: ${rec.next_date.replace(/-/g, '.')}` : undefined;
  }
  if (rec.type === 'weight') {
    const delta = weightDelta(records, rec);
    if (delta === undefined) return undefined;
    return `이전 기록 대비 ${delta > 0 ? '+' : ''}${delta}kg`;
  }
  return rec.sub ?? undefined;
}

function Entry({
  rec,
  records,
  onDelete,
}: {
  rec: LibHealthRecord;
  records: LibHealthRecord[];
  onDelete: (id: number) => void;
}) {
  const m = RECORD_META[rec.type];
  const title = entryTitle(rec);
  const sub = entrySub(rec, records);
  return (
    <Pressable
      onLongPress={() => onDelete(rec.id)}
      accessibilityRole="button"
      accessibilityLabel={`${m.label} 기록 ${title}`}
      accessibilityHint="길게 눌러 삭제"
    >
      <Card pad style={styles.entry}>
        <Text style={styles.entryEmoji}>{m.emoji}</Text>
        <View style={styles.entryBody}>
          <Text style={styles.entryLabel}>{m.label}</Text>
          <Text style={styles.entryTitle}>{title}</Text>
          {sub != null && <Text style={styles.entrySub}>{sub}</Text>}
          {rec.notes != null && rec.notes !== '' && <Text style={styles.entryNotes}>{rec.notes}</Text>}
        </View>
      </Card>
    </Pressable>
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
  entryNotes: { fontFamily, fontSize: typography.caption.size, color: colors.text3 },
});
