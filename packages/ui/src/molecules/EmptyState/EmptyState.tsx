import React from 'react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /** 아이콘/이모지 (44px) */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 옵션 액션 (버튼 등) */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const cls = [styles.empty, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {icon && <span className={styles.icon} aria-hidden>{icon}</span>}
      <span className={styles.title}>{title}</span>
      {description && <span className={styles.desc}>{description}</span>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
