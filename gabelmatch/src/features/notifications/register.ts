import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

const TOKEN_KEY = 'gm.pushToken';
const PROMPTED_KEY = 'gm.pushPrompted';

/** Läuft die App in Expo Go (statt in einem eigenen Build)? */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (Platform.OS !== 'web' && !(isExpoGo && Platform.OS === 'android')) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export type PushPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

export function pushSupported(): boolean {
  // Expo Go auf Android unterstützt seit SDK 53 keine Remote-Push-Benachrichtigungen mehr
  if (isExpoGo && Platform.OS === 'android') return false;
  return Platform.OS !== 'web' && Device.isDevice;
}

export async function getPushPermission(): Promise<PushPermission> {
  if (!pushSupported()) return 'unsupported';
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('matches', {
    name: 'Matches',
    // eslint-disable-next-line import/namespace -- Enum wird von eslint-plugin-import nicht erkannt
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 120, 200],
    lightColor: '#C93A22',
  });
}

/** Fragt (falls nötig) die Erlaubnis an und speichert das Expo-Push-Token beim Nutzer. */
export async function enablePush(userId: string): Promise<PushPermission> {
  if (!pushSupported()) return 'unsupported';
  await ensureAndroidChannel();
  let permission = await getPushPermission();
  if (permission === 'undetermined') {
    const { status } = await Notifications.requestPermissionsAsync();
    permission = status === 'granted' ? 'granted' : 'denied';
  }
  await storage.set(PROMPTED_KEY, '1');
  if (permission !== 'granted') return permission;
  await registerPushToken(userId);
  return permission;
}

/** Aktualisiert das Token still im Hintergrund, wenn die Erlaubnis bereits besteht. */
export async function refreshPushToken(userId: string): Promise<void> {
  if ((await getPushPermission()) !== 'granted') return;
  await ensureAndroidChannel();
  await registerPushToken(userId);
}

async function registerPushToken(userId: string): Promise<void> {
  const projectId: string | undefined =
    Constants.expoConfig?.extra?.eas?.projectId ?? (Constants.easConfig as { projectId?: string } | undefined)?.projectId;
  if (!projectId) {
    console.warn('Push: Keine EAS projectId konfiguriert (app.json → extra.eas.projectId).');
    return;
  }
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  const { error } = await supabase.from('push_tokens').upsert({
    token,
    user_id: userId,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  await storage.set(TOKEN_KEY, token);
}

/** Entfernt das Token dieses Geräts (beim Abmelden oder Deaktivieren). */
export async function removePushToken(): Promise<void> {
  const token = await storage.get(TOKEN_KEY);
  if (!token) return;
  await supabase.from('push_tokens').delete().eq('token', token);
  await storage.remove(TOKEN_KEY);
}

export async function wasPushPrompted(): Promise<boolean> {
  return (await storage.get(PROMPTED_KEY)) === '1';
}

export async function markPushPrompted(): Promise<void> {
  await storage.set(PROMPTED_KEY, '1');
}

export function openSystemSettings() {
  void Linking.openSettings();
}
