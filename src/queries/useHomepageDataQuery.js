import { useQuery } from '@tanstack/react-query';
import { getHomepageData } from '../api/homeService';
import { homeKeys } from './queryKeys';
import {
  transformHomepageResponse,
  extractPopupFromResponse,
} from './transformHomepageResponse';

const useHomepageDataQuery = areaId =>
  useQuery({
    queryKey: homeKeys.homepage(areaId),
    queryFn: async () => {
      try {
        return await getHomepageData(areaId, 100);
      } catch (error) {
        const errBody = error?.data || error?.response?.data || error;
        error.popup = extractPopupFromResponse(errBody);
        throw error;
      }
    },
    select: transformHomepageResponse,
    enabled: areaId !== undefined,
    staleTime: 60 * 1000, // banners/catalog can change intra-day; revalidate sooner than the 5 min default
    refetchOnMount: 'always', // paint persisted cache instantly, then revalidate on every HomeScreen mount
    retry: (failureCount, error) => {
      const status = error?.status ?? error?.response?.status;
      if (status === 404 || status === 400) return false;
      return failureCount < 2;
    },
  });

export default useHomepageDataQuery;
