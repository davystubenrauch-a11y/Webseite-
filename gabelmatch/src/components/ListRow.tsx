import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

import { AppText } from './AppText';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  accessibilityHint?: string;
};

export function ListRow({ title, subtitle, icon, value, right, onPress, destructive, accessibilityHint }: Props) {
  const { colors } = useTheme();
  const tint = destructive ? colors.danger : colors.text;
  const content = (
    <>
      {icon ? <Ionicons name={icon} size={22} color={destructive ? colors.danger : colors.primary} /> : null}
      <View style={styles.text}>
        <AppText variant="bodyStrong" style={{ color: tint }}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {value ? <AppText color="textMuted">{value}</AppText> : null}
      {right}
      {onPress && !right ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </>
  );
  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${title}, ${value}` : title}
      accessibilityHint={accessibilityHint ?? subtitle}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 52, paddingVertical: spacing.sm },
  text: { flex: 1, gap: 2 },
});
