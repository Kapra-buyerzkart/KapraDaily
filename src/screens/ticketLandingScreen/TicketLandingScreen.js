import React, { useMemo, useState, useCallback, useContext } from 'react';
import { ImageBackground, StatusBar, View } from 'react-native';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';
import { AppContext } from '../../context/appContext';
import logger from '../../utils/logger';
import styles from './styles';
import TicketLandingList from './components/TicketLandingList';
import UdenTicketModal from './components/UdenTicketModal';
import BottomTabBar from './components/BottomTabBar';
import ServiceSwitcherModal from '../../components/ServiceSwitcherModal';
import useVoucherData from './hooks/useVoucherData';
import useEventsData from './hooks/useEventsData';
import useTabNavigation from './hooks/useTabNavigation';
import useStatusBarFocus from './hooks/useStatusBarFocus';
import useHeroFade from './hooks/useHeroFade';
import useStoreSwitcher from './hooks/useStoreSwitcher';
import prefetchMyBookings from '../../queries/prefetchMyBookings';

const SCREEN_BG = require('../../assets/images/movieTicket/ticketLandingBg.png');

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile, loadProfile } = useContext(AppContext);

  // The context profile can still be a guest/stale object when we land here
  // (this screen doesn't own the initial load). Refresh it on focus so the
  // header greets the logged-in user by name instead of falling back to "Guest".
  useFocusEffect(
    useCallback(() => {
      if (!profile?.custName) {
        loadProfile();
      }
    }, [profile?.custName, loadProfile]),
  );

  const applyStatusBar = useStatusBarFocus();
  const { fadeAnim } = useHeroFade();
  const voucherData = useVoucherData();
  const eventsData = useEventsData(navigation);
  const tabNav = useTabNavigation(eventsData.fetchEventDetailsList);
  const storeSwitcher = useStoreSwitcher(applyStatusBar);

  console.log(eventsData, '====eventsdata');
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const tasks = [
        voucherData.refresh(),
        eventsData.fetchPopularEvents(),
        eventsData.fetchPopularCategories(),
      ];
      if (tabNav.activeTab === TAB_IDS.EVENTS) {
        tasks.push(eventsData.fetchEventDetailsList());
      }
      await Promise.all(tasks);
    } catch (error) {
      logger.error('Ticket landing refresh failed:', error?.message);
    } finally {
      setRefreshing(false);
    }
  }, [voucherData, eventsData, tabNav.activeTab]);

  const gradientStyle = useMemo(
    () => [styles.statusBarGradient, { height: insets.top + 24 }],
    [insets.top],
  );

  // The artwork backdrop belongs to the Vouchers tab only; every other tab
  // sits on the flat background. Hide the image instead of swapping the
  // wrapper so the list isn't remounted (and scrolled back to top) on tab
  // changes.
  const backdropImageStyle = useMemo(
    () =>
      tabNav.activeTab === TAB_IDS.VOUCHERS ? undefined : styles.hiddenBackdrop,
    [tabNav.activeTab],
  );

  const tabContentProps = useMemo(
    () => ({
      fadeAnim,
      navigation,
      vouchers: voucherData.carouselVouchers,
      loading: voucherData.carouselLoading,
      bCoins: voucherData.bCoins,
      bCoinsLoading: voucherData.bCoinsLoading,
      giftQuote: voucherData.giftQuote,
      giftQuoteLoading: voucherData.giftQuoteLoading,
      onClaim: voucherData.handleClaim,
      onGoToVouchers: tabNav.handleGoToVouchers,
      onGoToSports: tabNav.handleGoToSports,
      popularEvents: eventsData.popularEvents,
      popularEventsLoading: eventsData.popularEventsLoading,
      banners: eventsData.banners,
      bannersLoading: eventsData.bannersLoading,
      popularVouchers: eventsData.popularVouchers,
      moreToExplore: eventsData.moreToExplore,
      popularCategories: eventsData.popularCategories,
      popularCategoriesLoading: eventsData.popularCategoriesLoading,
      onEventPress: eventsData.handleEventPress,
    }),
    [
      fadeAnim,
      navigation,
      voucherData,
      tabNav.handleGoToVouchers,
      tabNav.handleGoToSports,
      eventsData.popularEvents,
      eventsData.popularEventsLoading,
      eventsData.banners,
      eventsData.bannersLoading,
      eventsData.popularVouchers,
      eventsData.moreToExplore,
      eventsData.popularCategories,
      eventsData.popularCategoriesLoading,
      eventsData.handleEventPress,
    ],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />

      <ImageBackground
        source={SCREEN_BG}
        style={styles.contentBg}
        imageStyle={backdropImageStyle}
        resizeMode="cover"
      >
        <TicketLandingList
          navigation={navigation}
          insets={insets}
          profile={profile}
          activeTab={tabNav.activeTab}
          handleTabChange={tabNav.handleTabChange}
          popularCategories={eventsData.popularCategories}
          scrollY={scrollY}
          scrollHandler={scrollHandler}
          tabContentStyle={tabNav.tabContentStyle}
          events={eventsData.events}
          eventsLoading={eventsData.eventsLoading}
          handleEventPress={eventsData.handleEventPress}
          tabContentProps={tabContentProps}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </ImageBackground>

      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
        style={gradientStyle}
      />

      <UdenTicketModal
        visible={voucherData.modalVisible}
        voucher={voucherData.claimedVoucher}
        bCoins={voucherData.bCoins}
        initialQuoteData={voucherData.claimedQuoteData}
        onPurchaseSettled={voucherData.refreshBCoins}
        onClose={voucherData.handleCloseUdenModal}
      />
      <BottomTabBar
        bookingsCount={voucherData.myVouchers.length}
        onHomePress={tabNav.handleGoHome}
        onMyBookingsPress={() => {
          prefetchMyBookings();
          navigation.navigate('MyBookingsScreen');
        }}
        onStorePress={storeSwitcher.open}
      />

      <ServiceSwitcherModal
        visible={storeSwitcher.visible}
        onClose={storeSwitcher.close}
        excludeServiceId="movie"
      />
    </View>
  );
};

export default TicketLandingScreen;
