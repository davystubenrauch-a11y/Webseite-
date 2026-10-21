import type { TranslationKey } from '@/lib/i18n';

/** Fehler mit einem übersetzbaren Schlüssel für die Anzeige. */
export class AppError extends Error {
  constructor(
    public readonly key: TranslationKey,
    cause?: unknown,
  ) {
    super(key);
    this.name = 'AppError';
    if (cause) (this as { cause?: unknown }).cause = cause;
  }
}

const RPC_CODES: Record<string, TranslationKey> = {
  invalid_code: 'errors.invalidCode',
  group_full: 'errors.groupFull',
  too_many_groups: 'errors.tooManyGroups',
  not_a_member: 'errors.notMember',
  not_owner: 'errors.notOwner',
};

function messageOf(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    const candidate = error as { message?: unknown; error_description?: unknown; msg?: unknown };
    return String(candidate.message ?? candidate.error_description ?? candidate.msg ?? '');
  }
  return String(error);
}

/** Übersetzt beliebige Fehler (Supabase Auth, PostgREST, Netzwerk) in einen Text-Schlüssel. */
export function errorKey(error: unknown): TranslationKey {
  if (error instanceof AppError) return error.key;
  const message = messageOf(error).toLowerCase();
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code) : '';

  for (const [rpc, key] of Object.entries(RPC_CODES)) {
    if (message.includes(rpc)) return key;
  }
  if (message.includes('network request failed') || message.includes('failed to fetch') || message.includes('fetch failed'))
    return 'errors.network';
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) return 'errors.invalidCredentials';
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) return 'errors.emailNotConfirmed';
  if (code === 'user_already_exists' || message.includes('already registered')) return 'errors.userExists';
  if (code === 'weak_password' || message.includes('password should be')) return 'errors.weakPassword';
  if (code === 'email_address_invalid' || message.includes('invalid format') || message.includes('unable to validate email'))
    return 'errors.invalidEmail';
  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || message.includes('rate limit'))
    return 'errors.rateLimited';
  if (message.includes('row-level security') && message.includes('swipes')) return 'errors.sessionEnded';
  return 'errors.generic';
}

/**
 * Wirft den Supabase-Fehler weiter, damit React Query ihn erkennt.
 * Ohne Fehler liefert PostgREST bei Listen/`single()` immer Daten; void-RPCs liefern null.
 */
export function unwrap<R extends { data: unknown; error: unknown }>(result: R): NonNullable<R['data']> {
  if (result.error) throw result.error;
  return result.data as NonNullable<R['data']>;
}

/** Wie `unwrap`, aber für `maybeSingle()` – null bedeutet „kein Treffer“. */
export function unwrapMaybe<R extends { data: unknown; error: unknown }>(result: R): R['data'] | null {
  if (result.error) throw result.error;
  return result.data ?? null;
}
