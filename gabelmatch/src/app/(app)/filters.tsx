import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useToast } from '@/components/Toast';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { useCatalog } from '@/features/recipes/api';
import { CATEGORIES } from '@/features/recipes/categories';
import { matchesFilters, type RecipeFilters } from '@/features/recipes/ranking';
import { sessionFilters, useSessionState, useStartSession, useUpdateFilters } from '@/features/swipe/api';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { spacing } from '@/theme/typography';
import type { DietFilter, MaxMinutes } from '@/types/database';

export default function FiltersScreen() {
  const { t } = useI18n();
  const toast = useToast();
  const { group } = useCurrentGroup();
  const sessionState = useSessionState(group?.id);
  const session = sessionState.data?.active ?? null;
  const [filters, setFilters] = useState<RecipeFilters>(() => sessionFilters(session));
  const update = useUpdateFilters();
  const start = useStartSession(group?.id);
  const catalog = useCatalog();
  const count = catalog.data?.recipes.filter((r) => matchesFilters(r, filters)).length;

  const apply = () => {
    const onError = (error: unknown) => toast(t(errorKey(error)), 'error');
    if (session) update.mutate({ session, filters }, { onSuccess: () => router.back(), onError });
    else start.mutate(filters, { onSuccess: () => router.back(), onError });
  };

  return (
    <Screen scroll edges={['bottom']} contentStyle={styles.content}>
      <AppText color="textMuted">{t('filters.hint')}</AppText>

      <View style={styles.group}>
        <AppText variant="heading">{t('filters.maxTime')}</AppText>
        <SegmentedControl<MaxMinutes | null>
          accessibilityLabel={t('filters.maxTime')}
          value={filters.maxMinutes}
          onChange={(maxMinutes) => setFilters((f) => ({ ...f, maxMinutes }))}
          options={[
            { value: null, label: t('filters.any') },
            { value: 15, label: '15' },
            { value: 30, label: '30' },
            { value: 60, label: '60' },
          ]}
        />
      </View>

      <View style={styles.group}>
        <AppText variant="heading">{t('filters.diet')}</AppText>
        <SegmentedControl<DietFilter | null>
          accessibilityLabel={t('filters.diet')}
          value={filters.diet}
          onChange={(diet) => setFilters((f) => ({ ...f, diet }))}
          options={[
            { value: null, label: t('filters.any') },
            { value: 'vegetarisch', label: t('filters.vegetarian') },
            { value: 'vegan', label: t('filters.vegan') },
          ]}
        />
      </View>

      <View style={styles.group}>
        <AppText variant="heading">{t('filters.category')}</AppText>
        <View style={styles.chips} accessibilityRole="radiogroup">
          <Chip
            accessibilityRole="radio"
            label={t('filters.allCategories')}
            selected={filters.category === null}
            onPress={() => setFilters((f) => ({ ...f, category: null }))}
          />
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              accessibilityRole="radio"
              label={t(`categories.${category}`)}
              selected={filters.category === category}
              onPress={() => setFilters((f) => ({ ...f, category: f.category === category ? null : category }))}
            />
          ))}
        </View>
      </View>

      <Button
        label={count != null ? `${t('filters.apply')} (${count})` : t('filters.apply')}
        onPress={apply}
        loading={update.isPending || start.isPending}
        disabled={count === 0}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, gap: spacing.xl },
  group: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
