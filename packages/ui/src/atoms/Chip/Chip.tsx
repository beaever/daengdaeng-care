import React from 'react';
import styles from './Chip.module.css';

export type ChipVariant = 'default' | 'brand' | 'selected';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  /** 제공 시 우측에 ✕ 제거 버튼 표시 */
  onRemove?: () => void;
}

export function Chip({
  variant = 'default',
  onRemove,
  children,
  className,
  ...rest
}: ChipProps) {
  const cls = [styles.chip, styles[`chip--${variant}`], className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      <span className={styles.label}>{children}</span>
      {onRemove && (
        <span
          className={styles.remove}
          role="button"
          aria-label="제거"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </span>
      )}
    </button>
  );
}
