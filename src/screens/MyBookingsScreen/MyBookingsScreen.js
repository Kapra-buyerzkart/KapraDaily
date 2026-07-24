import React, { useCallback } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import images from '@/assets/images';
import VoucherGrid from '../ticketLandingScreen/components/VoucherGrid';
import VoucherBottomSheet from '../ticketLandingScreen/components/VoucherBottomSheet';
import BookingCategoryTabs, {
  BOOKING_TAB_IDS,
} from './components/BookingCategoryTabs';
import EventBookingList from './components/EventBookingList';
import MyBookingsHeader from './components/MyBookingsHeader';
import AllTabListHeader from './components/AllTabListHeader';
import useMyBookingsData from './hooks/useMyBookingsData';
import COLORS from '@/styles/colors';

const BG_ASPECT_RATIO = 430 / 2078;

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    vouchers,
    vouchersLoading,
    eventBookings,
    eventsLoading,
    eventsLoadingMore,
    refreshing,
    bCoins,
    selectedVoucher,
    activeTab,
    setActiveTab,
    handleLoadMoreEvents,
    handleRefresh,
    handleVoucherPress,
    handleCloseVoucherSheet,
  } = useMyBookingsData();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const isAllTab = activeTab === BOOKING_TAB_IDS.ALL;
  const isEventsTab = activeTab === BOOKING_TAB_IDS.EVENTS;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {/* <Image
          source={images.bookingtabbg}
          style={styles.bgImage}
          resizeMode="cover"
        /> */}
        <MyBookingsHeader
          topInset={insets.top || 20}
          bCoins={bCoins}
          onBack={handleBack}
        />

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
            loading={
              isAllTab ? vouchersLoading || eventsLoading : vouchersLoading
            }
            onVoucherPress={handleVoucherPress}
            bottomInset={insets.bottom}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={
              isAllTab ? (
                <AllTabListHeader eventBookings={eventBookings} />
              ) : null
            }
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
});

export default React.memo(MyBookingsScreen);
