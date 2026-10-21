import { router } from 'expo-router';
import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { RecipeImage } from '@/components/RecipeImage';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { useSetActive } from '@/features/groups/api';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { GroupSwitcher } from '@/features/groups/GroupSwitcher';
import { NoGroup } from '@/features/groups/NoGroup';
import { lastMatchedMap, useGroupMatches } from '@/features/matches/api';
import { PushPrompt } from '@/features/notifications/PushPrompt';
import { usePantry } from '@/features/pantry/api';
import { useCatalog } from '@/features/recipes/api';
import { localizedRecipe } from '@/features/recipes/format';
import { NO_FILTERS } from '@/features/recipes/ranking';
import type { Recipe } from '@/features/recipes/types';
import { sessionFilters, useSessionState, useSessionSwipes, useStartSession, useSwipe } from '@/features/swipe/api';
import { SwipeDeck, type SwipeDeckHandle } from '@/features/swipe/SwipeDeck';
import { useDeck } from '@/features/swipe/useDeck';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

export default function SwipeScreen() {
  const { t } = useI18n();
  const userId = useUserId();
  const { group, me, activeMembers, isLoading: groupsLoading, error: groupsError, refetch: refetchGroups } = useCurrentGroup();
  const catalog = useCatalog();
  const sessionState = useSessionState(group?.id);
  const session = sessionState.data?.active ?? null;
  const swipes = useSessionSwipes(session?.id);
  const pantry = usePantry(group?.id);
  const matches = useGroupMatches(group?.id);
  const lastMatched = useMemo(() => lastMatchedMap(matches.data), [matches.data]);
  const filters = sessionFilters(session);

  const { deck, total, done, progressByMember, coverage } = useDeck({
    catalog: catalog.data,
    session,
    filters,
    swipes: swipes.data,
    pantry: pantry.data,
    lastMatched,
    userId,
    activeMembers,
  });

  const toast = useToast();
  const swipe = useSwipe(userId);
  const start = useStartSession(group?.id);
  const setActive = useSetActive(userId);
  const deckRef = useRef<SwipeDeckHandle>(null);

  const onSwipe = (recipe: Recipe, liked: boolean) => {
    if (!session) return;
    swipe.mutate({ session, recipeId: recipe.id, liked }, { onError: (error) => toast(t(errorKey(error)), 'error') });
  };
  const openRecipe = (recipe: Recipe) => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } });
  const startRound = () =>
    start.mutate(session ? filters : NO_FILTERS, { onError: (error) => toast(t(errorKey(error)), 'error') });

  const header = (
    <View style={styles.header}>
      <GroupSwitcher />
      {session ? (
        <IconButton icon="options-outline" label={t('a11y.filtersButton')} onPress={() => router.push('/filters')} />
      ) : null}
    </View>
  );

  if (groupsLoading) return <Screen><LoadingState /></Screen>;
  if (groupsError) return <Screen><ErrorState onRetry={refetchGroups} /></Screen>;
  if (!group) return <Screen><NoGroup title={t('swipe.noGroupTitle')} /></Screen>;

  const loading = catalog.isLoading || sessionState.isLoading || (session && swipes.isLoading);
  const error = catalog.error ?? sessionState.error ?? swipes.error;

  let body: React.ReactNode;
  if (loading) body = <LoadingState />;
  else if (error)
    body = (
      <ErrorState
        message={t(errorKey(error))}
        onRetry={() => {
          void catalog.refetch();
          void sessionState.refetch();
          void swipes.refetch();
        }}
      />
    );
  else if (!session && sessionState.data?.lastMatch && catalog.data) {
    const recipe = catalog.data.recipesById.get(sessionState.data.lastMatch.recipe_id);
    body = recipe ? <LastMatch recipe={recipe} onStart={startRound} starting={start.isPending} /> : null;
  } else if (!session) {
    body = (
      <EmptyState
        icon="flame-outline"
        title={t('swipe.startTitle')}
        text={t('swipe.startText')}
        action={<Button label={t('swipe.startButton')} icon="play" onPress={startRound} loading={start.isPending} />}
      />
    );
  } else if (total === 0) {
    body = (
      <EmptyState
        icon="funnel-outline"
        title={t('swipe.emptyFilterTitle')}
        text={t('swipe.emptyFilterText')}
        action={<Button label={t('swipe.filters')} icon="options-outline" onPress={() => router.push('/filters')} />}
      />
    );
  } else if (deck.length === 0) {
    body = (
      <EmptyState
        icon="hourglass-outline"
        title={t('swipe.emptyTitle')}
        text={t('swipe.emptyText')}
        action={
          <View style={{ gap: spacing.md }}>
            <Button label={t('swipe.filters')} icon="options-outline" variant="secondary" onPress={() => router.push('/filters')} />
            <Button label={t('swipe.restart')} icon="refresh" onPress={startRound} loading={start.isPending} />
          </View>
        }
      />
    );
  } else {
    body = (
      <>
        <View style={styles.deck}>
          <SwipeDeck ref={deckRef} recipes={deck} coverage={coverage} onSwipe={onSwipe} onOpen={openRecipe} />
        </View>
        <View style={styles.actions}>
          <ActionButton kind="nope" onPress={() => deckRef.current?.swipe(false)} />
          <AppText variant="caption" color="textMuted" style={styles.progress}>
            {t('swipe.progress', { done, total })}
          </AppText>
          <ActionButton kind="like" onPress={() => deckRef.current?.swipe(true)} />
        </View>
      </>
    );
  }

  return (
    <Screen>
      {header}
      <PushPrompt userId={userId} />
      {me && !me.is_active ? (
        <Card style={styles.paused}>
          <AppText variant="label" style={{ flex: 1 }}>
            {t('groups.eatingTodayHint')}
          </AppText>
          <Button compact label={t('groups.eatingToday')} onPress={() => setActive.mutate({ groupId: group.id, active: true })} />
        </Card>
      ) : null}
      {session ? <MemberProgress members={activeMembers} progress={progressByMember} total={total} /> : null}
      <View style={styles.body}>{body}</View>
    </Screen>
  );
}

