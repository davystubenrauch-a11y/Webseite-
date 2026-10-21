import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState, type ComponentProps } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { CATEGORY_IMAGES } from '@/features/recipes/categories';
import { useOnboarding } from '@/features/auth/OnboardingProvider';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

type Slide = { key: string; title: TranslationKey; text: TranslationKey; art: 'chat' | 'swipe' | 'match' };

const SLIDES: Slide[] = [
  { key: '1', title: 'onboarding.slide1Title', text: 'onboarding.slide1Text', art: 'chat' },
  { key: '2', title: 'onboarding.slide2Title', text: 'onboarding.slide2Text', art: 'swipe' },
  { key: '3', title: 'onboarding.slide3Title', text: 'onboarding.slide3Text', art: 'match' },
];

export default function Onboarding() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { complete } = useOnboarding();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList<Slide>>(null);
  const last = index === SLIDES.length - 1;

  const next = () => {
    if (last) return complete();
    list.current?.scrollToOffset({ offset: width * (index + 1), animated: true });
    setIndex(index + 1);
  };

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        {!last ? <Button label={t('onboarding.skip')} variant="ghost" compact onPress={complete} /> : <View style={{ height: 40 }} />}
      </View>
      <FlatList
        ref={list}
        data={SLIDES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <SlideArt art={item.art} />
            <AppText variant="title" align="center">
              {t(item.title)}
            </AppText>
            <AppText color="textMuted" align="center" style={styles.text}>
              {t(item.text)}
            </AppText>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`${index + 1} / ${SLIDES.length}`} accessible>
          {SLIDES.map((slide, i) => (
            <View key={slide.key} style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.border, width: i === index ? 24 : 8 }]} />
          ))}
        </View>
        <Button label={last ? t('onboarding.start') : t('common.continue')} onPress={next} icon={last ? 'restaurant' : 'arrow-forward'} />
      </View>
    </Screen>
  );
}

function SlideArt({ art }: { art: Slide['art'] }) {
  const { colors } = useTheme();
  const icon = (name: ComponentProps<typeof Ionicons>['name'], color: string, size = 34) => (
    <Ionicons name={name} size={size} color={color} />
  );
  if (art === 'chat') {
    return (
      <Animated.View entering={FadeIn.duration(500)} style={styles.art} accessible={false}>
        <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border, left: 10, top: 30 }]}>
          <AppText variant="heading">🍝 ?</AppText>
        </View>
        <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border, right: 10, top: 90 }]}>
          <AppText variant="heading">🥗 ?</AppText>
        </View>
        <View style={[styles.bubble, { backgroundColor: colors.primary, borderColor: colors.primary, left: 70, top: 160 }]}>
          <AppText variant="heading" style={{ color: colors.onPrimary }}>
            🍕 !!
          </AppText>
        </View>
      </Animated.View>
    );
  }
  if (art === 'swipe') {
    return (
      <View style={styles.art} accessible={false}>
        <View style={[styles.miniCard, { backgroundColor: colors.surface, transform: [{ rotate: '-8deg' }], left: 40 }]}>
          <Image source={CATEGORY_IMAGES.salate} style={styles.miniImage} />
        </View>
        <View style={[styles.miniCard, { backgroundColor: colors.surface, transform: [{ rotate: '7deg' }], left: 90 }]}>
          <Image source={CATEGORY_IMAGES.pasta} style={styles.miniImage} />
        </View>
        <View style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.nope, left: 10, bottom: 0 }]}>
          {icon('close', colors.nope)}
        </View>
        <View style={[styles.round, { backgroundColor: colors.surface, borderColor: colors.like, right: 10, bottom: 0 }]}>
          {icon('heart', colors.like)}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.art} accessible={false}>
      <View style={[styles.matchCircle, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name="heart" size={110} color={colors.primary} />
      </View>
      <AppText variant="display" style={[styles.sparkle, { color: colors.highlight, left: 30, top: 20 }]}>
        ✦
      </AppText>
      <AppText variant="title" style={[styles.sparkle, { color: colors.highlight, right: 40, top: 60 }]}>
        ✦
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, minHeight: 48 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.lg },
  text: { maxWidth: 340 },
  footer: { padding: spacing.lg, gap: spacing.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  dot: { height: 8, borderRadius: 4 },
  art: { width: 260, height: 260, marginBottom: spacing.lg },
  bubble: { position: 'absolute', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1 },
  miniCard: { position: 'absolute', top: 10, width: 130, height: 170, borderRadius: radius.md, overflow: 'hidden', padding: 6 },
  miniImage: { flex: 1, borderRadius: radius.sm },
  round: { position: 'absolute', width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  matchCircle: { flex: 1, borderRadius: 130, alignItems: 'center', justifyContent: 'center' },
  sparkle: { position: 'absolute' },
});
