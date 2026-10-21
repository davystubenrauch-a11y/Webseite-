import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

import { AppText } from './AppText';

export function Avatar({ emoji, size = 40, muted }: { emoji: string; size?: number; muted?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft, opacity: muted ? 0.5 : 1 }]}
    >
      <AppText style={{ fontSize: size * 0.52, lineHeight: size * 0.7 }}>{emoji}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ circle: { alignItems: 'center', justifyContent: 'center' } });
