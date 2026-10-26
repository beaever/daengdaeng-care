// 강제 종료 등으로 남은 미저장 산책이 있으면 저장/버리기를 묻는다. 선택이 끝나면 resolve.
import { Alert } from 'react-native';
import type { SQLiteDatabase } from 'expo-sqlite';
import { formatDistance } from './geo';
import { discard, recoverPending, saveResult } from './walk';
import { walkSession } from './walkTask';

export async function promptPendingWalk(db: SQLiteDatabase): Promise<void> {
  if (walkSession.current) return; // 진행 중인 세션의 포인트는 미완료가 아니다
  const pending = await recoverPending(db);
  if (!pending) return;
  await new Promise<void>((resolve) => {
    Alert.alert(
      '지난 산책이 중간에 끊겼어요',
      `마지막 위치까지 저장할까요? (${pending.minutes}분 · ${formatDistance(pending.distanceM) || '0m'})`,
      [
        {
          text: '저장',
          onPress: async () => {
            try {
              await saveResult(db, pending, {});
            } catch {
              Alert.alert('저장하지 못했어요', '잠시 후 다시 시도해주세요.');
            }
            resolve();
          },
        },
        {
          text: '버리기',
          style: 'destructive',
          onPress: async () => {
            await discard(db).catch(() => {});
            resolve();
          },
        },
      ],
      { cancelable: false }
    );
  });
}
