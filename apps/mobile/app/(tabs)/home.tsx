import React, { useCallback, useRef } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, space, fontFamily, typography, fontScale } from '../../theme';
import { SectionHeading, IconButton } from '../../components/ui';
import { PetProfileCard, QuickMenu, HealthSummaryCard } from '../../components/compound';
import { isWalkActive } from '../../lib/walk';
import { promptPendingWalk } from '../../lib/walkRecover';
import { usePet, setCurrentPet } from '../../lib/pets';
import { useRecords } from '../../lib/records';
import { latestWeight, lastVisitLabel, nextVaccineDays, formatDday } from '../../lib/recordSummary';

// SCR-004 · 홈 (탭1) — 허브. 컴파운드 조립으로 구성.
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pet, pets, reload: reloadPet } = usePet();
  const { records, reload: reloadRecords } = useRecords();
  const db = useSQLiteContext();

  // 홈 진입 시 끊긴 산책이 있으면 1회 묻는다
  const asked = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (asked.current) return;
      asked.current = true;
      promptPendingWalk(db).catch(() => {});
    }, [db])
  );

  if (!pet) return null; // 로딩 중이거나(undefined) 프로필 없음(null) — 라우팅으로 대부분 방지됨

  // 산책 기록이 현재 반려견에 묶이므로 산책 중에는 전환·추가를 막는다
  const guardWalk = () => {
    if (!isWalkActive()) return false;
    Alert.alert('산책 중이에요', '산책을 마친 뒤 바꿀 수 있어요.');
    return true;
  };
  const selectPet = async (id: number) => {
    if (guardWalk()) return;
    await setCurrentPet(db, id);
    reloadPet();
    reloadRecords();
  };

  const list = records ?? [];
  const weight = latestWeight(list);
  const nextDays = nextVaccineDays(list);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + space[2] }]}>
        <View style={styles.greetBox}>
          <Text style={styles.greet}>안녕하세요 👋</Text>
          <Text style={styles.hi} maxFontSizeMultiplier={fontScale.heading}>{`${pet.name} 보호자님`}</Text>
        </View>
        <IconButton icon="⚙️" accessibilityLabel="설정" onPress={() => router.push('/settings')} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <PetProfileCard.Switcher
          pets={pets}
          currentId={pet.id}
          onSelect={selectPet}
          onAdd={() => {
            if (!guardWalk()) router.push('/profile?new=1');
          }}
        />
        <PetProfileCard pet={pet} nextVaccineDays={nextDays} onPress={() => router.push('/settings')} />

        <View>
          <SectionHeading>바로가기</SectionHeading>
          <QuickMenu>
            <QuickMenu.Item icon="🦴" label="음식 판별" sub="먹어도 될까?" onPress={() => router.push('/food')} />
            <QuickMenu.Item icon="🩺" label="증상 체크" sub="병원 가야 하나?" onPress={() => router.push('/symptom')} />
            <QuickMenu.Item icon="🏥" label="병원 찾기" sub="근처 동물병원" onPress={() => router.push('/hospital')} />
            <QuickMenu.Item icon="📋" label="건강 기록" sub="체중·접종·병원" onPress={() => router.push('/record')} />
          </QuickMenu>
        </View>

        <View>
          <SectionHeading>건강 요약</SectionHeading>
          <HealthSummaryCard
            weight={weight ? `${weight.title} kg` : undefined}
            lastVisit={lastVisitLabel(list)}
            nextVaccine={nextDays != null ? formatDday(nextDays) : undefined}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space[5] - 6,
    paddingRight: space[4],
  },
  greetBox: { flex: 1, paddingLeft: 6, gap: 2 },
  greet: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  hi: { fontFamily, fontSize: typography.h2.size, fontWeight: '800', color: colors.text },
  content: {
    paddingHorizontal: space[5],
    paddingTop: space[5],
    gap: space[6] - 2,
  },
});
