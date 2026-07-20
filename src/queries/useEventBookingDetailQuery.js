import { useQuery } from '@tanstack/react-query';
import { getEventBookingByIdApi } from '../api/eventService';
import { myBookingsKeys } from './queryKeys';

// Fetches the full booking detail (booking + event + session + items + tickets
// + payment) for a single booking via GET eventbooking/booking/{bookingId}.
// `select` unwraps the API envelope so consumers only see the `data` object.
const useEventBookingDetailQuery = (bookingId, { enabled = true } = {}) =>
  useQuery({
    queryKey: myBookingsKeys.eventDetail(bookingId),
    queryFn: () => getEventBookingByIdApi(bookingId),
    enabled: enabled && bookingId != null,
    staleTime: 30 * 1000, // status (checked-in / paid) can change soon after booking
    select: res => res?.data ?? null,
  });

export default useEventBookingDetailQuery;
