import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { colors, radius, space, fontFamily, typography, palette, fontScale } from '../../theme';
import { Segment, Note, Button, Input } from '../ui';
import type { Hospital, LatLng } from '../../lib/hospitals';

// SCR-012 · 병원 목록 보조 컴포넌트 모음.
// Root는 단순 세로 스택(간격 12). 실제 리스트 조립은 화면에서 한다.
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
        { value: 'list', label: '목록' },
        { value: 'map', label: '지도' },
      ]}
    />
  );
}

export interface HospitalListMapProps {
  center: LatLng;
  hospitals: Hospital[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** 생략하면 부모 높이를 꽉 채운다(지도 전체화면 모드). 상세 화면은 고정 높이를 넘긴다. */
  height?: number;
  /** false면 스크롤·줌·회전을 막는다 (상세 화면처럼 둘러보기가 필요 없을 때). */
  interactive?: boolean;
}

// Apple 지도(react-native-maps, provider 미지정) 위에 현재 위치 + 병원 마커를 그린다.
function Map({
  center,
  hospitals,
  selectedId,
  onSelect,
  height,
  interactive = true,
}: HospitalListMapProps) {
  const region: Region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={[styles.mapWrap, height != null ? { height } : styles.mapWrapFill]}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
      >
        {hospitals.map((h) => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.lat, longitude: h.lng }}
            title={h.name}
            pinColor={h.id === selectedId ? palette.brand[500] : palette.info.base}
            accessibilityLabel={`${h.name} 위치`}
            onPress={() => onSelect?.(h.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

// 샘플 데이터 고지 — 실제 병원 데이터(T1.7, Kakao Local)로 교체되기 전까지 항상 표시한다.
// TestFlight 테스터가 샘플 병원을 실제 병원으로 오해하지 않도록 __DEV__ 로 숨기지 않는다.
// T1.7: Kakao 연동 후 삭제
function SampleNotice() {
  return <Note icon="ℹ️">샘플 데이터예요. 실제 병원이 아니에요.</Note>;
}

function ResultCount({ count }: { count: number }) {
  return <Text style={styles.count}>주변 동물병원 {count}곳</Text>;
}

export interface HospitalListLocationFallbackProps {
  region: string;
  onRegionChange: (text: string) => void;
  onSearch: () => void;
  searching?: boolean;
  error?: string | null;
}

// 위치 권한이 꺼져 있거나 현재 위치를 가져오지 못했을 때 보여주는 안내 + 지역 검색 폼.
function LocationFallback({
  region,
  onRegionChange,
  onSearch,
  searching = false,
  error,
}: HospitalListLocationFallbackProps) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackIcon}>📍</Text>
      <Text style={styles.fallbackTitle} maxFontSizeMultiplier={fontScale.heading}>
        위치 권한이 꺼져 있어요
      </Text>
      <Text style={styles.fallbackDesc}>
        설정에서 위치 권한을 허용하거나, 지역을 검색해서 주변 병원을 찾아보세요.
      </Text>
      <Button variant="outline" size="sm" onPress={() => Linking.openSettings()}>
        설정 열기
      </Button>
      <View style={styles.fallbackSearchRow}>
        <View style={styles.fallbackInput}>
          <Input
            placeholder="예: 강남역, 서울 강남구"
            value={region}
            onChangeText={onRegionChange}
            returnKeyType="search"
            onSubmitEditing={onSearch}
            accessibilityLabel="지역명 검색"
          />
        </View>
        <Button size="sm" onPress={onSearch} disabled={searching}>
          {searching ? '검색 중…' : '검색'}
        </Button>
      </View>
      {error != null && <Text style={styles.fallbackError}>{error}</Text>}
    </View>
  );
}

export const HospitalList = Object.assign(HospitalListRoot, {
  ViewToggle,
  Map,
  SampleNotice,
  ResultCount,
  LocationFallback,
});

const styles = StyleSheet.create({
  stack: { gap: space[3] },
  mapWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapWrapFill: { flex: 1, borderRadius: 0, borderWidth: 0 },
  map: { flex: 1 },
  count: { fontFamily, fontSize: typography.sub.size, fontWeight: '700', color: colors.text2 },
  fallback: {
    alignItems: 'center',
    gap: space[3],
    padding: space[5],
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
  },
  fallbackIcon: { fontSize: 36 },
  fallbackTitle: { fontFamily, fontSize: typography.title.size, fontWeight: '800', color: colors.text },
  fallbackDesc: {
    fontFamily,
    fontSize: typography.sub.size,
    color: colors.text2,
    textAlign: 'center',
  },
  fallbackSearchRow: { flexDirection: 'row', gap: space[2], alignSelf: 'stretch' },
  fallbackInput: { flex: 1 },
  fallbackError: { fontFamily, fontSize: typography.caption.size, fontWeight: '700', color: palette.danger.base },
});
