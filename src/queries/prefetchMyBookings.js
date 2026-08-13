import { queryClient } from '../queryClient';
import { myVouchersQueryOptions } from './useMyVouchersQuery';
import { eventBookingsQueryOptions } from './useEventBookingsQuery';

const prefetchMyBookings = () => {
  queryClient.prefetchQuery(myVouchersQueryOptions);
  queryClient.prefetchInfiniteQuery(eventBookingsQueryOptions);
};

export default prefetchMyBookings;
