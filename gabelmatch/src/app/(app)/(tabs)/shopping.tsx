import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews';
import { useToast } from '@/components/Toast';
import { useUserId } from '@/features/auth/AuthProvider';
import { useCurrentGroup } from '@/features/groups/CurrentGroupProvider';
import { GroupSwitcher } from '@/features/groups/GroupSwitcher';
import { NoGroup } from '@/features/groups/NoGroup';
import { useCatalog } from '@/features/recipes/api';
import { localizedRecipe } from '@/features/recipes/format';
import { useAddShoppingItems, useRemoveShoppingItems, useShoppingList, useToggleShoppingItem } from '@/features/shopping/api';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, spacing } from '@/theme/typography';
import type { ShoppingItemRow } from '@/types/database';

type Row = { type: 'item'; item: ShoppingItemRow } | { type: 'header'; count: number };

export default function ShoppingScreen() {
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const toast = useToast();
  const userId = useUserId();
  const { group, isLoading: groupsLoading } = useCurrentGroup();
  const list = useShoppingList(group?.id);
  const catalog = useCatalog();
  const add = useAddShoppingItems(group?.id, userId);
  const toggle = useToggleShoppingItem(group?.id);
  const remove = useRemoveShoppingItems(group?.id);
  const [text, setText] = useState('');

  const rows = useMemo<Row[]>(() => {
    const items = list.data ?? [];
    const open = items.filter((i) => !i.checked);
    const done = items.filter((i) => i.checked);
    return [
      ...open.map((item) => ({ type: 'item' as const, item })),
      ...(done.length ? [{ type: 'header' as const, count: done.length }] : []),
      ...done.map((item) => ({ type: 'item' as const, item })),
    ];
  }, [list.data]);

  if (groupsLoading) return <Screen><LoadingState /></Screen>;
  if (!group) return <Screen><NoGroup /></Screen>;

  const onError = (error: unknown) => toast(t(errorKey(error)), 'error');
  const submit = () => {
    const label = text.trim();
    if (!label) return;
    setText('');
    add.mutate([{ label }], { onError });
  };
  const doneIds = (list.data ?? []).filter((i) => i.checked).map((i) => i.id);

  const header = (
    <View style={styles.headerBlock}>
      <View style={styles.header}>
        <AppText variant="title">{t('shopping.title')}</AppText>
        <GroupSwitcher />
      </View>
      <AppText color="textMuted">{t('shopping.subtitle', { group: group.name })}</AppText>
      <View style={[styles.addRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('shopping.addPlaceholder')}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={t('shopping.addPlaceholder')}
          returnKeyType="done"
          onSubmitEditing={submit}
          maxLength={80}
          style={[styles.input, { color: colors.text }]}
        />
        <IconButton icon="add-circle" size={30} color={colors.primary} label={t('shopping.add')} onPress={submit} disabled={!text.trim()} />
      </View>
    </View>
  );

  return (
    <Screen padded={false}>
      <FlatList
        data={rows}
        keyExtractor={(row) => (row.type === 'header' ? 'header' : row.item.id)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        refreshing={list.isRefetching}
        onRefresh={() => void list.refetch()}
        ListEmptyComponent={
          list.isLoading ? (
            <LoadingState />
          ) : list.error ? (
            <ErrorState message={t(errorKey(list.error))} onRetry={() => void list.refetch()} />
          ) : (
            <EmptyState icon="cart-outline" title={t('shopping.emptyTitle')} text={t('shopping.emptyText')} />
          )
        }
        renderItem={({ item: row }) => {
          if (row.type === 'header') {
            return (
              <View style={styles.doneHeader}>
                <AppText variant="label" color="textMuted">
                  {t('shopping.done', { count: row.count })}
                </AppText>
                <Button compact variant="ghost" label={t('shopping.clearDone')} onPress={() => remove.mutate(doneIds, { onError })} />
              </View>
            );
          }
          const item = row.item;
          const recipe = item.recipe_id ? catalog.data?.recipesById.get(item.recipe_id) : undefined;
          return (
            <View style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.checked }}
                accessibilityLabel={[item.quantity, item.label].filter(Boolean).join(' ')}
                accessibilityHint={item.checked ? t('shopping.uncheck', { label: item.label }) : t('shopping.check', { label: item.label })}
                onPress={() => {
                  haptics.tick();
                  toggle.mutate({ id: item.id, checked: !item.checked }, { onError });
                }}
                style={styles.itemMain}
              >
                <Ionicons name={item.checked ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={item.checked ? colors.success : colors.textMuted} />
                <View style={{ flex: 1 }}>
                  <AppText style={item.checked ? { textDecorationLine: 'line-through', color: colors.textMuted } : undefined}>
                    {item.quantity ? <AppText variant="bodyStrong">{item.quantity} </AppText> : null}
                    {item.label}
                  </AppText>
                  {recipe ? (
                    <AppText variant="caption" color="textMuted" numberOfLines={1}>
                      {t('shopping.fromRecipe', { title: localizedRecipe(recipe, locale).title })}
                    </AppText>
                  ) : null}
                </View>
              </Pressable>
              <IconButton icon="trash-outline" size={18} color={colors.textMuted} label={t('shopping.remove', { label: item.label })} onPress={() => remove.mutate([item.id], { onError })} />
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm, flexGrow: 1 },
  headerBlock: { gap: spacing.md, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingTop: spacing.sm },
  addRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: radius.md, paddingLeft: spacing.lg },
  input: { flex: 1, minHeight: 52, fontFamily: fonts.regular, fontSize: 16 },
  item: { flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, paddingLeft: spacing.md },
  itemMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 56, paddingVertical: spacing.sm },
  doneHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
});
