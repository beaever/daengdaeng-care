import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Switch, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors, space, fontFamily, typography } from '../theme';
import { Card, Row, Divider, SectionHeading } from '../components/ui';
import { usePet, formatAge } from '../lib/pets';
import { getNotifySettings, setNotifySettings, rescheduleAll } from '../lib/notifications';

// SCR-016 · 설정 — 프로필 · 알림(접종 예정일) · 지원·개인정보처리방침(App Store 5.1.1)·이용약관(건강 정보 면책). (단위 설정은 v1.0 미지원이라 뺐다) (헤더/뒤로는 루트 Stack 제공)
// 도메인 구매 시 apps/web lib/content.ts 의 siteUrl 과 함께 바꾼다.
const SITE_URL = 'https://daengdaeng-care.pages.dev';

export default function SettingsScreen() {
  const router = useRouter();
  const { pet } = usePet();
  const goProfile = () => router.push('/profile');
  const db = useSQLiteContext();
  const [notify, setNotify] = useState<{ enabled: boolean; time: string } | null>(null);
  useEffect(() => {
    // 저장값이 켜짐(기본)이어도 OS 권한이 없으면 알림이 안 오므로 꺼짐으로 보여준다.
    Promise.all([getNotifySettings(db), Notifications.getPermissionsAsync()])
      .then(([s, perm]) => setNotify({ ...s, enabled: s.enabled && perm.granted }))
      .catch(() => {});
  }, [db]);

  const update = async (next: { enabled?: boolean; time?: string }) => {
    await setNotifySettings(db, next);
    setNotify((n) => n && { ...n, ...next });
    await rescheduleAll(db);
  };

  const toggle = async (on: boolean) => {
    if (on) {
      let perm = await Notifications.getPermissionsAsync();
      if (!perm.granted && perm.canAskAgain) perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('알림이 꺼져 있어요', 'iPhone 설정에서 댕댕케어 알림을 허용해주세요.', [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
    }
    await update({ enabled: on });
  };

  const [hh, mm] = (notify?.time ?? '09:00').split(':').map(Number);
  const timeValue = new Date(2000, 0, 1, hh, mm);
  const pickTime = (_: unknown, d?: Date) => {
    if (d) update({ time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {pet !== undefined && (
        <View>
          <SectionHeading>반려견 프로필</SectionHeading>
          <Card style={styles.card}>
            {pet ? (
              <Row
                icon="🐶"
                title={pet.name}
                sub={[pet.breed, formatAge(pet.dob)].filter(Boolean).join(' · ') || undefined}
                onPress={goProfile}
              />
            ) : (
              <Row icon="🐶" title="프로필 등록" onPress={goProfile} />
            )}
          </Card>
        </View>
      )}

      {notify && (
        <View>
          <SectionHeading>알림</SectionHeading>
          <Card style={styles.card}>
            <Row
              icon="🔔"
              title="알림 받기"
              sub="접종(7일 전·당일)과 예방약(전날·당일) 예정일을 설정한 시각에 알려드려요."
              chevron={false}
              trailing={
                <Switch
                  value={notify.enabled}
                  onValueChange={toggle}
                  trackColor={{ false: colors.surface2, true: colors.brand }}
                  accessibilityLabel="알림 받기"
                />
              }
            />
            {notify.enabled && (
              <>
                <Divider inset />
                <Row
                  icon="⏰"
                  title="알림 시각"
                  chevron={false}
                  trailing={
                    <DateTimePicker
                      value={timeValue}
                      mode="time"
                      display="compact"
                      locale="ko-KR"
                      onChange={pickTime}
                      accessibilityLabel="알림 시각"
                    />
                  }
                />
              </>
            )}
          </Card>
        </View>
      )}

      <View>
        <SectionHeading>정보</SectionHeading>
        <Card style={styles.card}>
          <Row icon="💬" title="고객 지원" onPress={() => Linking.openURL(`${SITE_URL}/support`)} />
          <Divider inset />
          <Row icon="ℹ️" title="개인정보 처리방침" onPress={() => Linking.openURL(`${SITE_URL}/privacy`)} />
          <Divider inset />
          <Row icon="📄" title="이용약관" onPress={() => Linking.openURL(`${SITE_URL}/terms`)} />
        </Card>
      </View>

      <Text style={styles.version}>{`댕댕케어 v${Constants.expoConfig?.version ?? ''}`}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space[5], paddingVertical: space[6], gap: space[6] },
  card: { overflow: 'hidden' },
  version: { fontFamily, fontSize: typography.caption.size, color: colors.text3, textAlign: 'center' },
});
