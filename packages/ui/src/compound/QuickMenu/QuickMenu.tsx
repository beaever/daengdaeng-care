import React from 'react';
import styles from './QuickMenu.module.css';

export interface QuickMenuItem {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
}

export interface QuickMenuProps {
  items: QuickMenuItem[];
}

// 2×2 그리드 — 음식판별 / 사료분석 / 증상체크 / 병원찾기
export function QuickMenu({ items }: QuickMenuProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <button key={item.label} type="button" className={styles.item} onClick={item.onClick}>
          <span className={styles.icon} aria-hidden>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
          {item.sub && <span className={styles.sub}>{item.sub}</span>}
        </button>
      ))}
    </div>
  );
}
