import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { AppError, errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

import { isNativeAppleAvailable, signInWithApple, signInWithOAuthBrowser } from './oauth';

export function SocialButtons() {
  const { t } = useI18n();
  const { scheme } = useTheme();
  const toast = useToast();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [busy, setBusy] = useState<'apple' | 'google' | null>(null);

  useEffect(() => {
    void isNativeAppleAvailable().then(setAppleAvailable);
  }, []);

  const run = async (provider: 'apple' | 'google') => {
    setBusy(provider);
    try {
      if (provider === 'apple') await signInWithApple();
      else await signInWithOAuthBrowser('google');
    } catch (error) {
      if (!(error instanceof AppError && error.key === 'errors.oauthCancelled')) toast(t(errorKey(error)), 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.column}>
      {appleAvailable ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={
            scheme === 'dark'
              ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
              : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={radius.pill}
          style={styles.apple}
          onPress={() => void run('apple')}
        />
      ) : null}
      <Button
        label={t('auth.signInWithGoogle')}
        icon="logo-google"
        variant="secondary"
        loading={busy === 'google'}
        disabled={busy !== null}
        onPress={() => void run('google')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: { gap: spacing.md },
  apple: { height: 52, width: '100%' },
});
