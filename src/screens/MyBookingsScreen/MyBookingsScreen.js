import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '@/assets/images';
import CoinBalance from '@/components/events/CoinBalance';
import { getMyVouchersApi } from '../../api/voucherService';
import { getEventBookingListApi } from '../../api/eventService';
import { getDashboardDataApi } from '../../api/userService';
import logger from '../../utils/logger';
import VoucherGrid from '../ticketLandingScreen/components/VoucherGrid';
import VoucherBottomSheet from '../ticketLandingScreen/components/VoucherBottomSheet';
import BookingCategoryTabs, {
  BOOKING_TAB_IDS,
} from './components/BookingCategoryTabs';
import EventBookingCard from './components/EventBookingCard';
import EventBookingList from './components/EventBookingList';

const BG_ASPECT_RATIO = 430 / 2078;
const EVENTS_PAGE_SIZE = 10;

// TODO: REMOVE — dummy bookings to preview the events UI until the API has data
const DUMMY_EVENT_BOOKINGS = [
  {
    bookingId: 'BK-1001',
    eventName: 'Sunburn Arena ft. Martin Garrix',
    sessionStart: '2026-08-14T19:00:00',
    venueName: 'Jawaharlal Nehru Stadium, Kochi',
    totalTickets: 2,
    totalAmount: 2999,
    bookingStatus: 'Confirmed',
  },
  {
    bookingId: 'BK-1002',
    eventName: 'Kerala Blasters vs Bengaluru FC',
    sessionStart: '2026-08-22T17:30:00',
    venueName: 'Greenfield Stadium, Trivandrum',
    totalTickets: 4,
    totalAmount: 1596,
    bookingStatus: 'Pending',
  },
  {
    bookingId: 'BK-1003',
    eventName: 'Vijay Antony Live in Concert',
    sessionStart: '2026-09-05T18:00:00',
    venueName: 'Adlux Convention Centre, Angamaly',
    totalTickets: 1,
    totalAmount: 799,
    bookingStatus: 'Cancelled',
  },
  {
    bookingId: 'BK-1004',
    eventName: 'Comedy Night with Karthik Kurup',
    sessionStart: '2026-09-12T20:00:00',
    venueName: 'Kairali Theatre, Kochi',
    totalTickets: 3,
    totalAmount: 1497,
    bookingStatus: 'Confirmed',
  },
];

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);
  const [eventBookings, setEventBookings] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsLoadingMore, setEventsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bCoins, setBCoins] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [activeTab, setActiveTab] = useState(BOOKING_TAB_IDS.ALL);

  const eventsPagingRef = useRef({ page: 1, hasMore: true, fetching: false });

  const pressTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(pressTimeoutRef.current), []);

  const fetchVouchers = useCallback((options = {}) => {
    if (!options.silent) setVouchersLoading(true);
    return getMyVouchersApi()
      .then(res => {
        if (res?.data?.items) setVouchers(res.data.items);
      })
      .catch(err => logger.error('Failed to load my vouchers:', err?.message))
      .finally(() => setVouchersLoading(false));
  }, []);

  const fetchEventBookings = useCallback(async (page = 1, options = {}) => {
    const paging = eventsPagingRef.current;
    if (paging.fetching) return;
    paging.fetching = true;

    if (page === 1) {
      paging.hasMore = true;
      if (!options.silent) setEventsLoading(true);
    } else {
      setEventsLoadingMore(true);
    }

    try {
      const res = await getEventBookingListApi({
        pageNumber: page,
        pageSize: EVENTS_PAGE_SIZE,
      });
      const items = Array.isArray(res?.data?.items)
        ? res.data.items
        : Array.isArray(res?.data)
        ? res.data
        : [];
      // TODO: REMOVE dummy fallback once the API returns real bookings
      const list =
        page === 1 && items.length === 0 ? DUMMY_EVENT_BOOKINGS : items;
      setEventBookings(prev => (page === 1 ? list : [...prev, ...list]));
      paging.page = page;
      if (items.length < EVENTS_PAGE_SIZE) paging.hasMore = false;
    } catch (err) {
      logger.error('Failed to load event bookings:', err?.message);
      // TODO: REMOVE dummy fallback once the API returns real bookings
      if (page === 1) setEventBookings(DUMMY_EVENT_BOOKINGS);
      paging.hasMore = false;
    } finally {
      paging.fetching = false;
      setEventsLoading(false);
      setEventsLoadingMore(false);
    }
  }, []);

  const handleLoadMoreEvents = useCallback(() => {
    const paging = eventsPagingRef.current;
    if (!paging.fetching && paging.hasMore) {
      fetchEventBookings(paging.page + 1);
    }
  }, [fetchEventBookings]);

  useEffect(() => {
    if (activeTab === BOOKING_TAB_IDS.ALL) {
      fetchVouchers();
      fetchEventBookings(1);
    } else if (activeTab === BOOKING_TAB_IDS.EVENTS) {
      fetchEventBookings(1);
    } else if (activeTab === BOOKING_TAB_IDS.VOUCHERS) {
      fetchVouchers();
    }
  }, [activeTab, fetchVouchers, fetchEventBookings]);

  const fetchBCoins = useCallback(() => {
    return getDashboardDataApi()
      .then(res => {
        if (res?.data?.wallet?.bCoins !== undefined) {
          setBCoins(res.data.wallet.bCoins);
        }
      })
      .catch(err => logger.error('Failed to refresh bCoins:', err?.message));
  }, []);

  useEffect(() => {
    fetchBCoins();
  }, [fetchBCoins]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const tasks = [fetchBCoins()];
    if (activeTab !== BOOKING_TAB_IDS.EVENTS) {
      tasks.push(fetchVouchers({ silent: true }));
    }
    if (activeTab !== BOOKING_TAB_IDS.VOUCHERS) {
      tasks.push(fetchEventBookings(1, { silent: true }));
    }
    await Promise.all(tasks);
    setRefreshing(false);
  }, [activeTab, fetchBCoins, fetchVouchers, fetchEventBookings]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

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

  const isAllTab = activeTab === BOOKING_TAB_IDS.ALL;
  const isEventsTab = activeTab === BOOKING_TAB_IDS.EVENTS;

  const allTabHeader = useMemo(() => {
    if (!isAllTab) return null;
    return (
      <View>
        {eventBookings.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Events</Text>
            {eventBookings.map((booking, index) => (
              <EventBookingCard
                key={String(booking?.bookingId || booking?.id || index)}
                item={booking}
                index={index}
              />
            ))}
          </>
        )}
        <Text style={styles.sectionTitle}>Vouchers</Text>
      </View>
    );
  }, [isAllTab, eventBookings]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={images.bookingtabbg}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={16}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My bookings</Text>
        <CoinBalance bCoins={bCoins} />
      </View>

      <BookingCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isEventsTab ? (
        <EventBookingList
          bookings={eventBookings}
          loading={eventsLoading}
          loadingMore={eventsLoadingMore}
          onEndReached={handleLoadMoreEvents}
          bottomInset={insets.bottom}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <VoucherGrid
          vouchers={vouchers}
          loading={isAllTab ? vouchersLoading || eventsLoading : vouchersLoading}
          onVoucherPress={handleVoucherPress}
          bottomInset={insets.bottom}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={allTabHeader}
          emptyText={
            isAllTab && eventBookings.length === 0
              ? 'No bookings yet'
              : 'No vouchers yet'
          }
        />
      )}

      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={handleCloseVoucherSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: BG_ASPECT_RATIO,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 12,
  },
});

export default React.memo(MyBookingsScreen);
