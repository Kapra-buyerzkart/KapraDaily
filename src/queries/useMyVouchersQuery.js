import { useQuery } from '@tanstack/react-query';
import { getMyVouchersApi } from '../api/voucherService';
import { myBookingsKeys } from './queryKeys';

export const myVouchersQueryOptions = {
  queryKey: myBookingsKeys.vouchers(),
  queryFn: getMyVouchersApi,
  staleTime: 60 * 1000,
};

const useMyVouchersQuery = ({ enabled = true } = {}) =>
  useQuery({
    ...myVouchersQueryOptions,
    select: response => response?.data?.items ?? [],
    enabled,
  });

export default useMyVouchersQuery;
