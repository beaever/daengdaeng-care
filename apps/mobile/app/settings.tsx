import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, space, fontFamily, typography } from '../theme';
import { Card, Row, Divider, SectionHeading } from '../components/ui';
import { pet } from '../lib/sampleData';

// SCR-016 · 설정 — 프로필 · 앱 설정 · 약관. (헤더/뒤로는 루트 Stack 제공)
export default function SettingsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View>
        <SectionHeading>반려견 프로필</SectionHeading>
        <Card style={styles.card}>
          <Row icon="🐶" title={pet.name} sub={`${pet.breed} · ${pet.age}`} chevron={false} />
        </Card>
      </View>

      <View>
        <SectionHeading>앱 설정</SectionHeading>
        <Card style={styles.card}>
          <Row icon="🔔" title="알림" />
          <Divider inset />
          <Row
            icon="⚖️"
            title="단위"
            trailing={<Text style={styles.trailing}>kg ›</Text>}
          />
        </Card>
      </View>

      <View>
        <SectionHeading>약관</SectionHeading>
        <Card style={styles.card}>
          <Row icon="ℹ️" title="개인정보 처리방침" />
          <Divider inset />
          <Row icon="📄" title="이용약관" />
        </Card>
      </View>

      <Text style={styles.version}>댕댕케어 v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space[5], paddingVertical: space[6], gap: space[6] },
  card: { overflow: 'hidden' },
  trailing: { fontFamily, fontSize: typography.sub.size, color: colors.text2 },
  version: { fontFamily, fontSize: typography.caption.size, color: colors.text3, textAlign: 'center' },
});
