import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { AppError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

/** Ziel-URL für OAuth, Bestätigungs- und Passwort-Links (muss in Supabase als Redirect-URL erlaubt sein). */
export function authRedirectUrl(type?: 'recovery' | 'signup'): string {
  return Linking.createURL('auth/callback', type ? { queryParams: { type } } : undefined);
}

const handledCodes = new Set<string>();

/** Tauscht einen PKCE-Code genau einmal gegen eine Sitzung (Callback-Screen und Browser-Session können beide feuern). */
export async function exchangeCode(code: string): Promise<void> {
  if (handledCodes.has(code)) return;
  handledCodes.add(code);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw error;
  }
}

export function codeFromUrl(url: string): string | null {
  const { queryParams } = Linking.parse(url);
  const code = queryParams?.code;
  return typeof code === 'string' ? code : null;
}

export async function signInWithOAuthBrowser(provider: 'google' | 'apple'): Promise<void> {
  const redirectTo = authRedirectUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true, queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined },
  });
  if (error) throw error;
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') throw new AppError('errors.oauthCancelled');
  const code = codeFromUrl(result.url);
  if (!code) throw new AppError('errors.generic');
  await exchangeCode(code);
}

export async function isNativeAppleAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/** „Mit Apple anmelden“ – nativ auf iOS, sonst über den Browser. */
export async function signInWithApple(): Promise<void> {
  if (!(await isNativeAppleAvailable())) {
    await signInWithOAuthBrowser('apple');
    return;
  }
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      nonce: hashedNonce,
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') throw new AppError('errors.oauthCancelled');
    throw error;
  }
  if (!credential.identityToken) throw new AppError('errors.generic');
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;

  // Apple liefert den Namen nur beim allerersten Login – dann direkt ins Profil übernehmen.
  const givenName = credential.fullName?.givenName?.trim();
  if (givenName && data.user) {
    await supabase.from('profiles').update({ display_name: givenName.slice(0, 40) }).eq('id', data.user.id).eq('display_name', '');
  }
}
