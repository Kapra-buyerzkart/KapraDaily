import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn } from 'react-native-reanimated';
import styles from './styles';
import COLORS from '@/styles/colors';
import images from '@/assets/images';
import AnimatedPressable from '@/components/AnimatedPressable';
import useEventDetails from './hooks/useEventDetails';
import EventHero from './components/EventHero';
import ClaimBanner from './components/ClaimBanner';
import EventSummaryCard from './components/EventSummaryCard';
import MoreToKnow from './components/MoreToKnow';
import ArtistList from './components/ArtistList';
import EventAccordions from './components/EventAccordions';
import TicketSelectionModal from './components/TicketSelectionModal';
import { createEventBookingApi } from '../../api/eventService';
import logger from '../../utils/logger';

const EventDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { event, loading, details } = useEventDetails(route);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const openTicketModal = useCallback(() => setTicketModalVisible(true), []);
  const closeTicketModal = useCallback(() => setTicketModalVisible(false), []);
  const handleBuyNow = useCallback(
    async selection => {
      if (bookingInProgress) return;

      const bookingItems = (selection?.lines || []).map(({ cat, qty }) => ({
        ticketCategoryId: cat.ticketCategoryId,
        quantity: qty,
      }));

      if (!details?.sessionId || bookingItems.length === 0) {
        Toast.show('Please select at least one ticket.', Toast.LONG);
        return;
      }

      const payload = {
        sessionId: details.sessionId,
        bookingItems,
        bookingPlacedFrom: 'app',
      };
      logger.log('Event booking payload:', payload);

      setBookingInProgress(true);
      try {
        const responseData = await createEventBookingApi(payload);
        console.log('Event booking response:', responseData);

        setTicketModalVisible(false);
        Toast.show('Booking placed successfully!', Toast.LONG);
      } catch (err) {
        logger.error('Failed to create event booking:', err?.message);
        Toast.show(
          err?.message || 'Failed to place booking. Please try again.',
          Toast.LONG,
        );
      } finally {
        setBookingInProgress(false);
      }
    },
    [bookingInProgress, details?.sessionId],
  );

  const claimWrapStyle = useMemo(
    () => [styles.claimWrap, { paddingBottom: insets.bottom + 16 }],
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <EventHero event={event} insets={insets} onBack={handleBack} />
        {/* <ClaimBanner /> */}
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
      </ScrollView>

      <View style={claimWrapStyle}>
        <Animated.View entering={ZoomIn.delay(280).duration(360)}>
          <AnimatedPressable
            style={styles.claimButton}
            onPress={openTicketModal}
          >
            <Text style={styles.claimText}>Claim</Text>
          </AnimatedPressable>
        </Animated.View>
      </View>

      <TicketSelectionModal
        visible={ticketModalVisible}
        onClose={closeTicketModal}
        ticketCategories={details?.ticketCategories}
        onBuyNow={handleBuyNow}
        submitting={bookingInProgress}
      />
    </View>
  );
};

export default EventDetailsScreen;
