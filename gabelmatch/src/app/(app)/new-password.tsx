import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/features/auth/AuthProvider';
import { isValidPassword } from '@/features/auth/validation';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/typography';

export default function NewPassword() {
  const { t } = useI18n();
  const toast = useToast();
  const { clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!isValidPassword(password)) return setError(t('errors.weakPassword'));
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) return setError(t(errorKey(updateError)));
    clearPasswordRecovery();
    toast(t('auth.newPasswordSaved'), 'success');
    router.back();
  };

  return (
    <Screen keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg, gap: spacing.lg }}>
      <TextField
        label={t('auth.newPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        hint={t('errors.weakPassword')}
        error={error}
        autoFocus
      />
      <Button label={t('common.save')} onPress={() => void save()} loading={loading} disabled={!password} />
      <Button
        label={t('common.cancel')}
        variant="ghost"
        onPress={() => {
          clearPasswordRecovery();
          router.back();
        }}
      />
    </Screen>
  );
}
