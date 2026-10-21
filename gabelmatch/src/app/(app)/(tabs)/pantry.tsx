import { Alert, StyleSheet, View } from 'react-native';
import { useMemo, useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Screen } from '@/components/Screen';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { GroupSwitcher } from '@/features/groups/GroupSwitcher';
import { NoGroup } from '@/features/groups/NoGroup';
import { useClearPantry, usePantry, useTogglePantry } from '@/features/pantry/api';
import { useCatalog } from '@/features/recipes/api';
import { ingredientName } from '@/features/recipes/format';
import { pantryCoverage } from '@/features/recipes/ranking';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import { spacing } from '@/theme/typography';

const AISLE_ORDER = ['gemuese', 'obst', 'kraeuter', 'milch_eier', 'fleisch_fisch', 'nudeln_reis', 'konserven', 'brot', 'backen', 'gewuerze', 'sonstiges'];

export default function PantryScreen() {
  const { t, tp, locale } = useI18n();
  const toast = useToast();
  const userId = useUserId();
  const { group, isLoading: groupsLoading } = useCurrentGroup();
  const catalog = useCatalog();
  const pantry = usePantry(group?.id);
  const toggle = useTogglePantry(group?.id, userId);
  const clear = useClearPantry(group?.id);
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    if (!catalog.data) return [];
    const needle = query.trim().toLowerCase();
    const items = [...catalog.data.ingredients.values()]
      .filter((i) => !i.is_staple)
      .filter((i) => !needle || i.name_de.toLowerCase().includes(needle) || i.name_en.toLowerCase().includes(needle))
      .sort((a, b) => ingredientName(a, a.id, locale).localeCompare(ingredientName(b, b.id, locale), locale));
    return AISLE_ORDER.map((aisle) => ({ aisle, items: items.filter((i) => i.aisle === aisle) })).filter((s) => s.items.length > 0);
  }, [catalog.data, query, locale]);

  const makeable = useMemo(() => {
    if (!catalog.data || !pantry.data || pantry.data.size === 0) return 0;
    return catalog.data.recipes.filter((r) => pantryCoverage(r, pantry.data, catalog.data.staples).complete).length;
  }, [catalog.data, pantry.data]);

  if (groupsLoading) return <Screen><LoadingState /></Screen>;
  if (!group) return <Screen><NoGroup /></Screen>;
  if (catalog.isLoading || pantry.isLoading) return <Screen><LoadingState /></Screen>;
  if (catalog.error || pantry.error)
    return (
      <Screen>
        <ErrorState
          message={t(errorKey(catalog.error ?? pantry.error))}
          onRetry={() => {
            void catalog.refetch();
            void pantry.refetch();
          }}
        />
      </Screen>
    );

  const selected = pantry.data ?? new Set<string>();

  const confirmClear = () =>
    Alert.alert(t('pantry.clear'), t('pantry.clearConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('pantry.clear'), style: 'destructive', onPress: () => clear.mutate(undefined, { onError: (e) => toast(t(errorKey(e)), 'error') }) },
    ]);

  return (
    <Screen scroll keyboard>
      <View style={styles.header}>
        <AppText variant="title">{t('pantry.title')}</AppText>
        <GroupSwitcher />
      </View>
      <AppText color="textMuted">{t('pantry.subtitle')}</AppText>
      <TextField label={t('pantry.search')} value={query} onChangeText={setQuery} placeholder="🔍" returnKeyType="search" autoCorrect={false} />
      <View style={styles.summary} accessible accessibilityLiveRegion="polite">
        <AppText variant="bodyStrong">{tp('pantry.selected', selected.size)}</AppText>
        {selected.size > 0 ? (
          <AppText variant="bodyStrong" color="primary">
            {tp('pantry.makeable', makeable)}
          </AppText>
        ) : null}
      </View>

      {sections.length === 0 ? <AppText color="textMuted">{t('pantry.noResults')}</AppText> : null}
      {sections.map((section) => (
        <View key={section.aisle} style={styles.section}>
          <AppText variant="heading">{t(`pantry.aisles.${section.aisle}` as TranslationKey)}</AppText>
          <View style={styles.chips}>
            {section.items.map((ingredient) => {
              const isSelected = selected.has(ingredient.id);
              return (
                <Chip
                  key={ingredient.id}
                  label={ingredientName(ingredient, ingredient.id, locale)}
                  selected={isSelected}
                  onPress={() => {
                    haptics.tick();
                    toggle.mutate(
                      { ingredientId: ingredient.id, present: !isSelected },
                      { onError: (e) => toast(t(errorKey(e)), 'error') },
                    );
                  }}
                />
              );
            })}
          </View>
        </View>
      ))}

      <AppText variant="caption" color="textMuted">
        {t('pantry.staplesHint')}
      </AppText>
      {selected.size > 0 ? <Button label={t('pantry.clear')} icon="trash-outline" variant="secondary" onPress={confirmClear} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingTop: spacing.sm },
  summary: { gap: spacing.xs },
  section: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
