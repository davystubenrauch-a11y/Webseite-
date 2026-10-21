import { Stack } from 'expo-router';

import { useI18n } from '@/lib/i18n';
import { fonts } from '@/theme/typography';

export const unstable_settings = { initialRouteName: 'sign-in' };

export default function AuthLayout() {
  const { t } = useI18n();
  return (
    <Stack screenOptions={{ headerShadowVisible: false, headerTitleStyle: { fontFamily: fonts.bold }, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ title: t('auth.signUp') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('auth.resetTitle') }} />
    </Stack>
  );
}
