import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/StateViews';
import { useAuth } from '@/features/auth/AuthProvider';
import { pendingInvite } from '@/features/auth/pendingInvite';
import { normalizeInviteCode } from '@/features/groups/invite';
import { useI18n } from '@/lib/i18n';

/** Einladungslink gabelmatch://join/ABC123 bzw. https://<domain>/join/ABC123 */
export default function JoinFromLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { session } = useAuth();
  const { t } = useI18n();
  const normalized = normalizeInviteCode(code ?? '');

  useEffect(() => {
    if (!session && normalized) void pendingInvite.set(normalized);
  }, [session, normalized]);

  if (session) return <Redirect href={{ pathname: '/groups/join', params: { code: normalized } }} />;

  return (
    <Screen edges={['bottom']}>
      <EmptyState
        icon="mail-open-outline"
        title={t('groups.joinFromLinkTitle')}
        text={t('groups.joinFromLinkSignIn')}
        action={<Button label={t('auth.signIn')} onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
