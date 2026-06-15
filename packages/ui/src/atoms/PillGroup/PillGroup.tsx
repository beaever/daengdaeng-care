import React from 'react';
import styles from './PillGroup.module.css';

export interface PillGroupOption {
  label: string;
  value: string;
}

export interface PillGroupProps {
  options: PillGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PillGroup({ options, value, onChange, className }: PillGroupProps) {
  const cls = [styles.group, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls} role="radiogroup">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.pill} ${active ? styles['pill--active'] : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
