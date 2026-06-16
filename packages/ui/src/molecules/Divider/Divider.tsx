import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps {
  /** 좌측 18px 들여쓰기 */
  inset?: boolean;
  className?: string;
}

export function Divider({ inset = false, className }: DividerProps) {
  const cls = [styles.divider, inset ? styles['divider--inset'] : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <hr className={cls} role="separator" />;
}
