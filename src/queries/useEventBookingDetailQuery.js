import { useQuery } from '@tanstack/react-query';
import { getEventBookingByIdApi } from '../api/eventService';
import { myBookingsKeys } from './queryKeys';

const useEventBookingDetailQuery = (bookingId, { enabled = true } = {}) =>
  useQuery({
    queryKey: myBookingsKeys.eventDetail(bookingId),
    queryFn: () => getEventBookingByIdApi(bookingId),
    enabled: enabled && bookingId != null,
    staleTime: 30 * 1000,
    select: res => res?.data ?? null,
  });

export default useEventBookingDetailQuery;
