import React from 'react';
import styles from './SectionHeading.module.css';

export interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  const cls = [styles.heading, className ?? ''].filter(Boolean).join(' ');
  return <h2 className={cls}>{children}</h2>;
}
