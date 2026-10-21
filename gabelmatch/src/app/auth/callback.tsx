import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { EmptyState, LoadingState } from '@/components/StateViews';
import { useAuth } from '@/features/auth/AuthProvider';
import { exchangeCode } from '@/features/auth/oauth';
import { useI18n } from '@/lib/i18n';

/**
 * Ziel für OAuth-Redirects, Bestätigungs-E-Mails und Passwort-Links (gabelmatch://auth/callback).
 */
export default function AuthCallback() {
  const { t } = useI18n();
  const { markPasswordRecovery } = useAuth();
  const params = useLocalSearchParams<{ code?: string; type?: string; error_description?: string }>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (params.error_description || !params.code) {
        setFailed(true);
        return;
      }
      try {
        await exchangeCode(params.code);
        if (cancelled) return;
        if (params.type === 'recovery') markPasswordRecovery();
        router.replace('/');
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.code, params.type, params.error_description, markPasswordRecovery]);

  return (
    <Screen edges={['top', 'bottom']}>
      {failed ? (
        <EmptyState
          icon="link-outline"
          title={t('auth.callbackFailed')}
          action={<Button label={t('common.continue')} onPress={() => router.replace('/')} />}
        />
      ) : (
        <LoadingState label={t('auth.callbackWorking')} />
      )}
    </Screen>
  );
}
