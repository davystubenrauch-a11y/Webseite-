import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { RecipeImage } from '@/components/RecipeImage';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { GroupSwitcher } from '@/features/groups/GroupSwitcher';
import { NoGroup } from '@/features/groups/NoGroup';
import { useGroupMatches } from '@/features/matches/api';
import { useCatalog } from '@/features/recipes/api';
import { localizedRecipe } from '@/features/recipes/format';
import { errorKey } from '@/lib/errors';
import { useI18n, type AppLocale } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

function dayLabel(iso: string, locale: AppLocale, today: string, yesterday: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(now) - startOf(date)) / 86_400_000);
  if (diff === 0) return today;
  if (diff === 1) return yesterday;
  return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

export default function HistoryScreen() {
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const { group, isLoading: groupsLoading } = useCurrentGroup();
  const matches = useGroupMatches(group?.id);
  const catalog = useCatalog();

  if (groupsLoading) return <Screen><LoadingState /></Screen>;
  if (!group) return <Screen><NoGroup /></Screen>;

  return (
    <Screen padded={false}>
      <FlatList
        data={matches.data ?? []}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        refreshing={matches.isRefetching}
        onRefresh={() => void matches.refetch()}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.header}>
              <AppText variant="title">{t('history.title')}</AppText>
              <GroupSwitcher />
            </View>
            <AppText color="textMuted">{t('history.subtitle')}</AppText>
          </View>
        }
        ListEmptyComponent={
          matches.isLoading || catalog.isLoading ? (
            <LoadingState />
          ) : matches.error ? (
            <ErrorState message={t(errorKey(matches.error))} onRetry={() => void matches.refetch()} />
          ) : (
            <EmptyState icon="heart-outline" title={t('history.emptyTitle')} text={t('history.emptyText')} />
          )
        }
        ListFooterComponent={
          matches.data?.length ? (
            <AppText variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.lg }}>
              {t('history.recentHint')}
            </AppText>
          ) : undefined
        }
        renderItem={({ item }) => {
          const recipe = catalog.data?.recipesById.get(item.recipe_id);
          if (!recipe) return null;
          const title = localizedRecipe(recipe, locale).title;
          const when = dayLabel(item.created_at, locale, t('history.today'), t('history.yesterday'));
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${when}: ${title}`}
              onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
              style={({ pressed }) => [styles.row, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
            >
              <RecipeImage imageUrl={recipe.image_url} category={recipe.category} style={styles.thumb} />
              <View style={styles.text}>
                <AppText variant="caption" color="primary">
                  {when}
                </AppText>
                <AppText variant="bodyStrong" numberOfLines={2}>
                  {title}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {t('common.minutes', { count: recipe.total_minutes })} · {t(`categories.${recipe.category}`)}
                </AppText>
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md, flexGrow: 1 },
  headerBlock: { gap: spacing.sm, marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden', alignItems: 'center' },
  thumb: { width: 96, height: 96 },
  text: { flex: 1, gap: 2, paddingRight: spacing.md, paddingVertical: spacing.sm },
});
