import * as Clipboard from 'expo-clipboard';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Share, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { useLeaveGroup, useRegenerateCode, useRenameGroup, useSetActive } from '@/features/groups/api';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { inviteLink } from '@/features/groups/invite';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, spacing } from '@/theme/typography';

export default function GroupDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, tp } = useI18n();
  const { colors } = useTheme();
  const toast = useToast();
  const userId = useUserId();
  const { groups, isLoading, error, refetch } = useCurrentGroup();
  const group = groups.find((g) => g.id === id);
  const me = group?.members.find((m) => m.user_id === userId);
  const isOwner = me?.role === 'owner';

  const setActive = useSetActive(userId);
  const leave = useLeaveGroup();
  const regenerate = useRegenerateCode();
  const rename = useRenameGroup();
  const [name, setName] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!group || !me) return <ErrorState message={t('errors.notFound')} onRetry={() => router.back()} />;

  const link = inviteLink(group.invite_code);
  const onError = (e: unknown) => toast(t(errorKey(e)), 'error');

  const share = () =>
    void Share.share({ message: t('groups.shareMessage', { name: group.name, link, code: group.invite_code }) }).catch(() => undefined);

  const copy = async () => {
    await Clipboard.setStringAsync(group.invite_code);
    haptics.light();
    toast(t('groups.codeCopied'), 'success');
  };

  const confirmRegenerate = () =>
    Alert.alert(t('groups.newCode'), t('groups.newCodeConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.continue'), onPress: () => regenerate.mutate(group.id, { onError }) },
    ]);

  const confirmLeave = () =>
    Alert.alert(t('groups.leaveConfirmTitle'), t('groups.leaveConfirmText', { name: group.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('groups.leave'),
        style: 'destructive',
        onPress: () =>
          leave.mutate(group.id, {
            onSuccess: () => {
              toast(t('groups.left'));
              router.dismissTo('/');
            },
            onError,
          }),
      },
    ]);

  return (
    <Screen scroll keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: group.name }} />

      <Card style={styles.invite}>
        <AppText variant="heading">{t('groups.inviteTitle')}</AppText>
        <AppText color="textMuted">{t('groups.inviteText')}</AppText>
        <View style={[styles.code, { backgroundColor: colors.primarySoft }]} accessible accessibilityLabel={`${t('groups.codeLabel')}: ${group.invite_code.split('').join(' ')}`}>
          <AppText style={[styles.codeText, { color: colors.onPrimarySoft }]} selectable>
            {group.invite_code}
          </AppText>
        </View>
        <View style={styles.row}>
          <Button compact variant="secondary" icon="copy-outline" label={t('groups.copyCode')} onPress={copy} style={styles.flex} />
          <Button compact icon="share-social-outline" label={t('groups.shareLink')} onPress={share} style={styles.flex} />
        </View>
        {isOwner ? (
          <Button compact variant="ghost" icon="refresh" label={t('groups.newCode')} onPress={confirmRegenerate} loading={regenerate.isPending} />
        ) : null}
      </Card>

      <Section title={t('groups.eatingToday')} footer={t('groups.eatingTodayHint')}>
        <View style={styles.switchRow}>
          <AppText variant="bodyStrong" style={styles.flex}>
            {t('groups.eatingToday')}
          </AppText>
          <Switch
            accessibilityLabel={t('groups.eatingToday')}
            value={me.is_active}
            onValueChange={(active) => setActive.mutate({ groupId: group.id, active }, { onError })}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Section>

      <Section title={`${t('groups.members')} · ${tp('groups.memberCount', group.members.length)}`}>
        {group.members.map((member) => {
          const name = member.profile?.display_name || '?';
          const labels = [
            member.user_id === userId ? t('common.you') : null,
            member.role === 'owner' ? t('groups.owner') : null,
            member.is_active ? null : t('groups.paused'),
          ].filter(Boolean);
          return (
            <View key={member.user_id} style={styles.member} accessible accessibilityLabel={[name, ...labels].join(', ')}>
              <Avatar emoji={member.profile?.avatar_emoji ?? '🍽️'} muted={!member.is_active} />
              <View style={styles.flex}>
                <AppText variant="bodyStrong">{name}</AppText>
                {labels.length ? (
                  <AppText variant="caption" color="textMuted">
                    {labels.join(' · ')}
                  </AppText>
                ) : null}
              </View>
            </View>
          );
        })}
      </Section>

      {isOwner ? (
        <Section title={t('groups.rename')}>
          <View style={styles.renameRow}>
            <View style={styles.flex}>
              <TextField label={t('groups.nameLabel')} value={name ?? group.name} onChangeText={setName} maxLength={40} />
            </View>
            <Button
              compact
              label={t('common.save')}
              disabled={!name?.trim() || name.trim() === group.name}
              loading={rename.isPending}
              onPress={() =>
                rename.mutate(
                  { groupId: group.id, name: name ?? group.name },
                  { onSuccess: () => toast(t('common.saved'), 'success'), onError },
                )
              }
            />
          </View>
        </Section>
      ) : null}

      <Button label={t('groups.leave')} icon="exit-outline" variant="danger" onPress={confirmLeave} loading={leave.isPending} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  invite: { gap: spacing.md },
  code: { borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center' },
  codeText: { fontFamily: fonts.extrabold, fontSize: 34, letterSpacing: 8, lineHeight: 42 },
  row: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: spacing.md },
  member: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 56 },
  renameRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, paddingVertical: spacing.sm },
});
