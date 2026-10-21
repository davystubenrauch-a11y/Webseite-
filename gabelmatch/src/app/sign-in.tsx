import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { SocialButtons } from '@/features/auth/SocialButtons';
import { isValidEmail } from '@/features/auth/validation';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

export default function SignIn() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!isValidEmail(email)) return setError(t('errors.invalidEmail'));
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError) setError(t(errorKey(signInError)));
  };

  return (
    <Screen scroll keyboard edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} accessibilityLabel={t('common.appName')} />
        <AppText variant="title" align="center">
          {t('auth.welcomeTitle')}
        </AppText>
        <AppText color="textMuted" align="center">
          {t('auth.welcomeText')}
        </AppText>
      </View>

      <SocialButtons />

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <AppText variant="caption" color="textMuted">
          {t('auth.or')}
        </AppText>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <TextField
        label={t('auth.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
        error={error}
      />
      <Button label={t('auth.signIn')} onPress={submit} loading={loading} disabled={!email || !password} />
      <Button label={t('auth.forgotPassword')} variant="ghost" compact onPress={() => router.push('/forgot-password')} />
      <Button label={t('auth.noAccount')} variant="secondary" onPress={() => router.push('/sign-up')} />

      <View style={styles.legal}>
        <Link href="/legal/privacy" style={{ color: colors.textMuted }}>
          <AppText variant="caption" color="textMuted">
            {t('auth.privacyLink')}
          </AppText>
        </Link>
        <AppText variant="caption" color="textMuted">
          ·
        </AppText>
        <Link href="/legal/imprint">
          <AppText variant="caption" color="textMuted">
            {t('auth.imprintLink')}
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.md },
  logo: { width: 84, height: 84, borderRadius: 22, marginBottom: spacing.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  legal: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
});
