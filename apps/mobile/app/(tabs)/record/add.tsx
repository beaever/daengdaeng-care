import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { colors, space, radius, fontFamily, typography } from '../../../theme';
import { Field, Input, Textarea, Button, PillGroup, DateField } from '../../../components/ui';
import type { PillGroupOption } from '../../../components/ui';
import { RECORD_META } from '../../../components/compound';
import { addRecord, type RecordType, type NewRecord } from '../../../lib/records';
import { savePetPhoto, deletePetPhoto } from '../../../lib/pets';
import { toLocalDateString, parseLocalDate, addYears } from '../../../lib/recordSummary';

const TYPE_ORDER: RecordType[] = ['vaccine', 'weight', 'vet', 'walk'];

const VACCINE_OPTIONS: PillGroupOption[] = [
  { label: 'DHPPL', value: 'DHPPL' },
  { label: '코로나 장염', value: '코로나 장염' },
  { label: '켄넬코프', value: '켄넬코프' },
  { label: '광견병', value: '광견병' },
  { label: '인플루엔자', value: '인플루엔자' },
  { label: '기타', value: '기타' },
];

/** 쉼표를 점으로 치환하고 0 < kg < 100 숫자인지 검사한다. 유효하지 않으면 null. */
function normalizeWeight(raw: string): string | null {
  const normalized = raw.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const n = Number(normalized);
  if (!(n > 0 && n < 100)) return null;
  return normalized;
}

/** 산책 시간(분) — 비어 있으면 '', 1~600 정수가 아니면 null. */
function normalizeMinutes(raw: string): string | null {
  const t = raw.trim();
  if (t === '') return '';
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= 600 ? String(n) : null;
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };

