import React from 'react';
import styles from './Row.module.css';

export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 좌측 40×40 아이콘 박스 내용 */
  icon?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** 우측 chevron 표시 (기본 true) */
  chevron?: boolean;
  /** 우측 커스텀 액세서리 (chevron 대신) */
  trailing?: React.ReactNode;
}

export function Row({
  icon,
  title,
  sub,
  chevron = true,
  trailing,
  className,
  ...rest
}: RowProps) {
  const interactive = rest.onClick != null;
  const cls = [styles.row, interactive ? styles['row--interactive'] : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} role={interactive ? 'button' : undefined} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {sub && <span className={styles.sub}>{sub}</span>}
      </span>
      {trailing ?? (chevron && <span className={styles.chevron} aria-hidden>›</span>)}
    </div>
  );
}
