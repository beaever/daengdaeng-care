import React from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import styles from './PetProfileCard.module.css';

export interface PetProfileCardProps {
  name: string;
  breed: string;
  age: string;
  avatar?: string;
  /** 예: "다음 접종 D-15" */
  nextVaccine?: string;
  onClick?: () => void;
}

export function PetProfileCard({
  name,
  breed,
  age,
  avatar,
  nextVaccine,
  onClick,
}: PetProfileCardProps) {
  return (
    <div className={styles.card} onClick={onClick} role={onClick ? 'button' : undefined}>
      <Avatar src={avatar} size="md" />
      <div className={styles.meta}>
        <span className={styles.name}>{name}</span>
        <span className={styles.detail}>{breed} · {age}</span>
      </div>
      {nextVaccine && <span className={styles.vaccineChip}>{nextVaccine}</span>}
    </div>
  );
}
