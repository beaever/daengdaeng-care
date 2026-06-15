import React from 'react';
import styles from './Note.module.css';

export interface NoteProps {
  /** 좌측 아이콘 (기본 ℹ️) */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Note({ icon = 'ℹ️', children, className }: NoteProps) {
  const cls = [styles.note, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <span className={styles.icon} aria-hidden>{icon}</span>
      <span className={styles.text}>{children}</span>
    </div>
  );
}
