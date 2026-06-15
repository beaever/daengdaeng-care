import React, { createContext, useContext } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Segment } from '../../atoms/Segment/Segment';
import styles from './HealthRecord.module.css';

// ── Types ──────────────────────────────────────────────────────────
export type RecordType = 'vaccine' | 'weight' | 'vet';

export interface HealthRecordEntry {
  type: RecordType;
  title: string;
  sub?: string;
  date: string;
}

export interface PetInfo {
  name: string;
  avatar?: string;
}

export type RecordTab = 'all' | RecordType;

interface HealthRecordCtx {
  pet: PetInfo;
  records: HealthRecordEntry[];
  tab: RecordTab;
  onTab: (tab: RecordTab) => void;
}

const TYPE_EMOJI: Record<RecordType, string> = {
  vaccine: '💉',
  weight: '⚖️',
  vet: '🏥',
};

// ── Context ────────────────────────────────────────────────────────
const Ctx = createContext<HealthRecordCtx | null>(null);
function useHealthRecord() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('HealthRecord sub-component used outside <HealthRecord>');
  return ctx;
}

// ── Root ───────────────────────────────────────────────────────────
function HealthRecordRoot({
  pet,
  records,
  tab,
  onTab,
  children,
}: HealthRecordCtx & { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ pet, records, tab, onTab }}>
      <div className={styles.root}>{children}</div>
    </Ctx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function PetHeader() {
  const { pet } = useHealthRecord();
  return (
    <div className={styles.petHeader}>
      <Avatar src={pet.avatar} size="md" />
      <span className={styles.petName}>{pet.name}</span>
    </div>
  );
}

function CategoryTabs() {
  const { tab, onTab } = useHealthRecord();
  return (
    <Segment
      value={tab}
      onChange={(v) => onTab(v as RecordTab)}
      options={[
        { label: '전체', value: 'all' },
        { label: '접종', value: 'vaccine' },
        { label: '체중', value: 'weight' },
        { label: '병원', value: 'vet' },
      ]}
    />
  );
}

function Timeline() {
  const { records, tab } = useHealthRecord();
  const filtered = tab === 'all' ? records : records.filter((r) => r.type === tab);

  // 날짜별 그룹화 (입력 순서 유지)
  const groups: { date: string; items: HealthRecordEntry[] }[] = [];
  for (const r of filtered) {
    let g = groups.find((x) => x.date === r.date);
    if (!g) {
      g = { date: r.date, items: [] };
      groups.push(g);
    }
    g.items.push(r);
  }

  return (
    <div className={styles.timeline}>
      {groups.map((g) => (
        <div key={g.date} className={styles.group}>
          <span className={styles.groupDate}>{g.date}</span>
          <div className={styles.entries}>
            {g.items.map((entry, i) => (
              <Entry key={`${entry.title}-${i}`} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Entry({ entry }: { entry: HealthRecordEntry }) {
  return (
    <div className={styles.entry}>
      <span className={styles.entryIcon} aria-hidden>{TYPE_EMOJI[entry.type]}</span>
      <span className={styles.entryBody}>
        <span className={styles.entryTitle}>{entry.title}</span>
        {entry.sub && <span className={styles.entrySub}>{entry.sub}</span>}
      </span>
    </div>
  );
}

// ── Compound export ────────────────────────────────────────────────
export const HealthRecord = Object.assign(HealthRecordRoot, {
  PetHeader,
  CategoryTabs,
  Timeline,
  Entry,
});
