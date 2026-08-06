import { useQuery } from '@tanstack/react-query';
import { getDashboardDataApi } from '../api/userService';
import { dashboardKeys } from './queryKeys';

const useDashboardQuery = (custId) =>
  useQuery({
    queryKey: dashboardKeys.dashboard(custId),
    queryFn: getDashboardDataApi,
    select: (response) => (response?.success ? response.data : undefined),
    enabled: !!custId,
    staleTime: 30 * 1000,
  });

export default useDashboardQuery;
