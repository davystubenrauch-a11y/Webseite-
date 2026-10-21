import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/typography';

import { AppText } from './AppText';
import { Card } from './Card';

export function Section({ title, children, footer }: { title?: string; children: ReactNode; footer?: string }) {
  return (
    <View style={styles.section}>
      {title ? (
        <AppText variant="label" color="textMuted" style={styles.title}>
          {title.toUpperCase()}
        </AppText>
      ) : null}
      <Card style={styles.card}>{children}</Card>
      {footer ? (
        <AppText variant="caption" color="textMuted" style={styles.title}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  title: { paddingHorizontal: spacing.sm, letterSpacing: 0.6 },
  card: { paddingVertical: spacing.xs },
});
