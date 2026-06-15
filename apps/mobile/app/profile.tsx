import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius, space, fontFamily, typography } from '../theme';
import { Field, Input, PillGroup, Button } from '../components/ui';

const SEX = [
  { label: '남아', value: '남아' },
  { label: '여아', value: '여아' },
];
const NEUTER = [
  { label: '했어요', value: '했어요' },
  { label: '안 했어요', value: '안 했어요' },
  { label: '몰라요', value: '몰라요' },
];

// SCR-003 · 프로필 등록 (최초 1회). 완료 시 홈으로 reset.
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('남아');
  const [neu, setNeu] = useState('했어요');

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[8] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>우리 아이를{'\n'}알려주세요</Text>

        <Pressable style={styles.avatar}>
          <Text style={styles.avatarIcon}>📷</Text>
          <Text style={styles.avatarText}>사진 추가</Text>
        </Pressable>

        <View style={styles.fields}>
          <Field label="이름" required>
            <Input placeholder="예) 뭉치" value={name} onChangeText={setName} />
          </Field>
          <Field label="품종">
            <Input leftIcon="🔍" placeholder="검색하거나 입력" value={breed} onChangeText={setBreed} />
          </Field>
          <Field label="생년월일">
            <Pressable style={styles.select}>
              <Text style={styles.selectPlaceholder}>날짜 선택</Text>
              <Text style={styles.selectChevron}>⌄</Text>
            </Pressable>
          </Field>
          <Field label="성별">
            <PillGroup options={SEX} value={sex} onChange={setSex} />
          </Field>
          <Field label="중성화">
            <PillGroup options={NEUTER} value={neu} onChange={setNeu} />
          </Field>
        </View>

        <Button block size="lg" onPress={() => router.replace('/home')}>
          시작하기
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space[5], gap: space[5] },
  heading: {
    fontFamily,
    fontSize: typography.h1.size,
    fontWeight: '800',
    color: colors.text,
    lineHeight: typography.h1.size * typography.h1.lineHeight,
  },
  avatar: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  avatarIcon: { fontSize: 24 },
  avatarText: { fontFamily, fontSize: typography.caption.size, color: colors.text3, fontWeight: '600' },
  fields: { gap: space[4] },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
  },
  selectPlaceholder: { flex: 1, fontFamily, fontSize: typography.callout.size, color: colors.text3 },
  selectChevron: { fontFamily, fontSize: 18, color: colors.text3 },
});
