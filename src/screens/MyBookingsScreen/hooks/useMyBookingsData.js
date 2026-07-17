import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { AppContext } from '../../../context/appContext';
import useDashboardQuery from '../../../queries/useDashboardQuery';
import useMyVouchersQuery from '../../../queries/useMyVouchersQuery';
import useEventBookingsQuery, {
  extractItems,
} from '../../../queries/useEventBookingsQuery';
import { BOOKING_TAB_IDS } from '../components/BookingCategoryTabs';

const useMyBookingsData = () => {
  const { profile } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [activeTab, setActiveTab] = useState(BOOKING_TAB_IDS.ALL);

  const pressTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(pressTimeoutRef.current), []);

  const wantsVouchers =
    activeTab === BOOKING_TAB_IDS.ALL || activeTab === BOOKING_TAB_IDS.VOUCHERS;
  const wantsEvents =
    activeTab === BOOKING_TAB_IDS.ALL || activeTab === BOOKING_TAB_IDS.EVENTS;

  const { data: dashboardData, refetch: refetchDashboard } = useDashboardQuery(
    profile?.custId,
  );
  const {
    data: vouchers = [],
    isLoading: vouchersLoading,
    refetch: refetchVouchers,
  } = useMyVouchersQuery({ enabled: wantsVouchers });
  const {
    data: eventsPages,
    isLoading: eventsLoading,
    isFetchingNextPage: eventsLoadingMore,
    hasNextPage,
    fetchNextPage,
    refetch: refetchEvents,
  } = useEventBookingsQuery({ enabled: wantsEvents });

  const eventBookings = useMemo(
    () => eventsPages?.pages.flatMap(extractItems) ?? [],
    [eventsPages],
  );

  const handleLoadMoreEvents = useCallback(() => {
    if (hasNextPage && !eventsLoadingMore) {
      fetchNextPage();
    }
  }, [hasNextPage, eventsLoadingMore, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const tasks = [refetchDashboard()];
      if (activeTab !== BOOKING_TAB_IDS.EVENTS) tasks.push(refetchVouchers());
      if (activeTab !== BOOKING_TAB_IDS.VOUCHERS) tasks.push(refetchEvents());
      await Promise.all(tasks);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, refetchDashboard, refetchVouchers, refetchEvents]);

  const handleVoucherPress = useCallback(voucher => {
    clearTimeout(pressTimeoutRef.current);
    pressTimeoutRef.current = setTimeout(
      () => setSelectedVoucher(voucher),
      Platform.OS === 'ios' ? 400 : 250,
    );
  }, []);

  const handleCloseVoucherSheet = useCallback(
    () => setSelectedVoucher(null),
    [],
  );

  return {
    vouchers,
    vouchersLoading,
    eventBookings,
    eventsLoading,
    eventsLoadingMore,
    refreshing,
    bCoins: dashboardData?.wallet?.bCoins ?? 0,
    selectedVoucher,
    activeTab,
    setActiveTab,
    handleLoadMoreEvents,
    handleRefresh,
    handleVoucherPress,
    handleCloseVoucherSheet,
  };
};

export default useMyBookingsData;
