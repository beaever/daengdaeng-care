import React from 'react';
import styles from './Bullets.module.css';

export type BulletsVariant = 'default' | 'danger' | 'safe';

export interface BulletsProps {
  items: React.ReactNode[];
  variant?: BulletsVariant;
  className?: string;
}

export function Bullets({ items, variant = 'default', className }: BulletsProps) {
  const cls = [styles.list, styles[`list--${variant}`], className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <ul className={cls}>
      {items.map((item, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.dot} aria-hidden />
          <span className={styles.text}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
