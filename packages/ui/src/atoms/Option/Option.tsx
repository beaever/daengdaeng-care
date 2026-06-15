import React from 'react';
import styles from './Option.module.css';

export interface OptionProps {
  label: string;
  description?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function Option({ label, description, selected = false, onSelect, className }: OptionProps) {
  const cls = [styles.option, selected ? styles['option--selected'] : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cls}
      onClick={onSelect}
    >
      <span className={styles.check} aria-hidden>
        <span className={styles.checkMark}>✓</span>
      </span>
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.desc}>{description}</span>}
      </span>
    </button>
  );
}
