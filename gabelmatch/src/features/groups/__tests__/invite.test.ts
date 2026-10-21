/* eslint-disable import/first -- jest.mock muss vor dem Import stehen */
jest.mock('expo-linking', () => ({ createURL: (path: string) => `gabelmatch://${path}` }));

import { inviteLink, normalizeInviteCode } from '../invite';

describe('Einladungscodes', () => {
  it('normalisiert Eingaben', () => {
    expect(normalizeInviteCode(' abc-123 ')).toBe('ABC123');
    expect(normalizeInviteCode('abc 12 3')).toBe('ABC123');
    expect(normalizeInviteCode('https://gabelmatch.app/join/xyz789')).toBe('XYZ789');
    expect(normalizeInviteCode('gabelmatch://join/K7M2PQ')).toBe('K7M2PQ');
  });

  it('baut einen Link über das App-Schema, wenn keine Domain konfiguriert ist', () => {
    expect(inviteLink('ABC123')).toBe('gabelmatch://join/ABC123');
  });
});
