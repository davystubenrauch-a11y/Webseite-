import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useCreateGroup } from '@/features/groups/api';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { spacing } from '@/theme/typography';

export default function NewGroup() {
  const { t } = useI18n();
  const { selectGroup } = useCurrentGroup();
  const create = useCreateGroup();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim()) return;
    create.mutate(name, {
      onSuccess: (group) => {
        selectGroup(group.id);
        router.replace({ pathname: '/groups/[id]', params: { id: group.id, invite: '1' } });
      },
      onError: (e) => setError(t(errorKey(e))),
    });
  };

  return (
    <Screen keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg, gap: spacing.lg }}>
      <TextField
        label={t('groups.nameLabel')}
        placeholder={t('groups.namePlaceholder')}
        value={name}
        onChangeText={setName}
        maxLength={40}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={submit}
        error={error}
      />
      <Button label={t('groups.create')} icon="add" onPress={submit} loading={create.isPending} disabled={!name.trim()} />
      <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
