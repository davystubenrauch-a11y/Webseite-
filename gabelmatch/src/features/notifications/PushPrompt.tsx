import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/typography';

import { enablePush, getPushPermission, markPushPrompted, wasPushPrompted } from './register';

/** Sanfte Vorab-Frage, bevor der System-Dialog erscheint (bessere Zustimmungsrate, App-Store-konform). */
export function PushPrompt({ userId }: { userId: string }) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void (async () => {
      if ((await getPushPermission()) === 'undetermined' && !(await wasPushPrompted())) setVisible(true);
    })();
  }, []);

  if (!visible) return null;
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="notifications" size={22} color={colors.primary} />
        <View style={styles.text}>
          <AppText variant="bodyStrong">{t('swipe.pushPromptTitle')}</AppText>
          <AppText variant="caption" color="textMuted">
            {t('swipe.pushPromptText')}
          </AppText>
        </View>
      </View>
      <View style={styles.row}>
        <Button
          compact
          variant="ghost"
          label={t('swipe.pushPromptNo')}
          onPress={() => {
            setVisible(false);
            void markPushPrompted();
          }}
          style={styles.flex}
        />
        <Button
          compact
          label={t('swipe.pushPromptYes')}
          onPress={() => {
            setVisible(false);
            void enablePush(userId).catch(() => undefined);
          }}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1 },
  flex: { flex: 1 },
});
