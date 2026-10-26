import React, { useRef } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { colors, space } from '../../theme';
import type { RoutePoint } from '../../lib/geo';

// 읽기 전용 산책 경로 지도 — seg(일시정지 구간)별로 Polyline 을 따로 그려 구간끼리 잇지 않는다.
// 병원 찾기와 같이 Apple 지도(provider 미지정). 산책 종료 요약·경로 보기에서 공용.
export interface WalkRouteMapProps {
  points: RoutePoint[];
  style?: StyleProp<ViewStyle>;
}

const EDGE_PADDING = { top: space[8], right: space[8], bottom: space[8], left: space[8] };

export function WalkRouteMap({ points, style }: WalkRouteMapProps) {
  const ref = useRef<MapView>(null);

  const segs = new Map<number, { latitude: number; longitude: number }[]>();
  for (const p of points) {
    const line = segs.get(p.seg) ?? [];
    line.push({ latitude: p.lat, longitude: p.lng });
    segs.set(p.seg, line);
  }

  const fit = () => {
    if (points.length === 0) return;
    ref.current?.fitToCoordinates(
      points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      { edgePadding: EDGE_PADDING, animated: false }
    );
  };

  return (
    <MapView
      ref={ref}
      style={[styles.map, style]}
      onLayout={fit}
      onMapReady={fit}
      accessibilityLabel="산책 경로 지도"
    >
      {[...segs.entries()].map(([seg, coordinates]) => (
        <Polyline key={seg} coordinates={coordinates} strokeColor={colors.brand} strokeWidth={5} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%', overflow: 'hidden' },
});
