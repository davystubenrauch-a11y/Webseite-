import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useToast } from '@/components/Toast';
import { useAuth, useUserId } from '@/features/auth/AuthProvider';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { enablePush, getPushPermission, openSystemSettings, removePushToken, type PushPermission } from '@/features/notifications/register';
import { useProfile, useUpdateProfile } from '@/features/settings/profile';
import { errorKey } from '@/lib/errors';
import { deviceLocale, useI18n, type LocalePreference } from '@/lib/i18n';
import { useTheme, type ThemePreference } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

export default function SettingsScreen() {
  const { t, preference: localePreference, setPreference: setLocalePreference } = useI18n();
  const { colors, preference: themePreference, setPreference: setThemePreference } = useTheme();
  const toast = useToast();
  const userId = useUserId();
  const { signOut } = useAuth();
  const { groups } = useCurrentGroup();
  const profile = useProfile(userId);
  const updateProfile = useUpdateProfile(userId);
  const [permission, setPermission] = useState<PushPermission>('undetermined');

  useEffect(() => {
    void getPushPermission().then(setPermission);
  }, []);

  const onError = (error: unknown) => toast(t(errorKey(error)), 'error');
  const pushOn = !!profile.data?.push_enabled && permission === 'granted';

  const togglePush = async (enabled: boolean) => {
    try {
      if (enabled) {
        const result = await enablePush(userId);
        setPermission(result);
        if (result === 'granted') updateProfile.mutate({ push_enabled: true }, { onError });
      } else {
        updateProfile.mutate({ push_enabled: false }, { onError });
        await removePushToken();
      }
    } catch (error) {
      onError(error);
    }
  };

  const changeLocale = (value: LocalePreference) => {
    setLocalePreference(value);
    updateProfile.mutate({ locale: value === 'system' ? deviceLocale() : value });
  };

  const confirmSignOut = () =>
    Alert.alert(t('settings.signOut'), t('settings.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.signOut'), style: 'destructive', onPress: () => void signOut() },
    ]);

  return (
    <Screen scroll>
      <AppText variant="title" style={{ paddingTop: spacing.sm }}>
        {t('settings.title')}
      </AppText>

      <Card>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.profile')}: ${profile.data?.display_name ?? ''}`}
          onPress={() => router.push('/settings/profile')}
          style={styles.profile}
        >
          <Avatar emoji={profile.data?.avatar_emoji ?? '🍽️'} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{profile.data?.display_name || t('settings.profileName')}</AppText>
            <AppText variant="caption" color="textMuted">
              {t('settings.profile')}
            </AppText>
          </View>
        </Pressable>
      </Card>

      <Section title={t('settings.groups')}>
        <ListRow icon="people-outline" title={t('groups.title')} value={String(groups.length)} onPress={() => router.push('/groups')} />
      </Section>

      <Section
        title={t('settings.notifications')}
        footer={permission === 'denied' ? t('settings.notificationsDenied') : undefined}
      >
        <View style={styles.switchRow}>
          <AppText variant="bodyStrong" style={{ flex: 1 }}>
            {t('settings.notificationsMatch')}
          </AppText>
          <Switch
            accessibilityLabel={t('settings.notificationsMatch')}
            value={pushOn}
            disabled={permission === 'unsupported' || permission === 'denied'}
            onValueChange={(value) => void togglePush(value)}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#FFFFFF"
          />
        </View>
        {permission === 'denied' ? <ListRow icon="open-outline" title={t('settings.openSystemSettings')} onPress={openSystemSettings} /> : null}
      </Section>

      <Section title={t('settings.language')}>
        <View style={styles.segment}>
          <SegmentedControl<LocalePreference>
            accessibilityLabel={t('settings.language')}
            value={localePreference}
            onChange={changeLocale}
            options={[
              { value: 'system', label: t('settings.languageSystem') },
              { value: 'de', label: 'Deutsch' },
              { value: 'en', label: 'English' },
            ]}
          />
        </View>
      </Section>

      <Section title={t('settings.appearance')}>
        <View style={styles.segment}>
          <SegmentedControl<ThemePreference>
            accessibilityLabel={t('settings.appearance')}
            value={themePreference}
            onChange={setThemePreference}
            options={[
              { value: 'system', label: t('settings.appearanceSystem') },
              { value: 'light', label: t('settings.appearanceLight') },
              { value: 'dark', label: t('settings.appearanceDark') },
            ]}
          />
        </View>
      </Section>

      <Section title={t('settings.legal')}>
        <ListRow icon="shield-checkmark-outline" title={t('settings.privacy')} onPress={() => router.push('/legal/privacy')} />
        <ListRow icon="document-text-outline" title={t('settings.imprint')} onPress={() => router.push('/legal/imprint')} />
      </Section>

      <Section title={t('settings.account')}>
        <ListRow icon="log-out-outline" title={t('settings.signOut')} onPress={confirmSignOut} />
        <ListRow icon="trash-outline" title={t('settings.deleteAccount')} destructive onPress={() => router.push('/settings/delete-account')} />
      </Section>

      <AppText variant="caption" color="textMuted" align="center">
        {t('settings.version', { version: Constants.expoConfig?.version ?? '1.0.0' })}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, minHeight: 56 },
  switchRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: spacing.md },
  segment: { paddingVertical: spacing.sm },
});
