import React from 'react';
import styles from './Input.module.css';

// ── Field ─────────────────────────────────────────────────────────
export interface FieldProps {
  label?: string;
  /** 필수 표시 * (danger) */
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, required, htmlFor, children, className }: FieldProps) {
  const cls = [styles.field, className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {label && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
          {required && <span className={styles.required} aria-hidden> *</span>}
        </label>
      )}
      {children}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 좌측 아이콘 */
  leftIcon?: React.ReactNode;
}

export function Input({ leftIcon, className, ...rest }: InputProps) {
  const cls = [styles.inputWrap, leftIcon ? styles['inputWrap--withIcon'] : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls}>
      {leftIcon && <span className={styles.icon} aria-hidden>{leftIcon}</span>}
      <input className={styles.input} {...rest} />
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...rest }: TextareaProps) {
  const cls = [styles.textarea, className ?? ''].filter(Boolean).join(' ');
  return <textarea className={cls} rows={rows} {...rest} />;
}
