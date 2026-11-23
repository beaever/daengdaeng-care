import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, space, radius, fontFamily, typography } from '../../../theme';
import { Field, Input, Textarea, Button, PillGroup, DateField } from '../../../components/ui';
import type { PillGroupOption } from '../../../components/ui';
import { RECORD_META } from '../../../components/compound';
import { addRecord, type RecordType, type NewRecord } from '../../../lib/records';
import { pickWalkPhoto } from '../../../lib/walkPhoto';
import { requestPermissionAndReschedule } from '../../../lib/notifications';
import { savePetPhoto, deletePetPhoto } from '../../../lib/pets';
import { toLocalDateString, parseLocalDate, addYears, addMonths, normalizeWeight, normalizeMinutes } from '../../../lib/recordSummary';

const TYPE_ORDER: RecordType[] = ['vaccine', 'medicine', 'weight', 'vet', 'walk'];

const VACCINE_OPTIONS: PillGroupOption[] = [
  { label: 'DHPPL', value: 'DHPPL' },
  { label: '코로나 장염', value: '코로나 장염' },
  { label: '켄넬코프', value: '켄넬코프' },
  { label: '광견병', value: '광견병' },
  { label: '인플루엔자', value: '인플루엔자' },
  { label: '기타', value: '기타' },
];

const MEDICINE_OPTIONS: PillGroupOption[] = [
  { label: '심장사상충', value: '심장사상충' },
  { label: '구충', value: '구충' },
  { label: '진드기·벼룩', value: '진드기·벼룩' },
  { label: '기타', value: '기타' },
];
const CYCLE_OPTIONS: PillGroupOption[] = [
  { label: '1개월', value: '1' },
  { label: '3개월', value: '3' },
];
// 종류별 기본 투약 주기(개월)
const DEFAULT_CYCLE: Record<string, string> = { 심장사상충: '1', 구충: '3', '진드기·벼룩': '1', 기타: '1' };

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
  const [medicineKind, setMedicineKind] = useState('심장사상충');
  const [medicineOther, setMedicineOther] = useState('');
  const [cycle, setCycle] = useState('1');
  const [weightText, setWeightText] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [notes, setNotes] = useState('');
  const [walkMinutes, setWalkMinutes] = useState('');
  const [pickedPhoto, setPickedPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date();

  // 사용자 결정: 접종일이 바뀌면 다음 예정일은 접종일 + 1년, 예방약은 투약일 + 주기로 재계산한다.
  const recalcNext = (t: RecordType, d: Date, months: string) => {
    const iso = toLocalDateString(d);
    setNextDate(parseLocalDate(t === 'medicine' ? addMonths(iso, Number(months)) : addYears(iso, 1)));
  };
  const changeDate = (d: Date) => {
    setDate(d);
    recalcNext(type, d, cycle);
  };
  const changeType = (t: RecordType) => {
    setType(t);
    recalcNext(t, date, cycle);
  };
  const changeMedicineKind = (k: string) => {
    setMedicineKind(k);
    setCycle(DEFAULT_CYCLE[k]);
    recalcNext('medicine', date, DEFAULT_CYCLE[k]);
  };
  const changeCycle = (c: string) => {
    setCycle(c);
    recalcNext('medicine', date, c);
  };

  const vaccineValid = vaccineKind !== '기타' || vaccineOther.trim().length > 0;
  const medicineValid = medicineKind !== '기타' || medicineOther.trim().length > 0;
  const weightValid = normalizeWeight(weightText) !== null;
  const vetValid = hospitalName.trim().length > 0;
  const walkValid = normalizeMinutes(walkMinutes) !== null;
  const typeValid = { vaccine: vaccineValid, medicine: medicineValid, weight: weightValid, vet: vetValid, walk: walkValid }[type];
  const canSave = !saving && typeValid;

  const pickPhoto = () => pickWalkPhoto(pickedPhoto, setPickedPhoto);

  // 시트를 닫고 산책 화면으로
  const startTrackedWalk = () => {
    router.back();
    router.push('/walk');
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
    if (type === 'medicine') {
      return {
        type: 'medicine',
        date: dateStr,
        title: medicineKind === '기타' ? medicineOther.trim() : medicineKind,
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
      const input = buildInput();
      await addRecord(db, { ...input, photo });
      // 접종·예방약 예정일 알림 권한(iOS는 첫 1회만 팝업). 실패해도 저장 흐름은 계속.
      if (input.next_date) await requestPermissionAndReschedule(db).catch(() => {});
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
          <RecordTypeSelector value={type} onChange={changeType} />
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
                <Input placeholder="예) 렙토스피라" value={vaccineOther} onChangeText={setVaccineOther} />
              </Field>
            )}
            <DateField label="접종일" value={date} onChange={changeDate} maximumDate={today} />
            <DateField label="다음 예정일" value={nextDate} onChange={setNextDate} minimumDate={date} />
          </>
        )}

        {type === 'medicine' && (
          <>
            <Field label="약 종류">
              <View style={styles.pillRows}>
                <PillGroup options={MEDICINE_OPTIONS.slice(0, 2)} value={medicineKind} onChange={changeMedicineKind} />
                <PillGroup options={MEDICINE_OPTIONS.slice(2)} value={medicineKind} onChange={changeMedicineKind} />
              </View>
            </Field>
            {medicineKind === '기타' && (
              <Field label="약 이름" required>
                <Input placeholder="약 이름" value={medicineOther} onChangeText={setMedicineOther} />
              </Field>
            )}
            <Field label="투약 주기">
              <PillGroup options={CYCLE_OPTIONS} value={cycle} onChange={changeCycle} />
            </Field>
            <DateField label="투약일" value={date} onChange={changeDate} maximumDate={today} />
            <DateField label="다음 투약일" value={nextDate} onChange={setNextDate} minimumDate={date} />
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
            <Button variant="outline" block onPress={startTrackedWalk}>
              📍 경로 기록하며 산책 시작
            </Button>
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

// 기록 종류 5칩 그리드 — 선택 시 brand 강조.
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  typeChip: {
    flexGrow: 1,
    flexBasis: '30%', // 5칩이 좁은 폭에서 3+2줄로 감싼다
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
