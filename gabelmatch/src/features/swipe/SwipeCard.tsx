import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { RecipeImage } from '@/components/RecipeImage';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

import { localizedRecipe } from '../recipes/format';
import type { PantryCoverage } from '../recipes/ranking';
import type { Recipe } from '../recipes/types';

type Props = {
  recipe: Recipe;
  coverage: PantryCoverage | null;
  /** horizontale Auslenkung der obersten Karte (für die Stempel) */
  translateX?: SharedValue<number>;
  threshold: number;
};

export function SwipeCard({ recipe, coverage, translateX, threshold }: Props) {
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const { title, description } = localizedRecipe(recipe, locale);

  const likeStyle = useAnimatedStyle(() => ({
    opacity: translateX ? interpolate(translateX.value, [0, threshold], [0, 1], 'clamp') : 0,
  }));
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: translateX ? interpolate(translateX.value, [-threshold, 0], [1, 0], 'clamp') : 0,
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <RecipeImage imageUrl={recipe.image_url} category={recipe.category} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['transparent', 'rgba(20,12,8,0.55)', 'rgba(20,12,8,0.92)']} locations={[0.35, 0.62, 1]} style={StyleSheet.absoluteFill} />

      {coverage && coverage.total > 0 && coverage.have > 0 ? (
        <View style={[styles.badge, { backgroundColor: coverage.complete ? colors.success : 'rgba(20,12,8,0.7)' }]}>
          <Ionicons name={coverage.complete ? 'checkmark-circle' : 'basket-outline'} size={16} color="#FFFFFF" />
          <AppText variant="caption" style={styles.white}>
            {coverage.complete ? t('swipe.pantryBadge') : t('swipe.pantryPartial', { have: coverage.have, total: coverage.total })}
          </AppText>
        </View>
      ) : null}

      <Animated.View style={[styles.stamp, styles.stampLike, { borderColor: '#7FDBA0' }, likeStyle]}>
        <AppText variant="title" style={{ color: '#7FDBA0' }}>
          {t('swipe.likeStamp')}
        </AppText>
      </Animated.View>
      <Animated.View style={[styles.stamp, styles.stampNope, { borderColor: '#FF8A6B' }, nopeStyle]}>
        <AppText variant="title" style={{ color: '#FF8A6B' }}>
          {t('swipe.nopeStamp')}
        </AppText>
      </Animated.View>

      <View style={styles.info}>
        <AppText variant="title" style={styles.white} numberOfLines={2}>
          {title}
        </AppText>
        <AppText style={styles.whiteMuted} numberOfLines={2}>
          {description}
        </AppText>
        <View style={styles.meta}>
          <Meta icon="time-outline" label={t('common.minutes', { count: recipe.total_minutes })} />
          <Meta icon="speedometer-outline" label={t(`difficulty.${recipe.difficulty}`)} />
          <Meta icon={recipe.diet === 'vegan' || recipe.diet === 'vegetarisch' ? 'leaf-outline' : 'restaurant-outline'} label={t(`diets.${recipe.diet}`)} />
        </View>
      </View>
    </View>
  );
}

function Meta({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={16} color="#FFFFFF" />
      <AppText variant="label" style={styles.white}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  info: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.xl, gap: spacing.sm },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  white: { color: '#FFFFFF' },
  whiteMuted: { color: 'rgba(255,255,255,0.88)' },
  badge: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  stamp: {
    position: 'absolute',
    top: spacing.xxl + spacing.lg,
    borderWidth: 4,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(20,12,8,0.35)',
  },
  stampLike: { left: spacing.xl, transform: [{ rotate: '-14deg' }] },
  stampNope: { right: spacing.xl, transform: [{ rotate: '14deg' }] },
});
