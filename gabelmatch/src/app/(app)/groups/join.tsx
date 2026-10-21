import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useJoinGroup } from '@/features/groups/api';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { normalizeInviteCode } from '@/features/groups/invite';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { fonts, spacing } from '@/theme/typography';

export default function JoinGroup() {
  const { t } = useI18n();
  const toast = useToast();
  const params = useLocalSearchParams<{ code?: string }>();
  const { selectGroup } = useCurrentGroup();
  const join = useJoinGroup();
  const [code, setCode] = useState(params.code ? normalizeInviteCode(params.code) : '');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const normalized = normalizeInviteCode(code);
    if (normalized.length !== 6) return setError(t('errors.invalidCode'));
    join.mutate(normalized, {
      onSuccess: (group) => {
        selectGroup(group.id);
        toast(t('groups.joined', { name: group.name }), 'success');
        router.dismissTo('/');
      },
      onError: (e) => setError(t(errorKey(e))),
    });
  };

  return (
    <Screen keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg, gap: spacing.lg }}>
      <TextField
        label={t('groups.codeLabel')}
        placeholder={t('groups.codePlaceholder')}
        value={code}
        onChangeText={(value) => {
          setError(null);
          setCode(value.length > 8 ? normalizeInviteCode(value) : value.toUpperCase());
        }}
        autoCapitalize="characters"
        autoCorrect={false}
        autoFocus
        maxLength={40}
        returnKeyType="join"
        onSubmitEditing={submit}
        error={error}
        style={{ fontFamily: fonts.bold, fontSize: 24, letterSpacing: 6, textAlign: 'center' }}
      />
      <Button label={t('groups.joinButton')} icon="enter-outline" onPress={submit} loading={join.isPending} disabled={!code.trim()} />
    </Screen>
  );
}
