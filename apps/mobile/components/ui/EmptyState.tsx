import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, fontFamily, typography } from '../../theme';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.empty}>
      {icon != null && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {description != null && <Text style={styles.desc}>{description}</Text>}
      {action != null && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: space[6], gap: 8 },
  icon: { fontSize: 44, marginBottom: 4 },
  title: { fontFamily, fontSize: typography.title.size, fontWeight: '800', color: colors.text },
  desc: {
    fontFamily,
    fontSize: typography.sub.size,
    color: colors.text2,
    textAlign: 'center',
  },
  action: { marginTop: 12 },
});
