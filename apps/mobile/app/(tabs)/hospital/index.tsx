import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { colors, space, fontFamily, typography } from '../../../theme';
import { HospitalCard, HospitalList } from '../../../components/compound';
import { Button, EmptyState } from '../../../components/ui';
import { searchHospitals, geocodeRegion, type Hospital, type LatLng } from '../../../lib/hospitals';

// fallback: 위치를 못 받음 → 지역 검색 / error: 병원 검색 실패(오프라인·API 오류) → 다시 시도
type Status = 'loading' | 'ready' | 'fallback' | 'error';

// SCR-012 · 병원 목록 (병원 탭) — 토글(목록/지도) + 거리순 카드 또는 지도+선택 카드.
export default function HospitalListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('list');
  const [status, setStatus] = useState<Status>('loading');
  const [center, setCenter] = useState<LatLng | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [regionText, setRegionText] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 병원 검색 실패를 위치 실패(fallback)와 구분해 'error' 로 보낸다. center 는 다시 시도용으로 먼저 저장한다.
  async function loadHospitals(c: LatLng) {
    setCenter(c);
    setStatus('loading');
    try {
      const list = await searchHospitals(c);
      setHospitals(list);
      setSelectedId(list[0]?.id);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  // 병원 탭에 들어올 때만 위치 권한을 요청한다. 거부/실패하면 지역 검색 안내로 대체한다.
  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    (async () => {
      try {
        const { status: perm } = await Location.requestForegroundPermissionsAsync();
        if (perm !== 'granted') {
          if (mounted) setStatus('fallback');
          return;
        }

        // GPS 가 느리면 "위치 확인 중…" 이 무한 대기할 수 있다(expo-location 57 에는 timeout 옵션이
        // 없음). 캐시된 마지막 위치가 있으면 바로 쓰고, 없으면 10초 타임아웃과 경쟁시켜
        // 타임아웃/에러면 지역 검색(LocationFallback)으로 넘어간다.
        let pos = await Location.getLastKnownPositionAsync();
        if (pos == null) {
          const posPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const timeout = new Promise<null>((resolve) => {
            timeoutId = setTimeout(() => resolve(null), 10_000);
          });
          pos = await Promise.race([posPromise, timeout]);
          if (timeoutId != null) clearTimeout(timeoutId);
          posPromise.catch(() => {}); // 타임아웃으로 진 뒤 늦게 reject 돼도 unhandled rejection 방지
        }
        if (pos == null) {
          if (mounted) setStatus('fallback');
          return;
        }

        if (mounted) await loadHospitals({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        if (mounted) setStatus('fallback');
      }
    })();

    return () => {
      mounted = false;
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, []);

  async function handleRegionSearch() {
    const query = regionText.trim();
    if (query.length === 0) return;
    setSearching(true);
    setSearchError(null);
    // geocodeAsync 는 오프라인이면 실패해 null 이 된다 — 연결 확인도 함께 안내한다.
    const found = await geocodeRegion(query);
    setSearching(false);
    if (!found) {
      setSearchError('지역을 찾지 못했어요. 인터넷 연결도 확인해 주세요.');
      return;
    }
    await loadHospitals(found);
  }

  function goToDetail(h: Hospital) {
    router.push({
      pathname: '/hospital/detail',
      params: {
        id: h.id,
        name: h.name,
        address: h.address,
        phone: h.phone,
        lat: String(h.lat),
        lng: String(h.lng),
        distance: String(h.distance),
      },
    });
  }

  const selected = hospitals.find((h) => h.id === selectedId) ?? hospitals[0];

  return (
    <View style={styles.root}>
      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} />
          <Text style={styles.loadingText}>위치 확인 중…</Text>
        </View>
      )}

      {status === 'fallback' && (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
          showsVerticalScrollIndicator={false}
        >
          <HospitalList.LocationFallback
            region={regionText}
            onRegionChange={setRegionText}
            onSearch={handleRegionSearch}
            searching={searching}
            error={searchError}
          />
        </ScrollView>
      )}

      {status === 'error' && (
        <EmptyState
          icon="📡"
          title="병원 정보를 불러오지 못했어요"
          description="인터넷 연결을 확인한 뒤 다시 시도해 주세요."
          action={
            <Button size="sm" onPress={() => center != null && loadHospitals(center)}>
              다시 시도
            </Button>
          }
        />
      )}

      {status === 'ready' && center != null && (
        <View style={styles.flexFull}>
          <View style={styles.toolbar}>
            <View style={styles.toggle}>
              <HospitalList.ViewToggle value={view} onChange={setView} />
            </View>
          </View>

          {/* 목록/지도 공통 영역 — 샘플 데이터 고지는 뷰 전환과 무관하게 항상 보여야 한다. */}
          <View style={styles.noticeWrap}>
            <HospitalList.SampleNotice />
          </View>

          {view === 'list' ? (
            <ScrollView
              contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[8] }]}
              showsVerticalScrollIndicator={false}
            >
              <HospitalList>
                <HospitalList.ResultCount count={hospitals.length} />
                {hospitals.length === 0 && (
                  <EmptyState icon="🏥" title="근처에 동물병원이 없어요" description="이 주변에서는 동물병원을 찾지 못했어요." />
                )}
                {hospitals.map((h) => (
                  <HospitalCard key={h.id} hospital={h} onPress={() => goToDetail(h)} />
                ))}
              </HospitalList>
            </ScrollView>
          ) : (
            <View style={styles.mapArea}>
              <HospitalList.Map
                center={center}
                hospitals={hospitals}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              {selected != null && (
                <View style={[styles.selectedCardWrap, { paddingBottom: insets.bottom + space[4] }]}>
                  <HospitalCard hospital={selected} onPress={() => goToDetail(selected)} />
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flexFull: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[2] },
  loadingText: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    gap: space[3],
  },
  toggle: { width: 150 },
  noticeWrap: { paddingHorizontal: space[5], paddingBottom: space[3] },
  content: { paddingHorizontal: space[5], paddingTop: space[1] },
  mapArea: { flex: 1 },
  selectedCardWrap: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
    backgroundColor: colors.bg,
  },
});
