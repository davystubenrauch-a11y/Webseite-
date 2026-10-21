import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/typography';

import { useCurrentGroup } from './CurrentGroupProvider';

export function GroupSwitcher() {
  const { group } = useCurrentGroup();
  const { colors } = useTheme();
  const { t } = useI18n();
  if (!group) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('a11y.groupSwitcher', { name: group.name })}
      onPress={() => router.push('/groups')}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name="people" size={18} color={colors.primary} />
      <AppText variant="bodyStrong" numberOfLines={1} style={styles.name}>
        {group.name}
      </AppText>
      <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 240,
  },
  name: { flexShrink: 1 },
});
