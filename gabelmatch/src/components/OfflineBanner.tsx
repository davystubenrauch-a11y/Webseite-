import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/lib/i18n';
import { useIsOffline } from '@/lib/network';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

import { AppText } from './AppText';

export function OfflineBanner() {
  const offline = useIsOffline();
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  if (!offline) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={[styles.banner, { backgroundColor: colors.text, paddingTop: insets.top + spacing.xs }]}
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.background} />
      <AppText variant="caption" style={{ color: colors.background, flex: 1 }}>
        {t('offline.banner')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
