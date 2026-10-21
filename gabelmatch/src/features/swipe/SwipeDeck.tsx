import { useImperativeHandle, type Ref } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, useCompetingGestures, usePanGesture, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { haptics } from '@/lib/haptics';
import { useI18n } from '@/lib/i18n';

import { localizedRecipe } from '../recipes/format';
import type { PantryCoverage } from '../recipes/ranking';
import type { Recipe } from '../recipes/types';
import { SwipeCard } from './SwipeCard';

export type SwipeDeckHandle = { swipe: (liked: boolean) => void };

type Props = {
  recipes: Recipe[];
  coverage: (recipe: Recipe) => PantryCoverage | null;
  onSwipe: (recipe: Recipe, liked: boolean) => void;
  onOpen: (recipe: Recipe) => void;
  ref?: Ref<SwipeDeckHandle>;
};

const VISIBLE = 3;

/** Kartenstapel: oberste Karte ist wischbar, die nächste wächst beim Ziehen sanft nach. */
export function SwipeDeck({ recipes, coverage, onSwipe, onOpen, ref }: Props) {
  const { width } = useWindowDimensions();
  const threshold = Math.min(140, width * 0.3);
  const topX = useSharedValue(0);
  const visible = recipes.slice(0, VISIBLE);

  return (
    <View style={styles.deck}>
      {visible
        .map((recipe, index) => (
          <DeckCard
            key={recipe.id}
            recipe={recipe}
            index={index}
            topX={topX}
            threshold={threshold}
            screenWidth={width}
            coverage={coverage(recipe)}
            onSwipe={onSwipe}
            onOpen={onOpen}
            deckRef={index === 0 ? ref : undefined}
          />
        ))
        .reverse()}
    </View>
  );
}

type CardProps = {
  recipe: Recipe;
  index: number;
  topX: SharedValue<number>;
  threshold: number;
  screenWidth: number;
  coverage: PantryCoverage | null;
  onSwipe: (recipe: Recipe, liked: boolean) => void;
  onOpen: (recipe: Recipe) => void;
  deckRef?: Ref<SwipeDeckHandle>;
};

function DeckCard({ recipe, index, topX, threshold, screenWidth, coverage, onSwipe, onOpen, deckRef }: CardProps) {
  const { t, locale } = useI18n();
  const isTop = index === 0;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const passed = useSharedValue(0); // -1 / 0 / 1: welche Schwelle gerade überschritten ist

  const finish = (liked: boolean) => {
    topX.value = 0;
    onSwipe(recipe, liked);
  };

  const flyOut = (liked: boolean, velocityX = 0) => {
    'worklet';
    const target = (liked ? 1 : -1) * screenWidth * 1.5;
    x.value = withTiming(target, { duration: Math.max(160, 320 - Math.abs(velocityX) / 12) }, (done) => {
      if (done) scheduleOnRN(finish, liked);
    });
    topX.value = withTiming(liked ? threshold : -threshold, { duration: 200 });
    // flyOut läuft per Geste auf dem UI-Thread, per Button/Screenreader auf dem JS-Thread
    if ((globalThis as { _WORKLET?: boolean })._WORKLET) scheduleOnRN(haptics.swipe);
    else haptics.swipe();
  };

  useImperativeHandle(deckRef, () => ({ swipe: (liked: boolean) => flyOut(liked) }), [recipe.id]);

  const pan = usePanGesture({
    enabled: isTop,
    minDistance: 6,
    onUpdate: (event) => {
      x.value = event.translationX;
      y.value = event.translationY * 0.4;
      topX.value = event.translationX;
      const zone = event.translationX > threshold ? 1 : event.translationX < -threshold ? -1 : 0;
      if (zone !== passed.value) {
        passed.value = zone;
        if (zone !== 0) scheduleOnRN(haptics.tick);
      }
    },
    onDeactivate: (event) => {
      const fling = Math.abs(event.velocityX) > 900;
      if (Math.abs(event.translationX) > threshold || fling) {
        flyOut(event.translationX > 0 || (fling && event.velocityX > 0), event.velocityX);
      } else {
        x.value = withSpring(0, { damping: 16, stiffness: 180 });
        y.value = withSpring(0, { damping: 16, stiffness: 180 });
        topX.value = withSpring(0, { damping: 16, stiffness: 180 });
        passed.value = 0;
      }
    },
  });

  const tap = useTapGesture({
    enabled: isTop,
    runOnJS: true,
    onActivate: () => onOpen(recipe),
  });

  const gesture = useCompetingGestures(pan, tap);

  const style = useAnimatedStyle(() => {
    if (isTop) {
      return {
        transform: [
          { translateX: x.value },
          { translateY: y.value },
          { rotate: `${interpolate(x.value, [-screenWidth, 0, screenWidth], [-14, 0, 14])}deg` },
        ],
      };
    }
    const progress = interpolate(Math.abs(topX.value), [0, threshold], [0, 1], 'clamp');
    const baseScale = 1 - index * 0.05;
    const scale = interpolate(progress, [0, 1], [baseScale, baseScale + 0.05]);
    const translateY = interpolate(progress, [0, 1], [index * 14, (index - 1) * 14]);
    return { transform: [{ translateY }, { scale }] };
  });

  const { title } = localizedRecipe(recipe, locale);
  const label = t('a11y.recipeCard', {
    title,
    minutes: recipe.total_minutes,
    difficulty: t(`difficulty.${recipe.difficulty}`),
    diet: t(`diets.${recipe.diet}`),
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[StyleSheet.absoluteFill, style]}
        pointerEvents={isTop ? 'auto' : 'none'}
        accessible={isTop}
        importantForAccessibility={isTop ? 'yes' : 'no-hide-descendants'}
        accessibilityElementsHidden={!isTop}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityHint={t('swipe.cardHint')}
        accessibilityActions={[
          { name: 'activate' },
          { name: 'increment', label: t('a11y.likeButton') },
          { name: 'decrement', label: t('a11y.nopeButton') },
          { name: 'like', label: t('a11y.likeButton') },
          { name: 'nope', label: t('a11y.nopeButton') },
        ]}
        onAccessibilityAction={(event) => {
          const action = event.nativeEvent.actionName;
          if (action === 'activate') onOpen(recipe);
          if (action === 'like' || action === 'increment') flyOut(true);
          if (action === 'nope' || action === 'decrement') flyOut(false);
        }}
      >
        <SwipeCard recipe={recipe} coverage={coverage} translateX={isTop ? x : undefined} threshold={threshold} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  deck: { flex: 1 },
});
