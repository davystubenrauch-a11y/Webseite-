import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { RecipeImage } from '@/components/RecipeImage';
import { ErrorState, LoadingState } from '@/components/StateViews';
import { useMatch } from '@/features/matches/api';
import { useCatalog } from '@/features/recipes/api';
import { localizedRecipe } from '@/features/recipes/format';
import { errorKey } from '@/lib/errors';
import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

const CONFETTI = ['#FFC94D', '#FFFFFF', '#7FDBA0', '#FFD5C8', '#FFC94D', '#FFFFFF', '#7FDBA0', '#FFD5C8', '#FFC94D', '#FFFFFF', '#FFD5C8', '#7FDBA0'];

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const match = useMatch(id);
  const catalog = useCatalog();
  const recipe = match.data ? catalog.data?.recipesById.get(match.data.recipe_id) : undefined;
  const title = recipe ? localizedRecipe(recipe, locale).title : '';

  const heart = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!recipe) return;
    haptics.success();
    AccessibilityInfo.announceForAccessibility(t('match.a11yAnnouncement', { title }));
    heart.value = withSpring(1, { damping: 9, stiffness: 140 });
    pulse.value = withDelay(700, withRepeat(withSequence(withTiming(1.08, { duration: 500 }), withTiming(1, { duration: 500 })), -1));
  }, [recipe, title, t, heart, pulse]);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heart.value * pulse.value }], opacity: heart.value }));

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const openRecipe = () => recipe && router.replace({ pathname: '/recipe/[id]', params: { id: recipe.id } });

  return (
    <View style={[styles.root, { backgroundColor: colors.primary }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {match.isLoading || catalog.isLoading ? (
          <LoadingState />
        ) : match.error || !recipe ? (
          <ErrorState message={t(errorKey(match.error ?? catalog.error))} onRetry={close} />
        ) : (
          <>
            <View style={styles.top}>
              {CONFETTI.map((color, index) => (
                <ConfettiDot key={index} index={index} color={color} />
              ))}
              <Animated.View style={[styles.heart, heartStyle]}>
                <Ionicons name="heart" size={96} color={colors.onPrimary} />
              </Animated.View>
              <AppText variant="display" align="center" style={{ color: colors.onPrimary }} accessibilityRole="header">
                {t('match.title')}
              </AppText>
              <AppText align="center" style={{ color: colors.onPrimary, opacity: 0.9 }}>
                {t('match.subtitle')}
              </AppText>
            </View>

            <Animated.View entering={FadeInUp.delay(350).springify().damping(16)} style={[styles.card, { backgroundColor: colors.surface }]}>
              <RecipeImage imageUrl={recipe.image_url} category={recipe.category} style={styles.image} />
              <View style={styles.cardText}>
                <AppText variant="title" numberOfLines={2}>
                  {title}
                </AppText>
                <AppText color="textMuted">
                  {t('common.minutes', { count: recipe.total_minutes })} · {t(`difficulty.${recipe.difficulty}`)}
                </AppText>
              </View>
            </Animated.View>

            <View style={styles.actions}>
              <Button label={t('match.toRecipe')} icon="book-outline" variant="secondary" onPress={openRecipe} />
              <Button label={t('match.later')} variant="ghost" textColor={colors.onPrimary} onPress={close} />
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

function ConfettiDot({ index, color }: { index: number; color: string }) {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  const angle = (index / CONFETTI.length) * Math.PI * 2;
  const distance = Math.min(width * 0.42, 170) * (0.75 + (index % 3) * 0.12);

  useEffect(() => {
    progress.value = withDelay(120 + index * 18, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.35,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
      { scale: 0.4 + progress.value * 0.8 },
      { rotate: `${progress.value * 180}deg` },
    ],
  }));

  return <Animated.View pointerEvents="none" style={[styles.confetti, { backgroundColor: color, borderRadius: index % 2 ? 6 : 2 }, style]} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  top: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl },
  heart: { marginBottom: spacing.md },
  confetti: { position: 'absolute', top: 70, width: 14, height: 14 },
  card: { borderRadius: radius.xl, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 16 / 10 },
  cardText: { padding: spacing.lg, gap: spacing.xs },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
});
