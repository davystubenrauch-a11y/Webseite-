import { router, Stack, usePathname } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useToast } from '@/components/Toast';
import { useAuth, useUserId } from '@/features/auth/AuthProvider';
import { pendingInvite } from '@/features/auth/pendingInvite';
import { useJoinGroup } from '@/features/groups/api';
import { CurrentGroupProvider, useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { useRealtimeSync } from '@/features/matches/useRealtimeSync';
import { refreshPushToken } from '@/features/notifications/register';
import { useNotificationTap } from '@/features/notifications/useNotificationTap';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';
import { fonts } from '@/theme/typography';
import type { MatchRow } from '@/types/database';

export default function AppLayout() {
  const userId = useUserId();
  const { t } = useI18n();
  return (
    <CurrentGroupProvider userId={userId}>
      <AppEffects userId={userId} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="groups/index" options={{ title: t('groups.title') }} />
        <Stack.Screen name="groups/new" options={{ title: t('groups.create'), presentation: 'modal' }} />
        <Stack.Screen name="groups/join" options={{ title: t('groups.join'), presentation: 'modal' }} />
        <Stack.Screen name="groups/[id]" options={{ title: '' }} />
        <Stack.Screen name="filters" options={{ title: t('filters.title'), presentation: 'modal' }} />
        <Stack.Screen name="match/[id]" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="recipe/[id]" options={{ title: '', headerTransparent: Platform.OS === 'ios' }} />
        <Stack.Screen name="settings/profile" options={{ title: t('settings.profile') }} />
        <Stack.Screen name="settings/delete-account" options={{ title: t('deleteAccount.title') }} />
        <Stack.Screen name="new-password" options={{ title: t('auth.newPasswordTitle'), presentation: 'modal' }} />
      </Stack>
    </CurrentGroupProvider>
  );
}

/** Globale Nebenwirkungen im angemeldeten Bereich. */
function AppEffects({ userId }: { userId: string }) {
  const { t } = useI18n();
  const toast = useToast();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  const { passwordRecovery } = useAuth();
  const { selectGroup } = useCurrentGroup();
  const join = useJoinGroup();
  const shownMatches = useRef(new Set<string>());

  const showMatch = useCallback((matchId: string) => {
    if (shownMatches.current.has(matchId)) return;
    shownMatches.current.add(matchId);
    if (pathnameRef.current === `/match/${matchId}`) return;
    haptics.success();
    router.push({ pathname: '/match/[id]', params: { id: matchId } });
  }, []);

  // 1) Echtzeit: neues Match → Match-Screen bei allen gleichzeitig
  useRealtimeSync(
    userId,
    useCallback((match: MatchRow) => showMatch(match.id), [showMatch]),
  );

  // 2) Tipp auf Push-Benachrichtigung
  const tapped = useNotificationTap();
  useEffect(() => {
    if (tapped?.type === 'match' && typeof tapped.matchId === 'string') showMatch(tapped.matchId);
  }, [tapped, showMatch]);

  // 3) Push-Token aktuell halten
  useEffect(() => {
    void refreshPushToken(userId).catch(() => undefined);
  }, [userId]);

  // 4) Einladungslink, der vor dem Login geöffnet wurde
  useEffect(() => {
    void pendingInvite.take().then((code) => {
      if (!code) return;
      join.mutate(code, {
        onSuccess: (group) => {
          selectGroup(group.id);
          toast(t('groups.joined', { name: group.name }), 'success');
        },
        onError: (error) => toast(t(errorKey(error)), 'error'),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 5) Passwort-Reset-Link geöffnet → neues Passwort festlegen
  useEffect(() => {
    if (passwordRecovery) router.push('/new-password');
  }, [passwordRecovery]);

  return null;
}
