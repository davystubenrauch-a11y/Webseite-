import AsyncStorage from '@react-native-async-storage/async-storage';

/** Kleine, fehlertolerante Hülle um AsyncStorage (Fehler werden nie nach außen geworfen). */
export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Speichern ist nur Komfort – ignorieren
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignorieren
    }
  },
  /** Entfernt alle App-eigenen Schlüssel (z. B. nach Kontolöschung). */
  async clearAppData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith('gm.')));
    } catch {
      // ignorieren
    }
  },
};
