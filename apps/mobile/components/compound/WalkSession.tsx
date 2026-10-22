import React, { createContext, useContext, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { colors, space, radius, fontFamily, typography, fontScale } from '../../theme';
import { Button, Field, Textarea, WalkRouteMap, StickerPhoto } from '../ui';
import { formatDistance, type RoutePoint } from '../../lib/geo';
import type { WalkPhase } from '../../lib/walk';

// SCR · 산책 경로 기록 — 컴파운드(WalkSession + .Map/.Stats/.Controls/.Finish).
// phase(recording/paused/finished) 분기는 Root 가 context 로 내려 각 파트가 자기 phase 에서만 그린다.
const PhaseContext = createContext<WalkPhase>('idle');

export interface WalkSessionProps {
  phase: WalkPhase;
  children: React.ReactNode;
}

function WalkSessionRoot({ phase, children }: WalkSessionProps) {
  return (
    <PhaseContext.Provider value={phase}>
      <View style={styles.root}>{children}</View>
    </PhaseContext.Provider>
  );
}

const useActive = () => {
  const phase = useContext(PhaseContext);
  return phase === 'recording' || phase === 'paused';
};

/** 경과 시간 mm:ss, 1시간 이상은 h:mm:ss */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// 산책 중 지도 줌 — 첫 위치를 받으면 이 고도(m, Apple 지도)로 확대한다. 이후엔 followsUserLocation 이 중심만 따라간다.
const WALK_CAMERA_ALTITUDE = 600;
const WALK_CAMERA_ZOOM = 17;

function WalkMap({ points }: { points: RoutePoint[] }) {
  const ref = useRef<MapView>(null);
  const zoomed = useRef(false);
  const segs = new Map<number, { latitude: number; longitude: number }[]>();
  for (const p of points) {
    const line = segs.get(p.seg) ?? [];
    line.push({ latitude: p.lat, longitude: p.lng });
    segs.set(p.seg, line);
  }
  if (!useActive()) return null;
  return (
    <MapView
      ref={ref}
      style={styles.map}
      showsUserLocation
      followsUserLocation
      onUserLocationChange={(e) => {
        const c = e.nativeEvent.coordinate;
        if (zoomed.current || !c) return;
        zoomed.current = true;
        ref.current?.animateCamera(
          { center: { latitude: c.latitude, longitude: c.longitude }, altitude: WALK_CAMERA_ALTITUDE, zoom: WALK_CAMERA_ZOOM },
          { duration: 300 }
        );
      }}
      accessibilityLabel="산책 경로 지도"
    >
      {[...segs.entries()].map(([seg, coordinates]) => (
        <Polyline key={seg} coordinates={coordinates} strokeColor={colors.brand} strokeWidth={5} />
      ))}
    </MapView>
  );
}

function WalkStats({ elapsedMs, distanceM }: { elapsedMs: number; distanceM: number }) {
  if (!useActive()) return null;
  const time = formatElapsed(elapsedMs);
  const dist = formatDistance(distanceM) || '0m';
  return (
    <View style={styles.stats} accessible accessibilityLabel={`경과 시간 ${time}, 거리 ${dist}`}>
      <View style={styles.stat}>
        <Text style={styles.statValue} maxFontSizeMultiplier={fontScale.heading}>{time}</Text>
        <Text style={styles.statLabel}>시간</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statValue} maxFontSizeMultiplier={fontScale.heading}>{dist}</Text>
        <Text style={styles.statLabel}>거리</Text>
      </View>
    </View>
  );
}

function WalkControls({
  onPause,
  onResume,
  onEnd,
  bottomInset = 0,
}: {
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  bottomInset?: number;
}) {
  const phase = useContext(PhaseContext);
  if (!useActive()) return null;
  return (
    <View style={[styles.controls, { paddingBottom: space[5] + bottomInset }]}>
      {phase === 'recording' ? (
        <Button variant="secondary" size="lg" style={styles.flex} onPress={onPause}>일시정지</Button>
      ) : (
        <Button size="lg" style={styles.flex} onPress={onResume}>재개</Button>
      )}
      <Button variant="danger" size="lg" style={styles.flex} onPress={onEnd}>종료</Button>
    </View>
  );
}

export interface WalkFinishProps {
  minutes: number;
  distanceM: number;
  points: RoutePoint[];
  photo: string | null;
  /** 스티커로 겹칠 프로필 사진 URI */
  petPhoto?: string;
  onPickPhoto: () => void;
  notes: string;
  onChangeNotes: (t: string) => void;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  bottomInset?: number;
}

function WalkFinish(p: WalkFinishProps) {
  const phase = useContext(PhaseContext);
  if (phase !== 'finished') return null;
  // 스크롤 영역은 finished 에서만 만든다 — 기록 중에 있으면 지도 아래 공간을 빈 칸으로 차지한다.
  return (
    <ScrollView
      contentContainerStyle={[styles.finish, { paddingBottom: space[5] + (p.bottomInset ?? 0) }]}
      keyboardShouldPersistTaps="handled"
    >
      {p.points.length >= 2 && <WalkRouteMap points={p.points} style={styles.summaryMap} />}
      <Text style={styles.summary} maxFontSizeMultiplier={fontScale.heading}>
        {p.minutes}분 산책 · {formatDistance(p.distanceM) || '0m'}
      </Text>
      <Field label="사진 (선택)">
        <Pressable
          onPress={p.onPickPhoto}
          accessibilityRole="button"
          accessibilityLabel={p.photo ? '산책 사진 바꾸기' : '산책 사진 추가'}
          style={styles.photoBox}
        >
          {p.photo ? (
            <StickerPhoto uri={p.photo} stickerUri={p.petPhoto} />
          ) : (
            <Text style={styles.photoHint}>📷 사진 찍기 · 앨범에서 고르기</Text>
          )}
        </Pressable>
      </Field>
      <Field label="메모 (선택)">
        <Textarea placeholder="특이사항을 적어주세요" value={p.notes} onChangeText={p.onChangeNotes} />
      </Field>
      <Button block size="lg" disabled={p.saving} onPress={p.onSave}>저장하기</Button>
      <Button block variant="ghost" disabled={p.saving} onPress={p.onDiscard}>버리기</Button>
    </ScrollView>
  );
}

export const WalkSession = Object.assign(WalkSessionRoot, {
  Map: WalkMap,
  Stats: WalkStats,
  Controls: WalkControls,
  Finish: WalkFinish,
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  map: { flex: 1 },
  flex: { flex: 1 },
  stats: {
    flexDirection: 'row',
    paddingVertical: space[4],
    paddingHorizontal: space[5],
    backgroundColor: colors.surface,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontFamily, fontSize: typography.display.size, fontWeight: '800', color: colors.text },
  statLabel: { fontFamily, fontSize: typography.caption.size, color: colors.text2 },
  controls: { flexDirection: 'row', gap: space[3], padding: space[5], backgroundColor: colors.surface },
  finish: { padding: space[5], gap: space[5] },
  summaryMap: { height: 220, borderRadius: radius.md },
  summary: { fontFamily, fontSize: typography.h1.size, fontWeight: '800', color: colors.text, textAlign: 'center' },
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
