import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { normalizeDisplayName } from '@/features/auth/validation';
import { AVATARS, useProfile, useUpdateProfile } from '@/features/settings/profile';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

export default function ProfileScreen() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const toast = useToast();
  const userId = useUserId();
  const profile = useProfile(userId);
  const update = useUpdateProfile(userId);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🍽️');

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.display_name);
      setAvatar(profile.data.avatar_emoji);
    }
  }, [profile.data]);

  if (profile.isLoading) return <LoadingState />;
  if (profile.error) return <ErrorState message={t(errorKey(profile.error))} onRetry={() => void profile.refetch()} />;

  const save = () =>
    update.mutate(
      { display_name: normalizeDisplayName(name), avatar_emoji: avatar },
      {
        onSuccess: () => {
          toast(t('common.saved'), 'success');
          router.back();
        },
        onError: (error) => toast(t(errorKey(error)), 'error'),
      },
    );

  return (
    <Screen scroll keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg }}>
      <TextField label={t('settings.profileName')} hint={t('auth.displayNameHint')} value={name} onChangeText={setName} maxLength={40} />
      <AppText variant="label" color="textMuted">
        {t('settings.avatar')}
      </AppText>
      <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel={t('settings.avatar')}>
        {AVATARS.map((emoji) => {
          const selected = emoji === avatar;
          return (
            <Pressable
              key={emoji}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={emoji}
              onPress={() => setAvatar(emoji)}
              style={[
                styles.emoji,
                { backgroundColor: selected ? colors.primarySoft : colors.surface, borderColor: selected ? colors.primary : colors.border },
              ]}
            >
              <AppText style={styles.emojiText}>{emoji}</AppText>
            </Pressable>
          );
        })}
      </View>
      <Button label={t('common.save')} onPress={save} loading={update.isPending} disabled={!normalizeDisplayName(name)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emoji: { width: 56, height: 56, borderRadius: radius.md, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 28, lineHeight: 36 },
});