// SCR-015 · 기록 추가 (모달/시트) — 기록 종류 선택 → 종류별 동적 폼 → 저장하기.
// 폼 자체는 화면 입력이므로 화면에서 조립. 종류 아이콘·라벨은 RECORD_META 단일 출처(RULES 2·3).
export default function AddRecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();

  const [type, setType] = useState<RecordType>('vaccine');
  const [date, setDate] = useState(new Date());
  const [nextDate, setNextDate] = useState(() => parseLocalDate(addYears(toLocalDateString(new Date()), 1)));
  const [vaccineKind, setVaccineKind] = useState('DHPPL');
  const [vaccineOther, setVaccineOther] = useState('');
  const [weightText, setWeightText] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [notes, setNotes] = useState('');
  const [walkMinutes, setWalkMinutes] = useState('');
  const [pickedPhoto, setPickedPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date();

  const changeDate = (d: Date) => {
    setDate(d);
    // 사용자 결정: 접종일이 바뀌면 다음 예정일은 접종일 + 1년으로 재계산한다.
    setNextDate(parseLocalDate(addYears(toLocalDateString(d), 1)));
  };

  const vaccineValid = vaccineKind !== '기타' || vaccineOther.trim().length > 0;
  const weightValid = normalizeWeight(weightText) !== null;
  const vetValid = hospitalName.trim().length > 0;
  const walkValid = normalizeMinutes(walkMinutes) !== null;
  const typeValid = { vaccine: vaccineValid, weight: weightValid, vet: vetValid, walk: walkValid }[type];
  const canSave = !saving && typeValid;

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('카메라 권한이 필요해요', 'iPhone 설정 → 댕댕케어에서 카메라를 허용해주세요.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) setPickedPhoto(result.assets[0].uri);
  };

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) setPickedPhoto(result.assets[0].uri);
  };

  const pickPhoto = () => {
    Alert.alert('산책 사진', undefined, [
      { text: '사진 찍기', onPress: takePhoto },
      { text: '앨범에서 고르기', onPress: choosePhoto },
      ...(pickedPhoto ? [{ text: '사진 빼기', style: 'destructive' as const, onPress: () => setPickedPhoto(null) }] : []),
      { text: '취소', style: 'cancel' },
    ]);
  };

  const buildInput = (): NewRecord => {
    const dateStr = toLocalDateString(date);
    const notesValue = notes.trim() || undefined;
    if (type === 'vaccine') {
      return {
        type: 'vaccine',
        date: dateStr,
        title: vaccineKind === '기타' ? vaccineOther.trim() : vaccineKind,
        next_date: toLocalDateString(nextDate),
        notes: notesValue,
      };
    }
    if (type === 'weight') {
      return {
        type: 'weight',
        date: dateStr,
        title: normalizeWeight(weightText) ?? weightText.trim(),
        notes: notesValue,
      };
    }
    if (type === 'walk') {
      const minutes = normalizeMinutes(walkMinutes);
      return {
        type: 'walk',
        date: dateStr,
        title: minutes ? `${minutes}분 산책` : '산책',
        notes: notesValue,
      };
    }
    return {
      type: 'vet',
      date: dateStr,
      title: hospitalName.trim(),
      sub: visitReason.trim() || undefined,
      notes: notesValue,
    };
  };

  const save = async () => {
    setSaving(true);
    let photo: string | null = null;
    try {
      if (type === 'walk' && pickedPhoto) photo = savePetPhoto(pickedPhoto);
      await addRecord(db, { ...buildInput(), photo });
      router.back();
    } catch {
      if (photo) deletePetPhoto(photo); // DB 저장 실패 시 복사한 파일이 고아로 남지 않게
      Alert.alert('저장하지 못했어요', '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="기록 종류">
          <RecordTypeSelector value={type} onChange={setType} />
        </Field>

        {type === 'vaccine' && (
          <>
            <Field label="백신 종류">
              <View style={styles.pillRows}>
                <PillGroup options={VACCINE_OPTIONS.slice(0, 3)} value={vaccineKind} onChange={setVaccineKind} />
                <PillGroup options={VACCINE_OPTIONS.slice(3)} value={vaccineKind} onChange={setVaccineKind} />
              </View>
            </Field>
            {vaccineKind === '기타' && (
              <Field label="백신 이름" required>
                <Input placeholder="예) 심장사상충" value={vaccineOther} onChangeText={setVaccineOther} />
              </Field>
            )}
            <DateField label="접종일" value={date} onChange={changeDate} maximumDate={today} />
            <DateField label="다음 예정일" value={nextDate} onChange={setNextDate} minimumDate={date} />
          </>
        )}

        {type === 'weight' && (
          <>
            <DateField label="측정일" value={date} onChange={changeDate} maximumDate={today} />
            <Field label="체중 (kg)" required>
              <Input
                placeholder="예) 3.2"
                inputMode="decimal"
                value={weightText}
                onChangeText={setWeightText}
              />
            </Field>
          </>
        )}

        {type === 'vet' && (
          <>
            <DateField label="방문일" value={date} onChange={changeDate} maximumDate={today} />
            <Field label="병원 이름" required>
              <Input placeholder="예) 행복동물병원" value={hospitalName} onChangeText={setHospitalName} />
            </Field>
            <Field label="방문 사유">
              <Input placeholder="예) 피부 발진 검진" value={visitReason} onChangeText={setVisitReason} />
            </Field>
          </>
        )}

        {type === 'walk' && (
          <>
            <DateField label="산책한 날" value={date} onChange={changeDate} maximumDate={today} />
            <Field label="산책 시간 (분, 선택)">
              <Input placeholder="예) 30" inputMode="numeric" value={walkMinutes} onChangeText={setWalkMinutes} />
            </Field>
            <Field label="사진 (선택)">
              <Pressable
                onPress={pickPhoto}
                accessibilityRole="button"
                accessibilityLabel={pickedPhoto ? '산책 사진 바꾸기' : '산책 사진 추가'}
                style={styles.photoBox}
              >
                {pickedPhoto ? (
                  <Image source={{ uri: pickedPhoto }} style={styles.photo} accessibilityIgnoresInvertColors />
                ) : (
                  <Text style={styles.photoHint}>📷 사진 찍기 · 앨범에서 고르기</Text>
                )}
              </Pressable>
            </Field>
          </>
        )}

        <Field label="메모 (선택)">
          <Textarea placeholder="특이사항을 적어주세요" value={notes} onChangeText={setNotes} />
        </Field>

        <Button block size="lg" disabled={!canSave} onPress={save}>
          저장하기
        </Button>
      </ScrollView>
    </View>
  );
}

// 기록 종류 4칩 그리드 — 선택 시 brand 강조.
function RecordTypeSelector({
  value,
  onChange,
}: {
  value: RecordType;
  onChange: (t: RecordType) => void;
}) {
  return (
    <View style={styles.typeGrid}>
      {TYPE_ORDER.map((t) => {
        const active = t === value;
        const m = RECORD_META[t];
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={m.label}
            style={[styles.typeChip, active && styles.typeChipOn]}
          >
            <Text style={styles.typeEmoji}>{m.emoji}</Text>
            <Text style={[styles.typeLabel, active && styles.typeLabelOn]}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], gap: space[5] },
  typeGrid: { flexDirection: 'row', gap: space[2] },
  typeChip: {
    flex: 1,
    minHeight: 44,
    paddingVertical: space[4],
    gap: space[1],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.sm,
  },
  typeChipOn: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  typeEmoji: { fontSize: 24 },
  typeLabel: { fontFamily, fontSize: typography.sub.size, fontWeight: '600', color: colors.text2 },
  typeLabelOn: { color: colors.brandText, fontWeight: '700' },
  pillRows: { gap: space[2] },
  photoBox: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  photo: { width: '100%', aspectRatio: 4 / 3 },
  photoHint: { fontFamily, fontSize: typography.sub.size, fontWeight: '600', color: colors.text2 },
});
