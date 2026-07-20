import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  ZoomIn,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import styles from './styles';
import COLORS from '@/styles/colors';
import images from '@/assets/images';
import AnimatedPressable from '@/components/AnimatedPressable';
import useEventDetails from './hooks/useEventDetails';
import EventHero from './components/EventHero';
import ScrollHint from './components/ScrollHint';
import ClaimBanner from './components/ClaimBanner';
import EventSummaryCard from './components/EventSummaryCard';
import MoreToKnow from './components/MoreToKnow';
import ArtistList from './components/ArtistList';
import EventAccordions from './components/EventAccordions';
import TicketSelectionModal from './components/TicketSelectionModal';
import RedeemSuccessModal from '../ticketLandingScreen/components/RedeemSuccessModal';
import PaymentFailedModal from '../ticketLandingScreen/components/PaymentFailedModal';
import { useEventPayment } from '../../hooks/useEventPayment';
import prefetchMyBookings from '../../queries/prefetchMyBookings';

const EventDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { event, loading, details } = useEventDetails(route);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const {
    payForBooking,
    processing,
    successVisible,
    failureVisible,
    paidAmount,
    ticketQuantity,
    resetPayment,
    dismissFailure,
  } = useEventPayment();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
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

  const claimSafeAreaStyle = useMemo(
    () => [styles.claimSafeArea, { height: insets.bottom }],
    [insets.bottom],
  );

  if (loading && !event) {
    return (
      <View style={styles.loader}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ActivityIndicator color={COLORS.purple} size="large" />
      </View>
    );
  }

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

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces
      >
        <EventHero
          event={event}
          insets={insets}
          onBack={handleBack}
          scrollY={scrollY}
        />
        <ClaimBanner />
        <EventSummaryCard
          name={details?.name}
          category={details?.category}
          organizer={details?.organizer}
          minPrice={details?.minPrice}
          dateText={details?.dateText}
          timeText={details?.timeText}
          venue={details?.venue}
          city={details?.city}
        />
        <MoreToKnow ageLimit={details?.ageLimit} language={details?.language} />
        <ArtistList artists={details?.artists} />
        <EventAccordions details={details.detailsText} terms={details.terms} />
      </Animated.ScrollView>

      <View style={styles.claimWrap} pointerEvents="box-none">
        <Animated.View>
          <Pressable
            onPress={openTicketModal}
            accessibilityRole="button"
            accessibilityLabel="Claim"
          >
            <Image
              source={images.claimbgbutton}
              style={styles.claimBarImage}
              resizeMode="contain"
            />
          </Pressable>
          <View style={claimSafeAreaStyle} />
          <View
            style={{
              backgroundColor: 'black',
              height: 40,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
            }}
          ></View>
        </Animated.View>
      </View>

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
        coinsUsed={0}
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
