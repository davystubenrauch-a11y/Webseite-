import { storage } from '@/lib/storage';

const KEY = 'gm.pendingInvite';

/** Einladungscode merken, wenn ein Link vor dem Login geöffnet wurde. */
export const pendingInvite = {
  set: (code: string) => storage.set(KEY, code),
  take: async (): Promise<string | null> => {
    const code = await storage.get(KEY);
    if (code) await storage.remove(KEY);
    return code;
  },
};
