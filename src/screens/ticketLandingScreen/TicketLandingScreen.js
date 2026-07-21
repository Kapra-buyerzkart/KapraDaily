import React, { useMemo, useState, useCallback } from 'react';
import { Animated, StatusBar, View, ImageBackground } from 'react-native';
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_IDS } from '@/components/events/EventCategoryTabs';
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

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const applyStatusBar = useStatusBarFocus();
  const { fadeAnim, imageOpacity, handleImageLoad } = useHeroFade();
  const voucherData = useVoucherData();
  const eventsData = useEventsData(navigation);
  const tabNav = useTabNavigation(eventsData.fetchEventDetailsList);
  const storeSwitcher = useStoreSwitcher(applyStatusBar);

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
      const tasks = [voucherData.refresh(), eventsData.fetchPopularEvents()];
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

  const imageBgStyle = useMemo(
    () => [styles.imageBg, { opacity: imageOpacity }],
    [imageOpacity],
  );
  const gradientStyle = useMemo(
    () => [styles.statusBarGradient, { height: insets.top + 24 }],
    [insets.top],
  );

  const tabContentProps = useMemo(
    () => ({
      fadeAnim,
      vouchers: voucherData.carouselVouchers,
      loading: voucherData.carouselLoading,
      bCoins: voucherData.bCoins,
      giftQuote: voucherData.giftQuote,
      giftQuoteLoading: voucherData.giftQuoteLoading,
      onClaim: voucherData.handleClaim,
      onGoToVouchers: tabNav.handleGoToVouchers,
      onGoToSports: tabNav.handleGoToSports,
      popularEvents: eventsData.popularEvents,
      popularEventsLoading: eventsData.popularEventsLoading,
      onEventPress: eventsData.handleEventPress,
    }),
    [
      fadeAnim,
      voucherData,
      tabNav.handleGoToVouchers,
      tabNav.handleGoToSports,
      eventsData.popularEvents,
      eventsData.popularEventsLoading,
      eventsData.handleEventPress,
    ],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={imageBgStyle}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <TicketLandingList
          navigation={navigation}
          insets={insets}
          bCoins={voucherData.bCoins}
          activeTab={tabNav.activeTab}
          handleTabChange={tabNav.handleTabChange}
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
      </AnimatedImageBackground>

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
