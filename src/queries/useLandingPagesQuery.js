import { useQuery } from '@tanstack/react-query';
import { getLandingPagesApi } from '../api/landingPageService';
import { landingPageKeys } from './queryKeys';

const useLandingPagesQuery = () =>
  useQuery({
    queryKey: landingPageKeys.landingPages(),
    queryFn: async () => {
      try {
        return await getLandingPagesApi();
      } catch (error) {
        console.log('[useLandingPagesQuery] Error:', {
          message: error?.message,
          status: error?.status || error?.response?.status,
          data: error?.data || error?.response?.data,
        });
        throw error;
      }
    },
    select: response => {
      console.log(
        '[useLandingPagesQuery] Response:',
        response,
      );
      return response?.success ? response.data : undefined;
    },
  });

export default useLandingPagesQuery;
