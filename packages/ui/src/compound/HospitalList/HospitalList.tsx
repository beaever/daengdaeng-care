import React from 'react';
import { Segment } from '../../atoms/Segment/Segment';
import { Chip } from '../../atoms/Chip/Chip';
import { StatusBadge } from '../../atoms/Badge/Badge';
import styles from './HospitalList.module.css';

// ── Types ──────────────────────────────────────────────────────────
export interface HospitalData {
  name: string;
  distance: string;
  hours: string;
  phone: string;
  isOpen: boolean;
  is24h?: boolean;
}

// ── Root ───────────────────────────────────────────────────────────
function HospitalListRoot({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}

// ── Sub-components ─────────────────────────────────────────────────
function ViewToggle({
  value,
  onChange,
}: {
  value: 'list' | 'map';
  onChange: (v: string) => void;
}) {
  return (
    <Segment
      value={value}
      onChange={onChange}
      options={[
        { label: '목록', value: 'list' },
        { label: '지도', value: 'map' },
      ]}
    />
  );
}

function RadiusSelector({
  value,
  onChange,
  options = ['1km', '3km', '5km', '10km'],
}: {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
}) {
  return (
    <div className={styles.radius}>
      {options.map((r) => (
        <Chip
          key={r}
          variant={r === value ? 'selected' : 'default'}
          onClick={() => onChange(r)}
        >
          {r}
        </Chip>
      ))}
    </div>
  );
}

function MapView() {
  // 목업 지도 — 그리드 + 핀
  return (
    <div className={styles.map} aria-label="지도">
      <span className={styles.pin} style={{ top: '30%', left: '40%' }} aria-hidden>📍</span>
      <span className={styles.pin} style={{ top: '55%', left: '65%' }} aria-hidden>📍</span>
      <span className={styles.pin} style={{ top: '70%', left: '25%' }} aria-hidden>📍</span>
    </div>
  );
}

function ResultCount({ count }: { count: number }) {
  return <p className={styles.count}>주변 병원 {count}곳</p>;
}

function HospitalCard({ hospital, onClick }: { hospital: HospitalData; onClick?: () => void }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.cardTop}>
        <StatusBadge isOpen={hospital.isOpen} is24h={hospital.is24h} />
        <span className={styles.distance}>{hospital.distance}</span>
      </div>
      <span className={styles.name}>{hospital.name}</span>
      <span className={styles.hours}>{hospital.hours}</span>
      <span className={styles.phone}>{hospital.phone}</span>
    </button>
  );
}

// ── Compound export ────────────────────────────────────────────────
export const HospitalList = Object.assign(HospitalListRoot, {
  ViewToggle,
  RadiusSelector,
  Map: MapView,
  ResultCount,
  Card: HospitalCard,
});
