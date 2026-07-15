import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
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

// The category tabs (cell index 1) pin to the top while the header above them
// scrolls away — matching the previous ScrollView stickyHeaderIndices behavior.
const STICKY_INDICES = [1];

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

  const handleImageLoad = useCallback(() => {
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
  }, [imageOpacity, fadeAnim]);

  const handleClaim = useCallback(
    voucher => {
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
    },
    [bCoins],
  );

  const handleOpenStoreSwitcher = useCallback(() => {
    setStoreSwitcherVisible(true);
  }, []);

  const voucherPressTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(voucherPressTimeoutRef.current), []);

  const handleVoucherPress = useCallback(voucher => {
    setMyBookingsVisible(false);
    voucherPressTimeoutRef.current = setTimeout(
      () => setSelectedVoucher(voucher),
      Platform.OS === 'ios' ? 400 : 250,
    );
  }, []);

  const fetchEventDetailsList = useCallback(() => {
    setEventsLoading(true);
    getEventDetailsListApi()
      .then(res => {
        const items = res?.data?.items || res?.data || [];
        setEvents(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        logger.error('Failed to load event details list:', err?.message);
        setEvents([]);
      })
      .finally(() => setEventsLoading(false));
  }, []);

  const handleEventPress = useCallback(
    event => {
      const eventId = event?.eventId ?? event?.id;
      if (eventId === undefined || eventId === null) {
        return;
      }
      navigation.navigate('EventDetailsScreen', { event, eventId });
    },
    [navigation],
  );

  const handleTabChange = useCallback(
    tabId => {
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
    },
    [fetchEventDetailsList, tabAnim],
  );

  const handleGoHome = useCallback(
    () => handleTabChange(TAB_IDS.POPULAR),
    [handleTabChange],
  );
  const handleGoToVouchers = useCallback(
    () => handleTabChange(TAB_IDS.VOUCHERS),
    [handleTabChange],
  );
  const handleGoToSports = useCallback(
    () => handleTabChange(TAB_IDS.SPORTS),
    [handleTabChange],
  );

  const handleCloseUdenModal = useCallback(() => {
    setModalVisible(false);
    setClaimedQuoteData(null);
  }, []);
  const handleCloseVoucherSheet = useCallback(
    () => setSelectedVoucher(null),
    [],
  );
  const handleCloseMyBookings = useCallback(
    () => setMyBookingsVisible(false),
    [],
  );
  const handleOpenMyBookings = useCallback(
    () => setMyBookingsVisible(true),
    [],
  );
  const handleCloseStoreSwitcher = useCallback(() => {
    setStoreSwitcherVisible(false);
    setTimeout(applyStatusBar, 350);
  }, [applyStatusBar]);

  const tabContentStyle = useMemo(
    () => ({
      opacity: tabAnim,
      transform: [
        {
          translateY: tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    }),
    [tabAnim],
  );

  const imageBgStyle = useMemo(
    () => [styles.imageBg, { opacity: imageOpacity }],
    [imageOpacity],
  );
  const gradientStyle = useMemo(
    () => [styles.statusBarGradient, { height: insets.top + 24 }],
    [insets.top],
  );

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case TAB_IDS.POPULAR:
        return (
          <PopularTab
            fadeAnim={fadeAnim}
            vouchers={carouselVouchers}
            loading={carouselLoading}
            bCoins={bCoins}
            giftQuote={giftQuote}
            giftQuoteLoading={giftQuoteLoading}
            onClaim={handleClaim}
            onGoToVouchers={handleGoToVouchers}
            onGoToSports={handleGoToSports}
          />
        );
      case TAB_IDS.VOUCHERS:
        return (
          <CardCarousel
            fadeAnim={fadeAnim}
            vouchers={carouselVouchers}
            onClaim={handleClaim}
          />
        );
      case TAB_IDS.SPORTS:
        return (
          <EmptyState
            icon={SPORTS_ICON}
            title="Sports"
            subtitle="Book tickets for your favourite sports, coming soon."
          />
        );
      case TAB_IDS.BILLS:
        return (
          <EmptyState
            icon={BILLS_ICON}
            title="Bills & Recharge"
            subtitle="Pay bills and recharge with UD-Coins, coming soon."
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    fadeAnim,
    carouselVouchers,
    carouselLoading,
    bCoins,
    giftQuote,
    giftQuoteLoading,
    handleClaim,
    handleGoToVouchers,
    handleGoToSports,
  ]);

  // Heterogeneous data for the single vertical scroller: a non-sticky header,
  // the sticky category tabs, then the active tab's content (the Events tab
  // spreads its cards as individual virtualized rows).
  const listData = useMemo(() => {
    const base = [{ type: 'header' }, { type: 'tabs' }];
    if (activeTab === TAB_IDS.EVENTS) {
      if (eventsLoading) return [...base, { type: 'events-loading' }];
      if (events.length > 0) {
        return [
          ...base,
          ...events.map((event, index) => ({ type: 'event', event, index })),
        ];
      }
      return [...base, { type: 'events-empty' }];
    }
    return [...base, { type: 'tab-content' }];
  }, [activeTab, eventsLoading, events]);

  const keyExtractor = useCallback((item, index) => {
    if (item.type === 'event') {
      return `event-${item.event?.eventId ?? item.event?.id ?? index}`;
    }
    return `${item.type}-${index}`;
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'header':
          return (
            <EventHeader
              navigation={navigation}
              insets={insets}
              bCoins={bCoins}
            />
          );
        case 'tabs':
          return (
            <EventCategoryTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              scrollY={scrollY}
              insets={insets}
            />
          );
        case 'event':
          return (
            <Animated.View style={tabContentStyle}>
              <EventCard
                item={item.event}
                onPress={handleEventPress}
                index={item.index}
              />
            </Animated.View>
          );
        case 'events-loading':
          return (
            <Animated.View style={tabContentStyle}>
              <LoadingSkeleton />
            </Animated.View>
          );
        case 'events-empty':
          return (
            <Animated.View style={tabContentStyle}>
              <EmptyState
                icon={EVENTS_ICON}
                title="No events found"
                subtitle="There are no events available right now. Please check back later."
              />
            </Animated.View>
          );
        case 'tab-content':
        default:
          return (
            <Animated.View style={tabContentStyle}>
              {renderTabContent()}
            </Animated.View>
          );
      }
    },
    [
      navigation,
      insets,
      bCoins,
      activeTab,
      handleTabChange,
      scrollY,
      tabContentStyle,
      handleEventPress,
      renderTabContent,
    ],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={imageBgStyle}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <Reanimated.FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stickyHeaderIndices={STICKY_INDICES}
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
        visible={modalVisible}
        voucher={claimedVoucher}
        bCoins={bCoins}
        initialQuoteData={claimedQuoteData}
        onPurchaseSettled={refreshBCoins}
        onClose={handleCloseUdenModal}
      />
      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={handleCloseVoucherSheet}
      />
      <MyBookingsModal
        visible={myBookingsVisible}
        vouchers={myVouchers}
        loading={myVouchersLoading}
        onVoucherPress={handleVoucherPress}
        onClose={handleCloseMyBookings}
      />

      <BottomTabBar
        bookingsCount={myVouchers.length}
        onHomePress={handleGoHome}
        onMyBookingsPress={handleOpenMyBookings}
        onStorePress={handleOpenStoreSwitcher}
      />

      <ServiceSwitcherModal
        visible={storeSwitcherVisible}
        onClose={handleCloseStoreSwitcher}
        excludeServiceId="movie"
      />
    </View>
  );
};

export default TicketLandingScreen;
