import React, {
  useMemo,
  useState,
  useCallback,
  useContext,
  useRef,
} from 'react';
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
import { BACKDROP_SOURCE, getArcApexOffset } from './backdropArc';

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile, loadProfile } = useContext(AppContext);

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

  const {
    refresh: refreshVouchers,
    handleClaim,
    refreshBCoins,
    handleCloseUdenModal,
  } = voucherData;
  const {
    fetchPopularEvents,
    fetchPopularCategories,
    fetchEventDetailsList,
    handleEventPress,
  } = eventsData;

  const fetchTabData = useCallback(
    tabId => {
      switch (tabId) {
        case TAB_IDS.POPULAR:
          return Promise.all([
            fetchPopularEvents(),
            fetchPopularCategories(),
            refreshVouchers(),
          ]);
        case TAB_IDS.EVENTS:
          return fetchEventDetailsList();
        case TAB_IDS.VOUCHERS:
          return refreshVouchers();
        default:
          return Promise.resolve();
      }
    },
    [
      fetchPopularEvents,
      fetchPopularCategories,
      fetchEventDetailsList,
      refreshVouchers,
    ],
  );

  const tabNav = useTabNavigation(fetchTabData);
  const storeSwitcher = useStoreSwitcher(applyStatusBar);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const activeTab = tabNav.activeTab;
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const tasks = [
        refreshVouchers(),
        fetchPopularEvents(),
        fetchPopularCategories(),
      ];
      if (activeTab === TAB_IDS.EVENTS) {
        tasks.push(fetchEventDetailsList());
      }
      await Promise.all(tasks);
    } catch (error) {
      logger.error('Ticket landing refresh failed:', error?.message);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshVouchers,
    fetchPopularEvents,
    fetchPopularCategories,
    fetchEventDetailsList,
    activeTab,
  ]);

  const handleMyBookingsPress = useCallback(() => {
    prefetchMyBookings();
    navigation.navigate('MyBookingsScreen');
  }, [navigation]);

  const gradientStyle = useMemo(
    () => [styles.statusBarGradient, { height: insets.top + 24 }],
    [insets.top],
  );

  const backdropImageStyle = useMemo(
    () => (activeTab === TAB_IDS.VOUCHERS ? undefined : styles.hiddenBackdrop),
    [activeTab],
  );

  // Window coordinate of the backdrop curve's apex, measured from the box the
  // image is actually painted into so it survives every screen size, notch and
  // the different things `window` means on iOS vs Android. The carousel arrows
  // are pinned to it. Re-runs on rotation and on any backdrop resize.
  const backdropRef = useRef(null);
  const [arcApexY, setArcApexY] = useState(null);
  const handleBackdropLayout = useCallback(() => {
    backdropRef.current?.measureInWindow((x, y, width, height) => {
      const apexOffset = getArcApexOffset(width, height);
      if (apexOffset == null) return;
      setArcApexY(y + apexOffset);
    });
  }, []);

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
      onClaim: handleClaim,
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
      onEventPress: handleEventPress,
      arcApexY,
    }),
    // Field-level deps: claiming a voucher (which flips modal state on
    // voucherData) must not rebuild the whole tab content.
    [
      fadeAnim,
      navigation,
      voucherData.carouselVouchers,
      voucherData.carouselLoading,
      voucherData.bCoins,
      voucherData.bCoinsLoading,
      voucherData.giftQuote,
      voucherData.giftQuoteLoading,
      handleClaim,
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
      handleEventPress,
      arcApexY,
    ],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />

      <View
        ref={backdropRef}
        onLayout={handleBackdropLayout}
        collapsable={false}
        style={styles.contentBg}
      >
        <ImageBackground
          source={BACKDROP_SOURCE}
          style={styles.backdrop}
          imageStyle={backdropImageStyle}
          resizeMode="cover"
        >
          <TicketLandingList
            navigation={navigation}
            insets={insets}
            profile={profile}
            activeTab={activeTab}
            handleTabChange={tabNav.handleTabChange}
            popularCategories={eventsData.popularCategories}
            scrollY={scrollY}
            scrollHandler={scrollHandler}
            tabContentStyle={tabNav.tabContentStyle}
            events={eventsData.events}
            eventsLoading={eventsData.eventsLoading}
            handleEventPress={handleEventPress}
            tabContentProps={tabContentProps}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </ImageBackground>
      </View>

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
        onPurchaseSettled={refreshBCoins}
        onClose={handleCloseUdenModal}
      />
      <BottomTabBar
        bookingsCount={voucherData.myVouchers.length}
        onHomePress={tabNav.handleGoHome}
        onMyBookingsPress={handleMyBookingsPress}
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
