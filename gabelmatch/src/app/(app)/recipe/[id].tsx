import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { RecipeImage } from '@/components/RecipeImage';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { usePantry } from '@/features/pantry/api';
import { useCatalog } from '@/features/recipes/api';
import { ingredientName, localizedRecipe } from '@/features/recipes/format';
import { formatQuantity } from '@/features/recipes/scaling';
import { useAddShoppingItems, useShoppingList, type NewShoppingItem } from '@/features/shopping/api';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 12;

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, tp, locale } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const userId = useUserId();
  const { group } = useCurrentGroup();
  const catalog = useCatalog();
  const pantry = usePantry(group?.id);
  useShoppingList(group?.id); // lädt die Liste vor, damit Dubletten erkannt werden
  const addItems = useAddShoppingItems(group?.id, userId);
  const recipe = catalog.data?.recipesById.get(id);
  const [servings, setServings] = useState<number | null>(null);
  const current = servings ?? recipe?.servings ?? 2;

  const lines = useMemo(() => {
    if (!recipe || !catalog.data) return [];
    return recipe.ingredients.map((line) => {
      const ingredient = catalog.data.ingredients.get(line.ingredient_id);
      const staple = catalog.data.staples.has(line.ingredient_id);
      return {
        ...line,
        name: ingredientName(ingredient, line.ingredient_id, locale),
        quantity: formatQuantity(line.amount, line.unit, recipe.servings, current, locale),
        staple,
        inPantry: !!pantry.data?.has(line.ingredient_id),
      };
    });
  }, [recipe, catalog.data, pantry.data, current, locale]);

  if (catalog.isLoading) return <LoadingState />;
  if (catalog.error || !recipe)
    return <ErrorState message={catalog.error ? t(errorKey(catalog.error)) : t('errors.notFound')} onRetry={() => void catalog.refetch()} />;

  const { title, description, steps } = localizedRecipe(recipe, locale);
  const missing = lines.filter((l) => !l.staple && !l.inPantry);

  const toItem = (line: (typeof lines)[number]): NewShoppingItem => ({
    label: line.name,
    quantity: line.quantity,
    ingredient_id: line.ingredient_id,
    recipe_id: recipe.id,
  });

  const add = (items: NewShoppingItem[], single?: string) => {
    if (!group) return toast(t('recipe.noGroupForShopping'));
    addItems.mutate(items, {
      onSuccess: (count) => {
        haptics.success();
        toast(single ? t('recipe.addedOne', { name: single }) : tp('recipe.added', count), 'success');
      },
      onError: (error) => toast(t(errorKey(error)), 'error'),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
        <RecipeImage imageUrl={recipe.image_url} category={recipe.category} style={styles.hero} />
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <AppText variant="title">{title}</AppText>
          <AppText color="textMuted">{description}</AppText>
          <View style={styles.meta}>
            <MetaPill icon="time-outline" label={t('common.minutes', { count: recipe.total_minutes })} />
            <MetaPill icon="speedometer-outline" label={t(`difficulty.${recipe.difficulty}`)} />
            <MetaPill icon="leaf-outline" label={t(`diets.${recipe.diet}`)} />
            <MetaPill icon="grid-outline" label={t(`categories.${recipe.category}`)} />
          </View>

          <Card style={styles.servings}>
            <AppText variant="bodyStrong" style={{ flex: 1 }}>
              {t('recipe.servings')}
            </AppText>
            <IconButton
              icon="remove"
              label={t('recipe.decrease')}
              disabled={current <= MIN_SERVINGS}
              background={colors.surfaceAlt}
              onPress={() => {
                haptics.tick();
                setServings(Math.max(MIN_SERVINGS, current - 1));
              }}
            />
            <AppText variant="heading" style={styles.servingsValue} accessibilityLiveRegion="polite" accessibilityLabel={tp('common.servings', current)}>
              {current}
            </AppText>
            <IconButton
              icon="add"
              label={t('recipe.increase')}
              disabled={current >= MAX_SERVINGS}
              background={colors.surfaceAlt}
              onPress={() => {
                haptics.tick();
                setServings(Math.min(MAX_SERVINGS, current + 1));
              }}
            />
          </Card>

          <AppText variant="heading">{t('recipe.ingredients')}</AppText>
          <Card style={styles.ingredients}>
            {lines.map((line) => {
              const status = line.staple ? t('recipe.staple') : line.inPantry ? t('recipe.inPantry') : group ? t('recipe.missing') : '';
              return (
                <View
                  key={line.position}
                  style={[styles.ingredientRow, { borderBottomColor: colors.border }]}
                  accessible
                  accessibilityLabel={[line.quantity ?? t('recipe.toTaste'), line.name, line.note, status].filter(Boolean).join(', ')}
                >
                  <Ionicons
                    name={line.inPantry ? 'checkmark-circle' : line.staple ? 'ellipse-outline' : 'ellipse'}
                    size={18}
                    color={line.inPantry ? colors.success : line.staple ? colors.textMuted : colors.primary}
                  />
                  <AppText variant="bodyStrong" style={styles.quantity}>
                    {line.quantity ?? '–'}
                  </AppText>
                  <View style={{ flex: 1 }}>
                    <AppText>{line.name}</AppText>
                    {line.note || !line.quantity ? (
                      <AppText variant="caption" color="textMuted">
                        {line.note ?? t('recipe.toTaste')}
                      </AppText>
                    ) : null}
                  </View>
                  {!line.staple && !line.inPantry && group ? (
                    <IconButton icon="cart-outline" size={20} label={t('recipe.addOne', { name: line.name })} onPress={() => add([toItem(line)], line.name)} />
                  ) : null}
                </View>
              );
            })}
          </Card>
          {group ? (
            missing.length > 0 ? (
              <Button
                icon="cart"
                label={tp('recipe.addMissingCount', missing.length)}
                onPress={() => add(missing.map(toItem))}
                loading={addItems.isPending}
              />
            ) : (
              <AppText color="success" variant="bodyStrong" align="center">
                {t('recipe.allThere')}
              </AppText>
            )
          ) : null}

          <AppText variant="heading">{t('recipe.steps')}</AppText>
          {steps.map((step, index) => (
            <View key={index} style={styles.step} accessible accessibilityLabel={`${t('recipe.step', { number: index + 1 })}: ${step}`}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <AppText variant="bodyStrong" style={{ color: colors.onPrimary }}>
                  {index + 1}
                </AppText>
              </View>
              <AppText style={{ flex: 1 }}>{step}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function MetaPill({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: colors.primarySoft }]}>
      <Ionicons name={icon} size={15} color={colors.onPrimarySoft} />
      <AppText variant="label" style={{ color: colors.onPrimarySoft }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 4 / 3 },
  content: { padding: spacing.lg, gap: spacing.lg, marginTop: -spacing.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  servings: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  servingsValue: { minWidth: 32, textAlign: 'center' },
  ingredients: { paddingVertical: spacing.xs },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth },
  quantity: { minWidth: 76 },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
