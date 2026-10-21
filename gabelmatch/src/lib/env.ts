/**
 * Öffentliche Konfiguration. Werte kommen aus `.env` (lokal) bzw. EAS-Umgebungsvariablen.
 * Der Anon-/Publishable-Key ist für die Auslieferung im Client vorgesehen – die Sicherheit
 * entsteht durch Row Level Security in der Datenbank.
 */
export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Basis-URL für Einladungslinks (Universal/App Links). Fallback: App-Schema. */
  inviteBaseUrl: process.env.EXPO_PUBLIC_INVITE_BASE_URL ?? '',
};

export const isConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
