import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/StateViews';
import { useI18n } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Screen edges={[]}>
      <EmptyState
        icon="help-circle-outline"
        title={t('errors.notFound')}
        action={<Button label={t('common.back')} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />}
      />
    </Screen>
  );
}
