import React, { createContext, useContext } from 'react';
import styles from './SymptomChecker.module.css';

// ── Types ──────────────────────────────────────────────────────────
export interface SymptomOption {
  label: string;
  next?: number;
  verdict?: 'emergency' | 'today' | 'watch';
}

export interface SymptomQuestion {
  q: string;
  options: SymptomOption[];
}

interface SymptomCheckerCtx {
  current: number;
  total: number;
  question: SymptomQuestion;
  onSelect: (option: SymptomOption) => void;
}

// ── Context ────────────────────────────────────────────────────────
const Ctx = createContext<SymptomCheckerCtx | null>(null);
function useSymptomChecker() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('SymptomChecker sub-component used outside <SymptomChecker>');
  return ctx;
}

// ── Root ───────────────────────────────────────────────────────────
function SymptomCheckerRoot({
  current,
  total,
  question,
  onSelect,
  children,
}: SymptomCheckerCtx & { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ current, total, question, onSelect }}>
      <div className={styles.root}>{children}</div>
    </Ctx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function ProgressBar() {
  const { current, total } = useSymptomChecker();
  const pct = Math.round((current / total) * 100);
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressLabel}>{current}/{total}</span>
    </div>
  );
}

function Question({ text }: { text?: string }) {
  const { question } = useSymptomChecker();
  return <h1 className={styles.question}>{text ?? question.q}</h1>;
}

function Options({ children }: { children?: React.ReactNode }) {
  const { question, onSelect } = useSymptomChecker();
  if (children) return <div className={styles.options}>{children}</div>;
  return (
    <div className={styles.options}>
      {question.options.map((opt) => (
        <Option key={opt.label} label={opt.label} onClick={() => onSelect(opt)} />
      ))}
    </div>
  );
}

function Option({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button className={styles.option} onClick={onClick} type="button">
      <span className={styles.optionCheck} />
      <span className={styles.optionLabel}>{label}</span>
    </button>
  );
}

// ── Compound export ────────────────────────────────────────────────
export const SymptomChecker = Object.assign(SymptomCheckerRoot, {
  ProgressBar,
  Question,
  Options,
  Option,
});
