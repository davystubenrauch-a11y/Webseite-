import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/StateViews';
import { TextField } from '@/components/TextField';
import { authRedirectUrl } from '@/features/auth/oauth';
import { isValidEmail, isValidPassword, normalizeDisplayName } from '@/features/auth/validation';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/typography';

export default function SignUp() {
  const { t, locale } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async () => {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = t('errors.invalidEmail');
    if (!isValidPassword(password)) next.password = t('errors.weakPassword');
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: authRedirectUrl('signup'),
        data: { display_name: normalizeDisplayName(name), locale },
      },
    });
    setLoading(false);
    if (error) return setErrors({ form: t(errorKey(error)) });
    // Ohne Session ist eine E-Mail-Bestätigung nötig; mit Session leitet das Root-Layout automatisch weiter.
    if (!data.session) setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="mail-unread-outline" title={t('auth.checkInboxTitle')} text={t('auth.checkInboxText', { email: sentTo })} />
      </Screen>
    );
  }

  return (
    <Screen scroll keyboard edges={['bottom']} contentStyle={styles.content}>
      <TextField
        label={t('auth.displayName')}
        hint={t('auth.displayNameHint')}
        value={name}
        onChangeText={setName}
        autoComplete="given-name"
        textContentType="givenName"
        maxLength={40}
      />
      <TextField
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={errors.email}
      />
      <TextField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        hint={t('errors.weakPassword')}
        error={errors.password}
      />
      {errors.form ? (
        <AppText color="danger" accessibilityLiveRegion="polite">
          {errors.form}
        </AppText>
      ) : null}
      <Button label={t('auth.signUp')} onPress={submit} loading={loading} disabled={!email || !password} />
      <View style={styles.legal}>
        <AppText variant="caption" color="textMuted" align="center">
          {t('auth.legalHint')}{' '}
        </AppText>
        <Link href="/legal/privacy">
          <AppText variant="caption" color="primary">
            {t('auth.privacyLink')}
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg },
  legal: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});
