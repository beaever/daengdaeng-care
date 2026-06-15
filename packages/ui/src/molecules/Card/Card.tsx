import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 내부 18px 패딩 적용 */
  pad?: boolean;
  /** 그림자 제거 */
  flat?: boolean;
}

export function Card({ pad = false, flat = false, children, className, ...rest }: CardProps) {
  const cls = [
    styles.card,
    pad ? styles['card--pad'] : '',
    flat ? styles['card--flat'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
