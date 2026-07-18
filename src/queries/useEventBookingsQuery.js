import { useInfiniteQuery } from '@tanstack/react-query';
import { getEventBookingListApi } from '../api/eventService';
import { myBookingsKeys } from './queryKeys';

export const EVENTS_PAGE_SIZE = 10;

const extractItems = page =>
  Array.isArray(page?.data?.items)
    ? page.data.items
    : Array.isArray(page?.data)
    ? page.data
    : [];

// Shared so the screen hook and the prefetch helper use identical key/fn/paging.
export const eventBookingsQueryOptions = {
  queryKey: myBookingsKeys.events(),
  queryFn: ({ pageParam }) =>
    getEventBookingListApi({ pageNumber: pageParam, pageSize: EVENTS_PAGE_SIZE }),
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) =>
    extractItems(lastPage).length < EVENTS_PAGE_SIZE
      ? undefined
      : allPages.length + 1,
  staleTime: 60 * 1000, // booking status (pending/confirmed) can change soon after purchase
};

const useEventBookingsQuery = ({ enabled = true } = {}) =>
  useInfiniteQuery({ ...eventBookingsQueryOptions, enabled });

export { extractItems };
export default useEventBookingsQuery;
