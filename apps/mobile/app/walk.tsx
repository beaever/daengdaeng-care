import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, Linking, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors } from '../theme';
import { WalkSession } from '../components/compound';
import { useWalkSession, start, pause, resume, finish, save, discard, type WalkResult } from '../lib/walk';
import { pickWalkPhoto } from '../lib/walkPhoto';
import { promptPendingWalk } from '../lib/walkRecover';
import { usePet, photoUri } from '../lib/pets';

// 산책 경로 기록 화면 (fullScreenModal). 진입 시 idle 이면 기록을 시작한다.
export default function WalkScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const { pet } = usePet();
  const view = useWalkSession();
  const [result, setResult] = useState<WalkResult | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const started = useRef(false);

  const phase = result ? 'finished' : view.phase;

  useEffect(() => {
    if (started.current || view.phase !== 'idle') return;
    started.current = true;
    (async () => {
      await promptPendingWalk(db); // start 가 미저장 포인트를 지우므로 먼저 묻는다
      const r = await start(db);
      if (r.ok) {
        if (r.reducedAccuracy) {
          Alert.alert(
            '정확한 위치가 꺼져 있어요',
            '설정에서 "정확한 위치"를 켜야 산책 경로가 지도에 그려져요.',
            [
              { text: '설정 열기', onPress: () => Linking.openSettings() },
              { text: '그냥 계속' },
            ]
          );
        }
        return;
      }
      if (r.reason === 'denied') {
        Alert.alert('위치 권한이 필요해요', '위치 권한이 없어 경로를 기록할 수 없어요. 산책은 기록 탭에서 직접 남길 수 있어요.', [
          { text: '설정 열기', onPress: () => { Linking.openSettings(); router.back(); } },
          { text: '닫기', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('산책 기록을 시작하지 못했어요', '잠시 후 다시 시도해주세요.', [{ text: '닫기', onPress: () => router.back() }]);
      }
    })();
  }, [db, router, view.phase]);

  const onEnd = () =>
    Alert.alert('산책을 끝낼까요?', undefined, [
      { text: '계속 산책' },
      { text: '종료', onPress: async () => setResult(await finish(db)) },
    ]);

  const onSave = async () => {
    setSaving(true);
    try {
      await save(db, { photo, notes: notes.trim() || null });
      router.back();
      router.navigate('/walks');
    } catch {
      Alert.alert('저장하지 못했어요', '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const onDiscard = () =>
    Alert.alert('이 산책을 버릴까요?', '기록한 경로가 사라져요.', [
      { text: '취소', style: 'cancel' },
      { text: '버리기', style: 'destructive', onPress: async () => { await discard(db); router.back(); } },
    ]);

  const fin = result ?? { minutes: Math.max(1, Math.round(view.elapsedMs / 60000)), distanceM: view.distanceM, points: view.points };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <WalkSession phase={phase}>
        <WalkSession.Map points={view.points} />
        <WalkSession.Stats elapsedMs={view.elapsedMs} distanceM={view.distanceM} />
        <WalkSession.Controls onPause={pause} onResume={resume} onEnd={onEnd} bottomInset={insets.bottom} />
        <WalkSession.Finish
          {...fin}
          photo={photo}
          petPhoto={photoUri(pet?.photo ?? null)}
          onPickPhoto={() => pickWalkPhoto(photo, setPhoto)}
          notes={notes}
          onChangeNotes={setNotes}
          saving={saving}
          onSave={onSave}
          onDiscard={onDiscard}
          bottomInset={insets.bottom}
        />
      </WalkSession>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
