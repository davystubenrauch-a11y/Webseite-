import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/features/auth/AuthProvider';
import { removePushToken } from '@/features/notifications/register';
import { errorKey } from '@/lib/errors';
import { useI18n } from '@/lib/i18n';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/theme/typography';

/**
 * Konto löschen – Pflicht nach App-Store-Richtlinie 5.1.1(v) und Google-Play-Datenrichtlinie,
 * umgesetzt als Recht auf Löschung nach Art. 17 DSGVO. Die Löschung passiert serverseitig
 * in der Funktion public.delete_account().
 */
export default function DeleteAccount() {
  const { t } = useI18n();
  const toast = useToast();
  const { signOut } = useAuth();
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const word = t('deleteAccount.confirmWord');

  const remove = async () => {
    setLoading(true);
    try {
      await removePushToken().catch(() => undefined);
      const { error } = await supabase.rpc('delete_account');
      if (error) throw error;
      await storage.clearAppData();
      await supabase.auth.signOut({ scope: 'local' });
      await signOut().catch(() => undefined);
      toast(t('deleteAccount.done'), 'success');
    } catch (error) {
      toast(t(errorKey(error)), 'error');
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboard edges={['bottom']} contentStyle={{ paddingTop: spacing.lg }}>
      <AppText variant="bodyStrong">{t('deleteAccount.intro')}</AppText>
      <Card style={styles.list}>
        {(['item1', 'item2', 'item3'] as const).map((key) => (
          <View key={key} style={styles.item}>
            <AppText>•</AppText>
            <AppText style={{ flex: 1 }}>{t(`deleteAccount.${key}`)}</AppText>
          </View>
        ))}
      </Card>
      <AppText color="textMuted">{t('deleteAccount.keep')}</AppText>
      <AppText variant="bodyStrong" color="danger">
        {t('deleteAccount.irreversible')}
      </AppText>
      <TextField label={t('deleteAccount.confirmLabel')} value={confirm} onChangeText={setConfirm} autoCapitalize="characters" autoCorrect={false} />
      <Button
        label={t('deleteAccount.button')}
        icon="trash"
        variant="danger"
        onPress={() => void remove()}
        loading={loading}
        disabled={confirm.trim().toUpperCase() !== word}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  item: { flexDirection: 'row', gap: spacing.sm },
});
