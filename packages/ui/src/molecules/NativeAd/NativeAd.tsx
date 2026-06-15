import React from 'react';
import styles from './NativeAd.module.css';

export interface NativeAdProps {
  title?: string;
  description?: string;
  thumbnailSrc?: string;
  onClick?: () => void;
}

// 모든 광고는 [AD] 라벨 필수. emergency 화면에는 절대 렌더하지 않는다.
export function NativeAd({
  title = '광고 제목',
  description = '광고 설명',
  thumbnailSrc,
  onClick,
}: NativeAdProps) {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <span className={styles.adLabel}>AD 광고</span>
      <div className={styles.row}>
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
    </div>
  );
}
