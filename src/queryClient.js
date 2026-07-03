import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 min — catalog/banners change a few times/day
      gcTime: 24 * 60 * 60 * 1000,  // keep a full day in memory + persisted cache
      retry: 2,
      refetchOnReconnect: true,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'KAPRADAILY_QUERY_CACHE',
  throttleTime: 1000,
});

// Query keys under these namespaces are excluded from disk persistence:
// 'dashboard' (wallet/coin balance — financial, must not look "instant" off stale cache),
// 'categoryProducts' (per-tap lazy fetch, cheap to refetch, low value to persist),
// 'search' (keystroke/browse-driven, high-cardinality, low value once the app restarts).
export const queryPersistOptions = {
  persister: asyncStoragePersister,
  maxAge: 24 * 60 * 60 * 1000,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.state.status === 'success' &&
      !['dashboard', 'categoryProducts', 'search'].includes(query.queryKey[0]),
  },
};
