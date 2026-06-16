import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, space, radius, fontFamily, typography } from '../../../theme';
import { Field, Input, Textarea, Button } from '../../../components/ui';
import { RECORD_META } from '../../../components/compound';
import type { RecordType } from '../../../lib/sampleData';

// SCR-015 · 기록 추가 (모달/시트) — 기록 종류 선택 → 종류별 동적 폼 → 저장하기.
// 폼 자체는 화면 입력이므로 화면에서 조립. 종류 아이콘·라벨은 RECORD_META 단일 출처(RULES 2·3).
export default function AddRecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [type, setType] = useState<RecordType>('vaccine');

  const save = () => router.back();

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
            <SelectField label="백신 종류" value="DHPPL" />
            <SelectField label="접종일" value="2026.06.12" />
            <SelectField label="다음 예정일" value="2027.06.12 (자동)" />
            <Field label="메모 (선택)">
              <Textarea placeholder="특이사항을 적어주세요" />
            </Field>
          </>
        )}

        {type === 'weight' && (
          <>
            <SelectField label="날짜" value="2026.06.12" />
            <Field label="체중 (kg)">
              <Input placeholder="예) 3.2" inputMode="decimal" />
            </Field>
            <Field label="메모 (선택)">
              <Textarea placeholder="특이사항을 적어주세요" />
            </Field>
          </>
        )}

        {type === 'vet' && (
          <>
            <SelectField label="방문일" value="2026.06.12" />
            <Field label="병원 이름">
              <Input placeholder="예) 행복동물병원" />
            </Field>
            <Field label="방문 사유">
              <Input placeholder="예) 피부 발진 검진" />
            </Field>
            <Field label="메모 (선택)">
              <Textarea placeholder="진단·처방 내용을 적어주세요" />
            </Field>
          </>
        )}

        <Button block size="lg" onPress={save}>
          저장하기
        </Button>
      </ScrollView>
    </View>
  );
}

const TYPE_ORDER: RecordType[] = ['vaccine', 'weight', 'vet'];

// 기록 종류 3칩 그리드 — 선택 시 brand 강조.
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

// 읽기 전용 셀렉트 표시(데모) — 실제 피커 연동 전까지 값 + ⌄ 표기.
function SelectField({ label, value }: { label: string; value: string }) {
  return (
    <Field label={label}>
      <Pressable style={styles.select}>
        <Text style={styles.selectValue}>{value}</Text>
        <Text style={styles.selectChev}>⌄</Text>
      </Pressable>
    </Field>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space[5], gap: space[5] },
  typeGrid: { flexDirection: 'row', gap: space[2] },
  typeChip: {
    flex: 1,
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
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
  },
  selectValue: { fontFamily, fontSize: typography.callout.size, color: colors.text },
  selectChev: { fontFamily, fontSize: 18, color: colors.text3 },
});
