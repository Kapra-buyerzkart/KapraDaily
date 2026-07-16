import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getStaggerDelay } from '@/utils/staggerDelay';
import { PLACEHOLDER_EVENT_IMAGE_SOURCE } from '@/components/events/imageUtils';
import { formatDate } from '@/screens/EventDetailsScreen/utils';
import CONFIG from '../../../globals/config';

const STATUS_COLORS = {
  confirmed: '#4CD98A',
  completed: '#4CD98A',
  pending: '#FFC24B',
  cancelled: '#FF6B6B',
  failed: '#FF6B6B',
};

const getBookingImageSource = item => {
  const value =
    item?.imageUrl ||
    item?.eventImage ||
    item?.bannerImage ||
    item?.thumbnailImage ||
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
    return item.bookingItems.reduce((sum, line) => sum + (line?.quantity || 0), 0);
  }
  return null;
};

const EventBookingCard = ({ item, index = 0 }) => {
  const title = item?.eventName || item?.title || 'Event booking';
  const dateValue =
    item?.sessionStart || item?.eventDate || item?.bookingDate || item?.createdOn;
  const venue = item?.venueName || item?.venue || item?.location;
  const status = item?.bookingStatus || item?.status;
  const tickets = getTicketCount(item);
  const amount = item?.totalAmount ?? item?.amount ?? item?.netAmount;

  const meta = [formatDate(dateValue), venue].filter(Boolean).join(' • ');
  const statusColor =
    STATUS_COLORS[String(status || '').toLowerCase()] || '#C9A6FF';

  return (
    <Animated.View
      style={styles.card}
      entering={FadeInUp.delay(getStaggerDelay(index))}
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
        {!!meta && (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        )}
        <View style={styles.bottomRow}>
          <Text style={styles.detail} numberOfLines={1}>
            {tickets != null
              ? `${tickets} ticket${tickets === 1 ? '' : 's'}`
              : ''}
            {tickets != null && amount != null ? ' • ' : ''}
            {amount != null ? `₹${amount}` : ''}
          </Text>
          {!!status && (
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {String(status)}
              </Text>
            </View>
          )}
        </View>
      </View>
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
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },
  meta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Gilroy-Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
