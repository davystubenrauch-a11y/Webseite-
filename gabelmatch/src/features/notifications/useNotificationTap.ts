import * as Notifications from 'expo-notifications';

/** Daten der zuletzt angetippten Benachrichtigung (iOS/Android). */
export function useNotificationTap(): Record<string, unknown> | undefined {
  const response = Notifications.useLastNotificationResponse();
  return response?.notification.request.content.data as Record<string, unknown> | undefined;
}
