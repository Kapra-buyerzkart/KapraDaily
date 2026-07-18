import { useQuery } from '@tanstack/react-query';
import { getMyVouchersApi } from '../api/voucherService';
import { myBookingsKeys } from './queryKeys';

// Shared so the screen hook and the prefetch helper use identical key/fn/staleTime.
export const myVouchersQueryOptions = {
  queryKey: myBookingsKeys.vouchers(),
  queryFn: getMyVouchersApi,
  staleTime: 60 * 1000, // claim status can change right after a redeem — don't hold too long
};

const useMyVouchersQuery = ({ enabled = true } = {}) =>
  useQuery({
    ...myVouchersQueryOptions,
    select: response => response?.data?.items ?? [],
    enabled,
  });

export default useMyVouchersQuery;
