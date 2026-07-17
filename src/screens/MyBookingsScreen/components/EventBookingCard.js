import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getStaggerDelay } from '@/utils/staggerDelay';
import { PLACEHOLDER_EVENT_IMAGE_SOURCE } from '@/components/events/imageUtils';
import {
  formatDate,
  formatTime,
  formatPrice,
} from '@/screens/EventDetailsScreen/utils';
import CONFIG from '../../../globals/config';

const STATUS_COLORS = {
  confirmed: '#4CD98A',
  completed: '#4CD98A',
  paid: '#4CD98A',
  pending: '#FFC24B',
  cancelled: '#FF6B6B',
  failed: '#FF6B6B',
};

// Bookings the user can open a ticket/detail view for.
const OPENABLE_STATUSES = ['confirmed', 'completed'];

const getBookingImageSource = item => {
  const value =
    item?.bannerImage ||
    item?.thumbnailImage ||
    item?.imageUrl ||
    item?.eventImage ||
    item?.image;
  if (typeof value === 'string' && value.length > 0) {
    return {
      uri: value.startsWith('http') ? value : CONFIG.image_base_url + value,
    };
  }
  return PLACEHOLDER_EVENT_IMAGE_SOURCE;
};

const getTicketCount = item => {
  const direct = item?.totalTickets ?? item?.totalQuantity ?? item?.quantity;
  if (direct != null) return direct;
  if (Array.isArray(item?.bookingItems)) {
    return item.bookingItems.reduce(
      (sum, line) => sum + (line?.quantity || 0),
      0,
    );
  }
  return null;
};

const EventBookingCard = ({ item, index = 0 }) => {
  console.log(item, 'item======>');
  const navigation = useNavigation();

  const title =
    item?.eventName || item?.sessionName || item?.title || 'Event booking';
  const sessionName = item?.sessionName;
  const showSession = !!sessionName && sessionName !== title;

  const startValue =
    item?.startDateTime ||
    item?.sessionStart ||
    item?.eventDate ||
    item?.bookedAt ||
    item?.bookingDate ||
    item?.createdOn;
  const meta = [formatDate(startValue), formatTime(startValue)]
    .filter(Boolean)
    .join(' • ');

  const organizer =
    item?.organizerName || item?.venueName || item?.venue || item?.location;

  const status = item?.statusKey || item?.bookingStatus || item?.status;
  const statusKey = String(status || '').toLowerCase();
  const statusColor = STATUS_COLORS[statusKey] || '#C9A6FF';
  const isOpenable = OPENABLE_STATUSES.includes(statusKey);

  const tickets = getTicketCount(item);
  const amount =
    item?.grandTotal ?? item?.totalAmount ?? item?.amount ?? item?.netAmount;
  const amountLabel = formatPrice(amount);

  const detail = [
    tickets != null && tickets > 0
      ? `${tickets} ticket${tickets === 1 ? '' : 's'}`
      : null,
    amountLabel || null,
  ]
    .filter(Boolean)
    .join(' • ');

  const handlePress = () =>
    navigation.navigate('EventBookingDetailsScreen', { booking: item });

  return (
    <Animated.View entering={FadeInUp.delay(getStaggerDelay(index))}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isOpenable && pressed && styles.cardPressed,
        ]}
        onPress={isOpenable ? handlePress : undefined}
        disabled={!isOpenable}
        android_ripple={
          isOpenable ? { color: 'rgba(255,255,255,0.06)' } : undefined
        }
        accessibilityRole={isOpenable ? 'button' : undefined}
      >
        <Image
          source={getBookingImageSource(item)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {showSession && (
            <Text style={styles.session} numberOfLines={1}>
              {sessionName}
            </Text>
          )}
          {!!meta && (
            <Text style={styles.meta} numberOfLines={1}>
              {meta}
            </Text>
          )}
          {!!organizer && (
            <Text style={styles.meta} numberOfLines={1}>
              {organizer}
            </Text>
          )}
          <View style={styles.bottomRow}>
            {!!detail && (
              <Text style={styles.detail} numberOfLines={1}>
                {detail}
              </Text>
            )}
            {!!status && (
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {String(status)}
                </Text>
              </View>
            )}
          </View>
        </View>
        {isOpenable && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255,255,255,0.35)"
            style={styles.chevron}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    marginBottom: 12,
  },
  cardPressed: {
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
    marginRight: 12,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 3,
  },
  session: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginTop: 1,
  },
  meta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Gilroy-Regular',
    marginTop: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  detail: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Gilroy-Bold',
    textTransform: 'capitalize',
  },
});

export default React.memo(EventBookingCard);
