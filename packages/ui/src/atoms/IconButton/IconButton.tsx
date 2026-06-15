import React from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 스크린리더용 라벨 — 아이콘 버튼은 필수 */
  'aria-label': string;
}

export function IconButton({ children, className, ...rest }: IconButtonProps) {
  const cls = [styles.iconBtn, className ?? ''].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
