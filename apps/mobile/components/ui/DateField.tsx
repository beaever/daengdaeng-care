import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, fontFamily, typography } from '../../theme';
import { toLocalDateString } from '../../lib/recordSummary';
import { Field } from './Input';

// 날짜 선택 행 — 탭하면 inline 달력을 펼친다. 값은 로컬 날짜 기준으로 표시한다.
export interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (d: Date) => void;
  /** value 가 null 일 때 보여줄 문구 */
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DateField({ label, value, onChange, placeholder, maximumDate, minimumDate }: DateFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <Pressable
        style={styles.select}
        onPress={() => setShow((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={`${label} 선택`}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? toLocalDateString(value).replace(/-/g, '.') : placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="inline"
          locale="ko-KR"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={(_, selected) => {
            setShow(false);
            if (selected) onChange(selected);
          }}
        />
      )}
    </Field>
  );
}

const styles = StyleSheet.create({
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52, // Dynamic Type 확대 시 날짜 텍스트 잘림 방지 (고정 height 금지)
    paddingHorizontal: 16,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
  },
  value: { fontFamily, fontSize: typography.callout.size, color: colors.text },
  placeholder: { fontFamily, fontSize: typography.callout.size, color: colors.text3 },
  chevron: { fontFamily, fontSize: 18, color: colors.text3 },
});
