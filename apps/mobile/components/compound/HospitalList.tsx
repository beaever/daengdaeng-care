import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, radius, space, fontFamily, typography, palette } from '../../theme';
import { Segment } from '../ui';

// SCR-012 · 병원 목록 보조 컴포넌트 모음.
// Root는 단순 세로 스택(간격 12). 실제 리스트 조립(NativeAd 3번째 삽입)은 화면에서 한다.
export interface HospitalListProps {
  children: React.ReactNode;
}

function HospitalListRoot({ children }: HospitalListProps) {
  return <View style={styles.stack}>{children}</View>;
}

// 지도 / 목록 뷰 토글
function ViewToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Segment
      value={value}
      onChange={onChange}
      options={[
        { value: 'map', label: '지도' },
        { value: 'list', label: '목록' },
      ]}
    />
  );
}

// 반경 선택 칩 (연동 자리 — 표시용)
function RadiusSelector({ value = '1km', onPress }: { value?: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.radius, pressed && styles.radiusPressed]}
    >
      <Text style={styles.radiusText}>반경 {value} ⌄</Text>
    </Pressable>
  );
}

// 가짜 지도 영역 (지도 SDK 연동 전 자리). 핀=현재 위치, 이모지=주변 병원.
function Map({ height = 150 }: { height?: number }) {
  return (
    <View style={[styles.map, { height }]}>
      <View style={styles.mapPinWrap}>
        <View style={styles.mapPin} />
      </View>
      <Text style={[styles.mapMarker, { left: '30%', top: '30%' }]}>🟢</Text>
      <Text style={[styles.mapMarker, { left: '64%', top: '36%' }]}>⭐</Text>
      <Text style={[styles.mapMarker, { left: '70%', top: '64%' }]}>🔴</Text>
    </View>
  );
}

function ResultCount({ count }: { count: number }) {
  return <Text style={styles.count}>주변 동물병원 {count}곳</Text>;
}

export const HospitalList = Object.assign(HospitalListRoot, {
  ViewToggle,
  RadiusSelector,
  Map,
  ResultCount,
});

const styles = StyleSheet.create({
  stack: { gap: space[3] },
  radius: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
  },
  radiusPressed: { opacity: 0.6 },
  radiusText: { fontFamily, fontSize: typography.sub.size, fontWeight: '700', color: colors.text },
  map: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.safe.soft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPinWrap: {
    position: 'absolute',
    left: '46%',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: palette.info.base,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  mapMarker: { position: 'absolute', fontSize: 22 },
  count: { fontFamily, fontSize: typography.sub.size, fontWeight: '700', color: colors.text2 },
});
