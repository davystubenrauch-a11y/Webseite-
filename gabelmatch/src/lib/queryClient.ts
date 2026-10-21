import { QueryClient } from '@tanstack/react-query';

function isClientError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  const code = (error as { code?: string } | null)?.code ?? '';
  return (typeof status === 'number' && status >= 400 && status < 500) || /^(P0001|42501|PGRST)/.test(code);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
    },
    mutations: { retry: 0 },
  },
});
