import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { authRedirectUrl } from '@/features/auth/oauth';
import { isValidEmail } from '@/features/auth/validation';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/typography';

export default function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) return setError(t('errors.invalidEmail'));
    setError(null);
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authRedirectUrl('recovery'),
    });
    setLoading(false);
    // Aus Datenschutzgründen nicht verraten, ob ein Konto existiert – nur echte Fehler anzeigen
    if (resetError && errorKey(resetError) !== 'errors.generic') setError(t(errorKey(resetError)));
    else setSent(true);
  };

  return (
    <Screen scroll keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg }}>
      <AppText color="textMuted">{sent ? t('auth.resetSent') : t('auth.resetText')}</AppText>
      {!sent ? (
        <>
          <TextField
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            error={error}
            onSubmitEditing={submit}
          />
          <Button label={t('auth.resetSend')} onPress={submit} loading={loading} disabled={!email} />
        </>
      ) : null}
    </Screen>
  );
}
