import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert, Keyboard, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BREEDS, POPULAR_BREEDS, searchBreeds } from '@daengdaeng/constants';
import { colors, radius, space, fontFamily, typography } from '../theme';
import { Field, Input, PillGroup, Button, Chip } from '../components/ui';
import { usePet, savePet, savePetPhoto, photoUri } from '../lib/pets';
import { toLocalDateString, parseLocalDate } from '../lib/recordSummary';

const SEX = [
  { label: '남아', value: '남아' },
  { label: '여아', value: '여아' },
];
const NEUTER = [
  { label: '했어요', value: '했어요' },
  { label: '안 했어요', value: '안 했어요' },
  { label: '몰라요', value: '몰라요' },
];

function neuteredLabel(v: 0 | 1 | null): string {
  if (v === 1) return '했어요';
  if (v === 0) return '안 했어요';
  return '몰라요';
}
function neuteredValue(label: string): 0 | 1 | null {
  if (label === '했어요') return 1;
  if (label === '안 했어요') return 0;
  return null;
}

// SCR-003 · 프로필 등록/수정. pet 이 없으면 등록 모드(최초 1회, 완료 시 홈으로),
// 있으면 수정 모드(헤더 노출, 저장 후 뒤로가기).
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const { pet, reload } = usePet();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState<string | null>(null);
  const [sex, setSex] = useState<'남아' | '여아'>('남아');
  const [neuter, setNeuter] = useState('몰라요');
  const [pickedPhoto, setPickedPhoto] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const seeded = useRef(false);

  useEffect(() => {
    if (pet && !seeded.current) {
      seeded.current = true;
      setName(pet.name);
      setBreed(pet.breed ?? '');
      setDob(pet.dob);
      setSex(pet.sex ?? '남아');
      setNeuter(neuteredLabel(pet.neutered ?? null));
    }
  }, [pet]);

  if (pet === undefined) return null; // 로딩 중 — 깜빡임 방지

  const editing = pet != null;
  const avatarUri = pickedPhoto ?? photoUri(pet?.photo ?? null);
  const canSave = name.trim().length > 0 && !saving;
  const breedMatches = searchBreeds(breed).slice(0, 6);
  const breedSelected = BREEDS.some((b) => b.name === breed.trim());

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPickedPhoto(result.assets[0].uri);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const photo = pickedPhoto ? savePetPhoto(pickedPhoto, pet?.photo) : (pet?.photo ?? null);
      await savePet(db, {
        name: name.trim(),
        breed: breed.trim() || null,
        dob,
        sex,
        neutered: neuteredValue(neuter),
        photo,
      });
      reload();
      if (editing) router.back();
      else router.replace('/home');
    } catch {
      Alert.alert('저장하지 못했어요', '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={
          editing
            ? {
                headerShown: true,
                title: '프로필 수정',
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
              }
            : { headerShown: false }
        }
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[8] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {!editing && <Text style={styles.heading}>우리 아이를{'\n'}알려주세요</Text>}

        <Pressable style={styles.avatar} onPress={pickPhoto}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <>
              <Text style={styles.avatarIcon}>📷</Text>
              <Text style={styles.avatarText}>사진 추가</Text>
            </>
          )}
        </Pressable>

        <View style={styles.fields}>
          <Field label="이름" required>
            <Input placeholder="예) 뭉치" value={name} onChangeText={setName} />
          </Field>
          <Field label="품종">
            <Input leftIcon="🔍" placeholder="검색하거나 입력" value={breed} onChangeText={setBreed} />
            {breed.trim().length === 0 ? (
              <View style={styles.breedChips}>
                {POPULAR_BREEDS.map((name) => (
                  <Chip key={name} variant="brand" onPress={() => setBreed(name)}>
                    {name}
                  </Chip>
                ))}
              </View>
            ) : breedSelected ? null : breedMatches.length > 0 ? (
              <View style={styles.matchList}>
                {breedMatches.map((b) => (
                  <Pressable
                    key={b.name}
                    accessibilityLabel={`${b.name} 선택`}
                    onPress={() => {
                      setBreed(b.name);
                      Keyboard.dismiss();
                    }}
                    style={({ pressed }) => [styles.matchRow, pressed && styles.matchRowPressed]}
                  >
                    <Text style={styles.matchIcon}>🔍</Text>
                    <Text style={styles.matchName}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.breedHint}>목록에 없으면 그대로 입력해도 돼요</Text>
            )}
          </Field>
          <Field label="생년월일">
            <Pressable style={styles.select} onPress={() => setShowDatePicker((v) => !v)}>
              <Text style={dob ? styles.selectValue : styles.selectPlaceholder}>{dob ?? '날짜 선택'}</Text>
              <Text style={styles.selectChevron}>⌄</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dob ? parseLocalDate(dob) : new Date()}
                mode="date"
                display="inline"
                maximumDate={new Date()}
                locale="ko-KR"
                onChange={(_, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDob(toLocalDateString(selected));
                }}
              />
            )}
          </Field>
          <Field label="성별">
            <PillGroup options={SEX} value={sex} onChange={(v) => setSex(v as '남아' | '여아')} />
          </Field>
          <Field label="중성화">
            <PillGroup options={NEUTER} value={neuter} onChange={setNeuter} />
          </Field>
        </View>

        <Button block size="lg" disabled={!canSave} onPress={save}>
          {editing ? '저장' : '시작하기'}
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
    overflow: 'hidden',
    gap: 4,
  },
  avatarImage: { width: '100%', height: '100%' },
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
  selectValue: { fontFamily, fontSize: typography.callout.size, color: colors.text },
  selectPlaceholder: { fontFamily, fontSize: typography.callout.size, color: colors.text3 },
  selectChevron: { fontFamily, fontSize: 18, color: colors.text3 },
  breedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: space[2] },
  breedHint: { fontFamily, fontSize: typography.caption.size, color: colors.text3, marginTop: 4 },
  matchList: { marginTop: 4 },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  matchRowPressed: { opacity: 0.55 },
  matchIcon: { fontSize: 16 },
  matchName: { fontFamily, fontSize: typography.callout.size, fontWeight: '600', color: colors.text },
});
