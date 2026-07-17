import { useQuery } from '@tanstack/react-query';
import { getMyVouchersApi } from '../api/voucherService';
import { myBookingsKeys } from './queryKeys';

const useMyVouchersQuery = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: myBookingsKeys.vouchers(),
    queryFn: getMyVouchersApi,
    select: response => response?.data?.items ?? [],
    staleTime: 60 * 1000, // claim status can change right after a redeem — don't hold too long
    enabled,
  });

export default useMyVouchersQuery;
