import { useQuery } from '@tanstack/react-query';
import { getHomepageData } from '../api/homeService';
import { homeKeys } from './queryKeys';
import { transformHomepageResponse, extractPopupFromResponse } from './transformHomepageResponse';

const useHomepageDataQuery = (areaId) =>
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
  });

export default useHomepageDataQuery;
