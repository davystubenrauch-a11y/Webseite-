import * as Linking from 'expo-linking';

import { env } from '@/lib/env';

/** Einladungslink: bevorzugt die eigene Domain (Universal/App Link), sonst das App-Schema. */
export function inviteLink(code: string): string {
  if (env.inviteBaseUrl) return `${env.inviteBaseUrl.replace(/\/$/, '')}/join/${code}`;
  return Linking.createURL(`join/${code}`);
}

/** Akzeptiert Codes mit Leerzeichen, Bindestrichen oder ganze Links. */
export function normalizeInviteCode(input: string): string {
  const fromLink = input.match(/join\/([A-Za-z0-9-]+)/)?.[1] ?? input;
  return fromLink.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
}
