import { queryClient } from '../queryClient';
import { myVouchersQueryOptions } from './useMyVouchersQuery';
import { eventBookingsQueryOptions } from './useEventBookingsQuery';

// Warm the My Bookings caches before navigating there so the list renders on the
// first frame alongside the header/tabs instead of showing a loader afterward.
// Fire-and-forget: react-query skips the fetch when cached data is still fresh
// (60s staleTime), so calling this on every tap is cheap.
const prefetchMyBookings = () => {
  queryClient.prefetchQuery(myVouchersQueryOptions);
  queryClient.prefetchInfiniteQuery(eventBookingsQueryOptions);
};

export default prefetchMyBookings;
