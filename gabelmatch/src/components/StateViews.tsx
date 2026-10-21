import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

import { AppText } from './AppText';
import { Button } from './Button';

export function LoadingState({ label }: { label?: string }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={label ?? t('common.loading')}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText color="textMuted">{label ?? t('common.loading')}</AppText>
    </View>
  );
}

type EmptyProps = {
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  text?: string;
  action?: ReactNode;
};

export function EmptyState({ icon = 'restaurant-outline', title, text, action }: EmptyProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={40} color={colors.onPrimarySoft} />
      </View>
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      {text ? (
        <AppText color="textMuted" align="center">
          {text}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title={message ?? t('errors.generic')}
      action={onRetry ? <Button label={t('common.retry')} icon="refresh" onPress={onRetry} variant="secondary" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  iconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});
