import React, { createContext, useContext } from 'react';
import type { SafetyLevel } from '@daengdaeng/tokens';
import { Verdict } from '../../molecules/Verdict/Verdict';
import { AdBanner, type AdBannerProps } from '../../molecules/AdBanner/AdBanner';
import styles from './FoodResult.module.css';

// ── Types ──────────────────────────────────────────────────────────
export interface FoodData {
  name: string;
  level: SafetyLevel;
  reason: string;
  serve?: string;
  ingredient?: string;
  symptoms?: string[];
  nutrition?: string[];
  related?: string[];
}

interface FoodResultCtx {
  food: FoodData;
}

// ── Context ────────────────────────────────────────────────────────
const Ctx = createContext<FoodResultCtx | null>(null);
function useFoodResult() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('FoodResult sub-component used outside <FoodResult>');
  return ctx;
}

// ── Root ───────────────────────────────────────────────────────────
function FoodResultRoot({ food, children }: { food: FoodData; children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ food }}>
      <div className={styles.root}>{children}</div>
    </Ctx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function Header({ foodName }: { foodName?: string }) {
  const { food } = useFoodResult();
  return (
    <h1 className={styles.header}>{foodName ?? food.name}</h1>
  );
}

function SafetyBadgeSection({ level }: { level?: SafetyLevel }) {
  const { food } = useFoodResult();
  return <Verdict level={level ?? food.level} />;
}

function Description() {
  const { food } = useFoodResult();
  return (
    <div className={styles.description}>
      <p className={styles.reason}>{food.reason}</p>
      {food.serve && (
        <p className={styles.serve}>
          <span className={styles.serveLabel}>급여법</span>
          {food.serve}
        </p>
      )}
      {food.ingredient && (
        <p className={styles.ingredient}>
          위험 성분: <strong>{food.ingredient}</strong>
        </p>
      )}
    </div>
  );
}

function Symptoms({ items }: { items?: string[] }) {
  const { food } = useFoodResult();
  const list = items ?? food.symptoms;
  // Only render for danger/caution
  if (!list?.length || food.level === 'safe') return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>섭취 시 나타날 수 있는 증상</p>
      <ul className={`${styles.bullets} ${styles['bullets--danger']}`}>
        {list.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </div>
  );
}

function Nutrition({ items }: { items?: string[] }) {
  const { food } = useFoodResult();
  const list = items ?? food.nutrition;
  if (!list?.length || food.level !== 'safe') return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>주요 영양소</p>
      <div className={styles.chips}>
        {list.map((n) => (
          <span key={n} className={`${styles.chip} ${styles['chip--safe']}`}>{n}</span>
        ))}
      </div>
    </div>
  );
}

function RelatedFoods({ level, items }: { level?: SafetyLevel; items?: string[] }) {
  const { food } = useFoodResult();
  const list = items ?? food.related;
  if (!list?.length) return null;
  const lv = level ?? food.level;
  const isDanger = lv === 'danger';
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>{isDanger ? '이것도 위험해요' : '관련 음식'}</p>
      <div className={styles.chips}>
        {list.map((r) => (
          <span key={r} className={`${styles.chip} ${isDanger ? styles['chip--danger'] : ''}`}>{r}</span>
        ))}
      </div>
    </div>
  );
}

function FoodAdBanner(props: AdBannerProps) {
  return <AdBanner {...props} />;
}

// ── Compound export ────────────────────────────────────────────────
export const FoodResult = Object.assign(FoodResultRoot, {
  Header,
  SafetyBadge: SafetyBadgeSection,
  Description,
  Symptoms,
  Nutrition,
  RelatedFoods,
  AdBanner: FoodAdBanner,
});
