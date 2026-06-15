import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontFamily, typography } from '../../theme';
import { Avatar } from '../ui';
import type { Pet } from '../../lib/sampleData';

// 홈 상단 반려견 요약 카드 — 컴파운드 조립(Avatar · Info · NextVaccine).
export interface PetProfileCardProps {
  pet: Pet;
  onPress?: () => void;
}

function PetProfileCardRoot({ pet, onPress }: PetProfileCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed]}
    >
      <PetProfileCard.Avatar pet={pet} />
      <PetProfileCard.Info pet={pet} />
      <PetProfileCard.NextVaccine days={pet.nextVaccineDays} />
    </Pressable>
  );
}

function PetAvatar({ pet }: { pet: Pet }) {
  return <Avatar size="md" emoji="🐶" />;
}

function PetInfo({ pet }: { pet: Pet }) {
  return (
    <View style={styles.info}>
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.meta}>{`${pet.breed} · ${pet.age}`}</Text>
    </View>
  );
}

function NextVaccine({ days }: { days: number }) {
  return (
    <View style={styles.vaccine}>
      <Text style={styles.vaccineLabel}>다음 접종</Text>
      <View style={styles.vaccineChip}>
        <Text style={styles.vaccineChipText}>{`D-${days}`}</Text>
      </View>
    </View>
  );
}

export const PetProfileCard = Object.assign(PetProfileCardRoot, {
  Avatar: PetAvatar,
  Info: PetInfo,
  NextVaccine,
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { backgroundColor: colors.surface2 },
  info: { flex: 1, minWidth: 0, gap: 3 },
  name: { fontFamily, fontSize: typography.title.size, fontWeight: '700', color: colors.text },
  meta: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  vaccine: { alignItems: 'flex-end', gap: 2 },
  vaccineLabel: {
    fontFamily,
    fontSize: typography.micro.size,
    fontWeight: '700',
    color: colors.text3,
    letterSpacing: typography.micro.letterSpacing,
  },
  vaccineChip: {
    minHeight: 26,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
  },
  vaccineChipText: {
    fontFamily,
    fontSize: typography.caption.size,
    fontWeight: '800',
    color: colors.brandText,
  },
});
