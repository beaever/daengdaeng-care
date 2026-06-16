import React from 'react';
import { Card } from '../../molecules/Card/Card';
import { Row } from '../../molecules/Row/Row';
import { Divider } from '../../molecules/Divider/Divider';
import styles from './HealthSummaryCard.module.css';

export interface HealthSummaryCardProps {
  /** 최근 체중 (예: "5.2kg") */
  weight?: string;
  /** 최근 병원 방문 (예: "2026.05.20 정기검진") */
  lastVisit?: string;
  /** 다음 예방접종 (예: "6/30 종합백신") */
  nextVaccine?: string;
  onClickWeight?: () => void;
  onClickVisit?: () => void;
  onClickVaccine?: () => void;
}

export function HealthSummaryCard({
  weight = '-',
  lastVisit = '-',
  nextVaccine = '-',
  onClickWeight,
  onClickVisit,
  onClickVaccine,
}: HealthSummaryCardProps) {
  return (
    <Card className={styles.card}>
      <Row icon="⚖️" title="최근 체중" sub={weight} onClick={onClickWeight} />
      <Divider inset />
      <Row icon="🏥" title="최근 병원 방문" sub={lastVisit} onClick={onClickVisit} />
      <Divider inset />
      <Row icon="💉" title="다음 예방접종" sub={nextVaccine} onClick={onClickVaccine} />
    </Card>
  );
}
