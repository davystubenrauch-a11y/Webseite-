import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/StateViews';
import { useI18n } from '@/lib/i18n';
import { spacing } from '@/theme/typography';

export function NoGroup({ title }: { title?: string }) {
  const { t } = useI18n();
  return (
    <EmptyState
      icon="people-outline"
      title={title ?? t('groups.none')}
      text={t('groups.noneText')}
      action={
        <View style={styles.actions}>
          <Button label={t('groups.create')} icon="add" onPress={() => router.push('/groups/new')} />
          <Button label={t('groups.join')} icon="enter-outline" variant="secondary" onPress={() => router.push('/groups/join')} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({ actions: { gap: spacing.md } });
