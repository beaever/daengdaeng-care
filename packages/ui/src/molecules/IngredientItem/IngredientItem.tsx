import React from 'react';
import type { SafetyLevel } from '@daengdaeng/tokens';
import styles from './IngredientItem.module.css';

const STATUS_LABEL: Record<SafetyLevel, string> = {
  safe: '좋아요',
  caution: '주의',
  danger: '위험',
};

export interface IngredientItemProps {
  /** 순위 (원형 뱃지) */
  rank: number;
  name: string;
  status: SafetyLevel;
  className?: string;
}

export function IngredientItem({ rank, name, status, className }: IngredientItemProps) {
  const cls = [styles.item, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <span className={styles.rank}>{rank}</span>
      <span className={styles.name}>{name}</span>
      <span className={`${styles.tag} ${styles[`tag--${status}`]}`}>
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}
