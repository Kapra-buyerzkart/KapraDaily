import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Animated,
  StatusBar,
  View,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import EventHeader from '@/components/events/EventHeader';
import EventCard from '@/components/events/EventCard';
import LoadingSkeleton from '@/components/events/LoadingSkeleton';
import EventCategoryTabs, {
  TAB_IDS,
} from '@/components/events/EventCategoryTabs';
import EmptyState from '@/components/events/EmptyState';
import PopularTab from './components/PopularTab';
import CardCarousel from './components/CardCarousel';
import UdenTicketModal from './components/UdenTicketModal';
import VoucherBottomSheet from './components/VoucherBottomSheet';
import BottomTabBar from './components/BottomTabBar';
import MyBookingsModal from './components/MyBookingsModal';
import ServiceSwitcherModal from '../../components/ServiceSwitcherModal';
import {
  getVouchersApi,
  getVoucherByIdApi,
  getVoucherQuoteApi,
  getMyVouchersApi,
} from '../../api/voucherService';
import { getDashboardDataApi } from '../../api/userService';
import { getEventDetailsListApi } from '../../api/eventService';
import logger from '../../utils/logger';
import CONFIG from '../../globals/config';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const EVENTS_ICON = require('../../assets/events/Group 1000004805.png');
const SPORTS_ICON = require('../../assets/events/Group 1000004803.png');
const BILLS_ICON = require('../../assets/events/Group 1000004804.png');

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [imageOpacity] = useState(() => new Animated.Value(0));
  const [activeTab, setActiveTab] = useState(TAB_IDS.POPULAR);
  const tabAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [claimedVoucher, setClaimedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [carouselVouchers, setCarouselVouchers] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [myVouchers, setMyVouchers] = useState([]);
  const [myVouchersLoading, setMyVouchersLoading] = useState(false);
  const [myBookingsVisible, setMyBookingsVisible] = useState(false);
  const [storeSwitcherVisible, setStoreSwitcherVisible] = useState(false);
  const [bCoins, setBCoins] = useState(0);
  const [claimedQuoteData, setClaimedQuoteData] = useState(null);
  const [giftQuote, setGiftQuote] = useState(null);
  const [giftQuoteLoading, setGiftQuoteLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const applyStatusBar = useCallback(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      applyStatusBar();
    }, [applyStatusBar]),
  );

  const refreshBCoins = useCallback(() => {
    getDashboardDataApi()
      .then(res => {
        if (res?.data?.wallet?.bCoins !== undefined) {
          setBCoins(res.data.wallet.bCoins);
        }
      })
      .catch(err => logger.error('Failed to refresh bCoins:', err?.message));
  }, []);

  useEffect(() => {
    setCarouselLoading(true);
    getVouchersApi()
      .then(res => {
        if (res?.data?.items) {
          setCarouselVouchers(res.data.items);
        }
      })
      .catch(err => logger.error('Failed to load vouchers:', err?.message))
      .finally(() => setCarouselLoading(false));
    refreshBCoins();
  }, [refreshBCoins]);

  useEffect(() => {
    setMyVouchersLoading(true);
    getMyVouchersApi()
      .then(res => {
        if (res?.data?.items) {
          setMyVouchers(res.data.items);
        }
      })
      .catch(err => logger.error('Failed to load my vouchers:', err?.message))
      .finally(() => setMyVouchersLoading(false));
  }, []);

  useEffect(() => {
    const uris = [...carouselVouchers, ...myVouchers]
      .map(item => item?.imageUrl || item?.image)
      .filter(value => typeof value === 'string' && value.length > 0)
      .map(value =>
        value.startsWith('http') ? value : CONFIG.image_base_url + value,
      );

    uris.forEach(uri => Image.prefetch(uri));
  }, [carouselVouchers, myVouchers]);

  useEffect(() => {
    const featured = carouselVouchers?.[0];
    if (!featured?.voucherId) {
      setGiftQuote(null);
      return undefined;
    }
    let cancelled = false;
    setGiftQuoteLoading(true);
    getVoucherQuoteApi(featured.voucherId, 1, bCoins)
      .then(res => {
        if (!cancelled && res?.success) setGiftQuote(res.data);
      })
      .catch(err =>
        logger.error('Failed to load gift card quote:', err?.message),
      )
      .finally(() => {
        if (!cancelled) setGiftQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [carouselVouchers, bCoins]);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleClaim = voucher => {
    setClaimedQuoteData(null);
    Promise.all([
      getVoucherByIdApi(voucher?.voucherId),
      getVoucherQuoteApi(voucher?.voucherId, 1, bCoins),
    ])
      .then(([voucherRes, quoteRes]) => {
        if (voucherRes?.data) {
          setClaimedVoucher(voucherRes.data);
          if (quoteRes?.success) setClaimedQuoteData(quoteRes.data);
          setModalVisible(true);
        }
      })
      .catch(err => logger.error('Failed to claim voucher:', err?.message));
  };

  const handleGoHome = () => {
    handleTabChange(TAB_IDS.POPULAR);
  };

  const handleOpenStoreSwitcher = () => {
    setStoreSwitcherVisible(true);
  };

  const fetchEventDetailsList = useCallback(() => {
    console.log('fetchEventDetailsList: called');
    setEventsLoading(true);
    getEventDetailsListApi()
      .then(res => {
        console.log('Event list raw response:', res);
        const items = res?.data?.items || res?.data || [];
        console.log('Event list data:', items);
        setEvents(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        console.log('Event list error:', err?.message, err);
        logger.error('Failed to load event details list:', err?.message);
        setEvents([]);
      })
      .finally(() => setEventsLoading(false));
  }, []);

  const handleEventPress = useCallback(
    event => {
      console.log('EventCard onPress data:', event);
      const eventId = event?.eventId ?? event?.id;
      if (eventId === undefined || eventId === null) {
        return;
      }
      navigation.navigate('EventDetailsScreen', { event, eventId });
    },
    [navigation],
  );

  const handleTabChange = tabId => {
    if (tabId === TAB_IDS.EVENTS) {
      fetchEventDetailsList();
    }
    Animated.timing(tabAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tabId);
      Animated.spring(tabAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    });
  };

  const tabContentStyle = {
    opacity: tabAnim,
    transform: [
      {
        translateY: tabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={[styles.imageBg, { opacity: imageOpacity }]}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <Reanimated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stickyHeaderIndices={[1]}
        >
          <EventHeader
            navigation={navigation}
            insets={insets}
            bCoins={bCoins}
          />
          <EventCategoryTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            scrollY={scrollY}
            insets={insets}
          />

          <Animated.View style={tabContentStyle}>
            {activeTab === TAB_IDS.POPULAR && (
              <PopularTab
                fadeAnim={fadeAnim}
                vouchers={carouselVouchers}
                loading={carouselLoading}
                bCoins={bCoins}
                giftQuote={giftQuote}
                giftQuoteLoading={giftQuoteLoading}
                onClaim={handleClaim}
                onGoToVouchers={() => handleTabChange(TAB_IDS.VOUCHERS)}
                onGoToSports={() => handleTabChange(TAB_IDS.SPORTS)}
              />
            )}
            {activeTab === TAB_IDS.VOUCHERS && (
              <CardCarousel
                fadeAnim={fadeAnim}
                vouchers={carouselVouchers}
                onClaim={handleClaim}
              />
            )}
            {activeTab === TAB_IDS.EVENTS &&
              (eventsLoading ? (
                <LoadingSkeleton />
              ) : events.length > 0 ? (
                events.map((item, index) => (
                  <EventCard
                    key={item?.eventId ?? item?.id}
                    item={item}
                    onPress={handleEventPress}
                    index={index}
                  />
                ))
              ) : (
                <EmptyState
                  icon={EVENTS_ICON}
                  title="No events found"
                  subtitle="There are no events available right now. Please check back later."
                />
              ))}
            {activeTab === TAB_IDS.SPORTS && (
              <EmptyState
                icon={SPORTS_ICON}
                title="Sports"
                subtitle="Book tickets for your favourite sports, coming soon."
              />
            )}
            {activeTab === TAB_IDS.BILLS && (
              <EmptyState
                icon={BILLS_ICON}
                title="Bills & Recharge"
                subtitle="Pay bills and recharge with UD-Coins, coming soon."
              />
            )}
          </Animated.View>
        </Reanimated.ScrollView>
      </AnimatedImageBackground>

      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
        style={[styles.statusBarGradient, { height: insets.top + 24 }]}
      />

      <UdenTicketModal
        visible={modalVisible}
        voucher={claimedVoucher}
        bCoins={bCoins}
        initialQuoteData={claimedQuoteData}
        onPurchaseSettled={refreshBCoins}
        onClose={() => {
          setModalVisible(false);
          setClaimedQuoteData(null);
        }}
      />
      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
      <MyBookingsModal
        visible={myBookingsVisible}
        vouchers={myVouchers}
        loading={myVouchersLoading}
        onVoucherPress={setSelectedVoucher}
        onClose={() => setMyBookingsVisible(false)}
      />

      <BottomTabBar
        bookingsCount={myVouchers.length}
        onHomePress={handleGoHome}
        onMyBookingsPress={() => setMyBookingsVisible(true)}
        onStorePress={handleOpenStoreSwitcher}
      />

      <ServiceSwitcherModal
        visible={storeSwitcherVisible}
        onClose={() => {
          setStoreSwitcherVisible(false);
          // The switcher's native Modal (statusBarTranslucent) can reset the
          // Android status bar as it tears down; re-assert ours afterwards.
          setTimeout(applyStatusBar, 350);
        }}
        excludeServiceId="movie"
      />
    </View>
  );
};

export default TicketLandingScreen;
