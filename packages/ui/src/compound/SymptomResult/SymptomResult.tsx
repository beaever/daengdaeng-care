import React, { createContext, useContext } from 'react';
import type { SeverityLevel } from '@daengdaeng/tokens';
import { Verdict } from '../../molecules/Verdict/Verdict';
import { Bullets } from '../../molecules/Bullets/Bullets';
import { Note } from '../../molecules/Note/Note';
import { Button } from '../../atoms/Button/Button';
import styles from './SymptomResult.module.css';

// ── Types ──────────────────────────────────────────────────────────
export interface SymptomResultData {
  level: SeverityLevel;
  label?: string;
  reason: string;
  /** "지금 해주세요" / (watch)"집에서 이렇게" */
  actions?: string[];
  /** "이럴 땐 병원으로" */
  watchList?: string[];
}

interface SymptomResultCtx {
  result: SymptomResultData;
  onFindHospital: (() => void) | undefined;
}

// ── Context ────────────────────────────────────────────────────────
const Ctx = createContext<SymptomResultCtx | null>(null);
function useSymptomResult() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('SymptomResult sub-component used outside <SymptomResult>');
  return ctx;
}

// ── Root ───────────────────────────────────────────────────────────
function SymptomResultRoot({
  result,
  onFindHospital,
  children,
}: {
  result: SymptomResultData;
  onFindHospital?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ result, onFindHospital }}>
      <div className={styles.root}>{children}</div>
    </Ctx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function SeverityBadge({ level, label }: { level?: SeverityLevel; label?: string }) {
  const { result } = useSymptomResult();
  return <Verdict level={level ?? result.level} label={label ?? result.label} />;
}

function Reason({ text }: { text?: string }) {
  const { result } = useSymptomResult();
  return <p className={styles.reason}>{text ?? result.reason}</p>;
}

function ActionList({ items, title }: { items?: string[]; title?: string }) {
  const { result } = useSymptomResult();
  const list = items ?? result.actions;
  if (!list?.length) return null;
  const heading = title ?? (result.level === 'watch' ? '집에서 이렇게 해주세요' : '지금 해주세요');
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>{heading}</p>
      <ol className={styles.actions}>
        {list.map((a, i) => (
          <li key={a} className={styles.actionItem}>
            <span className={styles.actionNum}>{i + 1}</span>
            <span>{a}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WatchList({ items }: { items?: string[] }) {
  const { result } = useSymptomResult();
  const list = items ?? result.watchList;
  if (!list?.length) return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>이럴 땐 병원으로</p>
      <Bullets variant="danger" items={list} />
    </div>
  );
}

function HospitalButton({ children }: { children?: React.ReactNode }) {
  const { result, onFindHospital } = useSymptomResult();
  // emergency/today 일 때만 노출
  if (result.level !== 'emergency' && result.level !== 'today') return null;
  return (
    <Button variant="danger" block onClick={onFindHospital}>
      {children ?? '지금 병원 찾기'}
    </Button>
  );
}

function Disclaimer({ children }: { children?: React.ReactNode }) {
  return (
    <Note>
      {children ??
        '본 결과는 참고용이며 수의사의 진단을 대신하지 않습니다. 증상이 지속되거나 악화되면 즉시 병원을 방문하세요.'}
    </Note>
  );
}

// ── Compound export ────────────────────────────────────────────────
export const SymptomResult = Object.assign(SymptomResultRoot, {
  SeverityBadge,
  Reason,
  ActionList,
  WatchList,
  HospitalButton,
  Disclaimer,
});
