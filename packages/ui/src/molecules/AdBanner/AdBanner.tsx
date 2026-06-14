import React from 'react';
import styles from './AdBanner.module.css';

export interface AdBannerProps {
  title?: string;
  description?: string;
  thumbnailSrc?: string;
  onClick?: () => void;
}

// AdBanner height is ALWAYS 52px — allocated in layout even before ad loads.
// All ads MUST display [AD] label. Never show on emergency screens.
export function AdBanner({ title = '광고 제목', description = '광고 설명', thumbnailSrc, onClick }: AdBannerProps) {
  return (
    <div className={styles.banner} onClick={onClick} role="button" tabIndex={0}>
      <span className={styles.adLabel}>AD</span>
      {thumbnailSrc ? (
        <img className={styles.thumb} src={thumbnailSrc} alt="" />
      ) : (
        <div className={styles.thumbPlaceholder} />
      )}
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{description}</span>
      </div>
    </div>
  );
}
