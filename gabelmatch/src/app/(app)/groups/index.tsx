import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { NoGroup } from '@/features/groups/NoGroup';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

export default function GroupsScreen() {
  const { t, tp } = useI18n();
  const { colors } = useTheme();
  const { groups, group: current, selectGroup, isLoading, error, refetch } = useCurrentGroup();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (groups.length === 0) return <Screen edges={['bottom']}><NoGroup /></Screen>;

  return (
    <Screen scroll edges={['bottom']} contentStyle={{ paddingTop: spacing.lg }}>
      {groups.map((group) => {
        const selected = group.id === current?.id;
        return (
          <Card key={group.id} style={[styles.card, selected && { borderColor: colors.primary, borderWidth: 2 }]}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${group.name}, ${tp('groups.memberCount', group.members.length)}`}
              onPress={() => {
                selectGroup(group.id);
                router.back();
              }}
              style={styles.row}
            >
              <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={24} color={colors.primary} />
              <View style={styles.text}>
                <AppText variant="bodyStrong">{group.name}</AppText>
                <AppText variant="caption" color="textMuted">
                  {tp('groups.memberCount', group.members.length)}
                </AppText>
              </View>
            </Pressable>
            <Button
              compact
              variant="secondary"
              icon="settings-outline"
              label={t('groups.members')}
              onPress={() => router.push({ pathname: '/groups/[id]', params: { id: group.id } })}
            />
          </Card>
        );
      })}
      <Button label={t('groups.create')} icon="add" onPress={() => router.push('/groups/new')} />
      <Button label={t('groups.join')} icon="enter-outline" variant="secondary" onPress={() => router.push('/groups/join')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  text: { flex: 1 },
});
