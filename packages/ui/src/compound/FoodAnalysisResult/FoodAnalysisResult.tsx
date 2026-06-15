import React, { createContext, useContext } from 'react';
import type { GradeLevel, SafetyLevel } from '@daengdaeng/tokens';
import { GradeBadge } from '../../atoms/Badge/Badge';
import { IngredientItem } from '../../molecules/IngredientItem/IngredientItem';
import styles from './FoodAnalysisResult.module.css';

// ── Types ──────────────────────────────────────────────────────────
export interface AnalysisIngredient {
  name: string;
  status: SafetyLevel;
}

export interface ProductData {
  name: string;
  brand: string;
  image?: string;
  grade: GradeLevel;
  gradeLabel?: string;
  ingredients: AnalysisIngredient[];
  warnings?: string[];
}

interface FoodAnalysisCtx {
  product: ProductData;
}

// ── Context ────────────────────────────────────────────────────────
const Ctx = createContext<FoodAnalysisCtx | null>(null);
function useFoodAnalysis() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('FoodAnalysisResult sub-component used outside <FoodAnalysisResult>');
  return ctx;
}

// ── Root ───────────────────────────────────────────────────────────
function FoodAnalysisRoot({
  product,
  children,
}: {
  product: ProductData;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ product }}>
      <div className={styles.root}>{children}</div>
    </Ctx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function ProductHeader({ name, brand, image }: { name?: string; brand?: string; image?: string }) {
  const { product } = useFoodAnalysis();
  const img = image ?? product.image;
  return (
    <div className={styles.productHeader}>
      {img ? (
        <img className={styles.productImage} src={img} alt="" />
      ) : (
        <div className={styles.productImagePlaceholder} aria-hidden>🥫</div>
      )}
      <div className={styles.productMeta}>
        <span className={styles.brand}>{brand ?? product.brand}</span>
        <span className={styles.name}>{name ?? product.name}</span>
      </div>
    </div>
  );
}

function Grade({ grade, label }: { grade?: GradeLevel; label?: string }) {
  const { product } = useFoodAnalysis();
  return (
    <div className={styles.gradeCard}>
      <GradeBadge grade={grade ?? product.grade} />
      <span className={styles.gradeLabel}>{label ?? product.gradeLabel ?? '종합 등급'}</span>
    </div>
  );
}

function IngredientList({ items }: { items?: AnalysisIngredient[] }) {
  const { product } = useFoodAnalysis();
  const list = (items ?? product.ingredients).slice(0, 5); // TOP5
  if (!list.length) return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>주요 원료 TOP {list.length}</p>
      <div className={styles.ingredients}>
        {list.map((ing, i) => (
          <IngredientItem key={ing.name} rank={i + 1} name={ing.name} status={ing.status} />
        ))}
      </div>
    </div>
  );
}

function WarningSection({ warnings }: { warnings?: string[] }) {
  const { product } = useFoodAnalysis();
  const list = warnings ?? product.warnings;
  if (!list?.length) return null;
  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>주의가 필요한 원료</p>
      <div className={styles.warnings}>
        {list.map((w) => (
          <div key={w} className={styles.warningCard}>{w}</div>
        ))}
      </div>
    </div>
  );
}

// ── Compound export ────────────────────────────────────────────────
export const FoodAnalysisResult = Object.assign(FoodAnalysisRoot, {
  ProductHeader,
  Grade,
  IngredientList,
  WarningSection,
});
