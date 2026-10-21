import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/nunito';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/OfflineBanner';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/StateViews';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { OnboardingProvider, useOnboarding } from '@/features/auth/OnboardingProvider';
import { isConfigured } from '@/lib/env';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { setupFocusManager, setupOnlineManager } from '@/lib/network';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/typography';

void SplashScreen.preventAutoHideAsync();
setupOnlineManager();
setupFocusManager();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <I18nProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <OnboardingProvider>
                  <ToastProvider>
                    <RootNavigator ready={fontsLoaded || !!fontError} />
                  </ToastProvider>
                </OnboardingProvider>
              </AuthProvider>
            </QueryClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator({ ready }: { ready: boolean }) {
  const { session, initializing } = useAuth();
  const onboarding = useOnboarding();
  const { colors, scheme } = useTheme();
  const { t } = useI18n();
  const loaded = ready && !initializing && onboarding.state !== 'loading';

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync();
  }, [loaded]);

  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [colors, scheme]);

  if (!loaded) return null;

  if (!isConfigured) {
    return (
      <Screen>
        <EmptyState icon="construct-outline" title={t('common.appName')} text={t('errors.notConfigured')} />
      </Screen>
    );
  }

  const signedIn = !!session;
  const onboarded = onboarding.state === 'done';

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Protected guard={!onboarded && !signedIn}>
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Protected guard={onboarded && !signedIn}>
          <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="sign-up" options={{ title: t('auth.signUp') }} />
          <Stack.Screen name="forgot-password" options={{ title: t('auth.resetTitle') }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="auth/callback" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="join/[code]" options={{ title: t('groups.joinFromLinkTitle'), presentation: 'modal' }} />
        <Stack.Screen name="legal/privacy" options={{ title: t('legal.privacyTitle') }} />
        <Stack.Screen name="legal/imprint" options={{ title: t('legal.imprintTitle') }} />
        <Stack.Screen name="+not-found" options={{ title: t('errors.notFound') }} />
      </Stack>
      <OfflineBanner />
    </NavigationThemeProvider>
  );
}
