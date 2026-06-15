import React from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string | undefined;
  alt?: string | undefined;
  /** 이미지가 없을 때 표시할 이모지 폴백 (기본 🐶) */
  emoji?: string | undefined;
  size?: AvatarSize | undefined;
  className?: string | undefined;
}

export function Avatar({ src, alt = '', emoji = '🐶', size = 'md', className }: AvatarProps) {
  const cls = [styles.avatar, styles[`avatar--${size}`], className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls}>
      {src ? (
        <img className={styles.img} src={src} alt={alt} />
      ) : (
        <span className={styles.emoji} aria-hidden>{emoji}</span>
      )}
    </span>
  );
}
