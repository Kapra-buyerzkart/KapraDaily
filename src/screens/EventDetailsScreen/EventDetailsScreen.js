import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StatusBar,
  RefreshControl,
  Share,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import styles, {
  CLAIM_GRADIENT_COLORS,
  CLAIM_GRADIENT_LOCATIONS,
  HERO_TOP_GAP,
  TOP_BAR_CONTENT_HEIGHT,
} from './styles';
import { getHeaderPaddingTop } from '@/utils/headerLayout';
import COLORS from '@/styles/colors';
import images from '@/assets/images';
import icons from '@/assets/icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import useEventDetails from './hooks/useEventDetails';
import EventTopBar from './components/EventTopBar';
import EventHero from './components/EventHero';
import EventSummaryCard from './components/EventSummaryCard';
import MoreToKnow from './components/MoreToKnow';
import ArtistList from './components/ArtistList';
import EventAccordions from './components/EventAccordions';
import EventDetailsSkeleton from './components/EventDetailsSkeleton';
import TicketSelectionModal from './components/TicketSelectionModal';
import RedeemSuccessModal from '../ticketLandingScreen/components/RedeemSuccessModal';
import PaymentFailedModal from '../ticketLandingScreen/components/PaymentFailedModal';
import { useEventPayment } from '../../hooks/useEventPayment';
import prefetchMyBookings from '../../queries/prefetchMyBookings';

// Breathing room kept below an expanded accordion / above the screen top when
// scrolling it into view.
const EXPAND_SCROLL_PADDING = 16;

const EventDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { event, eventId, loading, details, refreshing, refresh } =
    useEventDetails(route);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const {
    payForBooking,
    processing,
    successVisible,
    failureVisible,
    paidAmount,
    coinsUsed,
    ticketQuantity,
    resetPayment,
    dismissFailure,
  } = useEventPayment();

  const scrollY = useSharedValue(0);
  const scrollProgress = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
    const scrollable = e.contentSize.height - e.layoutMeasurement.height;
    scrollProgress.value =
      scrollable > 0
        ? Math.min(1, Math.max(0, e.contentOffset.y / scrollable))
        : 0;
  });

  const scrollRef = useRef(null);
  const claimBarHeight = useRef(0);
  const handleClaimBarLayout = useCallback(e => {
    claimBarHeight.current = e.nativeEvent.layout.height;
  }, []);

  // When an accordion opens, nudge the page down just enough to bring the
  // revealed body above the floating claim bar — without pushing its header off
  // the top of the screen.
  const handleAccordionExpand = useCallback(
    ({ y, height }) => {
      const visibleBottom = windowHeight - claimBarHeight.current;
      const hidden = y + height + EXPAND_SCROLL_PADDING - visibleBottom;
      if (hidden <= 0) return;

      const headroom = Math.max(0, y - insets.top - EXPAND_SCROLL_PADDING);
      const delta = Math.min(hidden, headroom);
      if (delta <= 0) return;

      scrollRef.current?.scrollTo({
        y: scrollY.value + delta,
        animated: true,
      });
    },
    [windowHeight, insets.top, scrollY],
  );

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleShare = useCallback(() => {
    const eventName = details?.name || 'this event';
    const where = [details?.venue, details?.city].filter(Boolean).join(', ');
    const when = [details?.dateText, details?.timeText]
      .filter(Boolean)
      .join(' • ');
    const message = [`Check out ${eventName} on Uden Tickets.`, when, where]
      .filter(Boolean)
      .join('\n');

    Share.share({ message, title: eventName }).catch(err =>
      console.error('Share Error:', err?.message),
    );
  }, [
    details?.name,
    details?.venue,
    details?.city,
    details?.dateText,
    details?.timeText,
  ]);
  const openTicketModal = useCallback(() => setTicketModalVisible(true), []);
  const closeTicketModal = useCallback(() => setTicketModalVisible(false), []);
  const handleBuyNow = useCallback(
    async selection => {
      if (processing) return;

      const bookingItems = (selection?.lines || []).map(({ cat, qty }) => ({
        ticketCategoryId: cat.ticketCategoryId,
        quantity: qty,
      }));

      if (!details?.sessionId || bookingItems.length === 0) {
        Toast.show('Please select at least one ticket.', Toast.LONG);
        return;
      }

      const result = await payForBooking({
        sessionId: details.sessionId,
        bookingItems,
        bookingPlacedFrom: 'app',
        eventName: details?.name,
        udCoinsRequested: selection?.udCoinsRequested ?? 0,
      });

      if (result?.success || result?.pending || result?.failed) {
        setTicketModalVisible(false);
      }
    },
    [processing, details?.sessionId, details?.name, payForBooking],
  );
  const handleSuccessBack = useCallback(() => resetPayment(), [resetPayment]);
  const handleGoToBookings = useCallback(() => {
    resetPayment();
    prefetchMyBookings();
    navigation.navigate('MyBookingsScreen');
  }, [resetPayment, navigation]);
  const handleFailureBack = useCallback(
    () => dismissFailure(),
    [dismissFailure],
  );
  const handleRetryPayment = useCallback(() => {
    dismissFailure();
    setTicketModalVisible(true);
  }, [dismissFailure]);

  // Starts the hero below the floating top bar so the artwork reads as a card
  // inside the page instead of bleeding under the status bar.
  const scrollContentStyle = useMemo(
    () => [
      styles.scrollContent,
      {
        paddingTop:
          getHeaderPaddingTop(insets) + TOP_BAR_CONTENT_HEIGHT + HERO_TOP_GAP,
      },
    ],
    [insets],
  );

  const claimSafeAreaStyle = useMemo(
    () => [styles.claimSafeArea, { height: insets.bottom }],
    [insets.bottom],
  );

  if (loading && !event) {
    return <EventDetailsSkeleton />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {/* <Image
        source={images.bookingtabbg}
        style={styles.bgImage}
        resizeMode="cover"
      /> */}

      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.white}
            colors={[COLORS.purple]}
            progressViewOffset={insets.top}
          />
        }
      >
        <EventHero key={eventId ?? 'event'} event={event} scrollY={scrollY} />
        <EventSummaryCard
          name={details?.name}
          tagline={details?.tagline}
          category={details?.category}
          organizer={details?.organizer}
          minPrice={details?.minPrice}
          dateText={details?.dateText}
          timeText={details?.timeText}
          venue={details?.venue}
          city={details?.city}
        />
        <MoreToKnow
          ageLimit={details?.ageLimit}
          language={details?.language}
          onClaimPress={openTicketModal}
        />
        <ArtistList artists={details?.artists} />
        <EventAccordions
          details={details.detailsText}
          terms={details.terms}
          onExpand={handleAccordionExpand}
        />
      </Animated.ScrollView>

      <EventTopBar
        insets={insets}
        scrollY={scrollY}
        progress={scrollProgress}
        title={details?.name}
        onBack={handleBack}
        onShare={handleShare}
      />

      <LinearGradient
        colors={CLAIM_GRADIENT_COLORS}
        locations={CLAIM_GRADIENT_LOCATIONS}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.claimWrap}
        onLayout={handleClaimBarLayout}
      >
        <AnimatedPressable
          onPress={openTicketModal}
          accessibilityRole="button"
          accessibilityLabel="Claim tickets"
        >
          <ImageBackground
            source={images.claimticketBtn}
            style={styles.claimBarImage}
            resizeMode="contain"
          >
            <View style={styles.claimLabelWrap}>
              <Image source={icons.claimtick} style={styles.claimTick} />
              <Text style={styles.claimLabel}>Claim Tickets</Text>
            </View>
          </ImageBackground>
        </AnimatedPressable>
        <View style={claimSafeAreaStyle} />
      </LinearGradient>

      <TicketSelectionModal
        visible={ticketModalVisible}
        onClose={closeTicketModal}
        ticketCategories={details?.ticketCategories}
        onBuyNow={handleBuyNow}
        submitting={processing}
      />

      <RedeemSuccessModal
        visible={successVisible}
        quantity={ticketQuantity}
        coinsUsed={coinsUsed}
        amountPaid={`₹${paidAmount}`}
        itemLabel="ticket"
        secondaryButtonLabel="My Bookings"
        onBack={handleSuccessBack}
        onSecondaryAction={handleGoToBookings}
      />

      <PaymentFailedModal
        visible={failureVisible}
        quantity={ticketQuantity}
        eventName={details?.name}
        onBack={handleFailureBack}
        onRetry={handleRetryPayment}
      />
    </View>
  );
};

export default EventDetailsScreen;
