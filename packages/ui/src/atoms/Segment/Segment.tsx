import React from 'react';
import styles from './Segment.module.css';

export interface SegmentOption {
  label: string;
  value: string;
}

export interface SegmentProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Segment({ options, value, onChange, className }: SegmentProps) {
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const cls = [styles.track, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls} role="tablist">
      <span
        className={styles.thumb}
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        aria-hidden
      />
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${styles.seg} ${active ? styles['seg--active'] : ''}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