function ActionButton({ kind, onPress }: { kind: 'like' | 'nope'; onPress: () => void }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const color = kind === 'like' ? colors.like : colors.nope;
  return (
    <IconButton
      icon={kind === 'like' ? 'heart' : 'close'}
      label={kind === 'like' ? t('a11y.likeButton') : t('a11y.nopeButton')}
      size={32}
      color={color}
      background={colors.surface}
      onPress={onPress}
      style={[styles.actionButton, { borderColor: color, shadowColor: colors.shadow }]}
    />
  );
}

function MemberProgress({ members, progress, total }: { members: ReturnType<typeof useCurrentGroup>['activeMembers']; progress: Map<string, number>; total: number }) {
  const { t } = useI18n();
  const names = members.map((m) => m.profile?.display_name || '?').join(', ');
  return (
    <View style={styles.members} accessible accessibilityLabel={t('swipe.waitingFor', { names })}>
      {members.map((member) => (
        <View key={member.user_id} style={styles.member}>
          <Avatar emoji={member.profile?.avatar_emoji ?? '🍽️'} size={30} />
          <AppText variant="caption" color="textMuted">
            {Math.min(progress.get(member.user_id) ?? 0, total)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function LastMatch({ recipe, onStart, starting }: { recipe: Recipe; onStart: () => void; starting: boolean }) {
  const { t, locale } = useI18n();
  const { title } = localizedRecipe(recipe, locale);
  return (
    <Animated.View entering={FadeIn} style={styles.lastMatch}>
      <Card style={styles.lastMatchCard}>
        <RecipeImage imageUrl={recipe.image_url} category={recipe.category} style={styles.lastMatchImage} />
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <AppText variant="title">{t('swipe.matchedTitle')}</AppText>
          <AppText color="textMuted">{t('swipe.matchedText', { title })}</AppText>
        </View>
      </Card>
      <Button label={t('swipe.showRecipe')} icon="book-outline" onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })} />
      <Button label={t('swipe.restart')} icon="refresh" variant="secondary" onPress={onStart} loading={starting} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  body: { flex: 1 },
  deck: { flex: 1, marginTop: spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  actionButton: { borderWidth: 2.5, shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  progress: { flex: 1, textAlign: 'center' },
  members: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.xs },
  member: { alignItems: 'center', gap: 2 },
  paused: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, marginBottom: spacing.sm },
  lastMatch: { flex: 1, justifyContent: 'center', gap: spacing.md },
  lastMatchCard: { padding: 0, overflow: 'hidden' },
  lastMatchImage: { width: '100%', aspectRatio: 4 / 3, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
});
