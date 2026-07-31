import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import CONFIG from '@/globals/config';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import { formatDate, formatTime } from '@/screens/EventDetailsScreen/utils';
import COLORS from '@/styles/colors';
import { GIFT_CARD_BORDER_GRADIENT } from '@/styles/gradients';
import icons from '@/assets/icons';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

const getDateParts = value => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return { month: MONTHS[date.getMonth()], day: date.getDate() };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const EventCard = ({ item, onPress, index = 0 }) => {
  // isActive === 0 (or false) means the event is no longer bookable. Block the
  // press and dim the card with a "Not Available" badge so it reads as disabled.
  const unavailable = item?.isActive === 0 || item?.isActive === false;

  const eventStart =
    item?.EventStartDate ||
    item?.SessionStart ||
    item?.sessionStart ||
    item?.eventDate ||
    item?.date ||
    item?.startDate;
  const dateParts = getDateParts(eventStart);
  const timeText = formatTime(eventStart);
  const location = [item?.venueName, item?.city].filter(Boolean).join(', ');
  const displayTitle = item?.title || item?.eventName;
  const price = item?.MinPrice ?? item?.minPrice;

  return (
    <AnimatedPressable
      style={styles.card}
      entering={FadeInUp.delay(getStaggerDelay(index))}
      disabled={unavailable}
      onPress={() => !unavailable && onPress?.(item)}
    >
      {/* Gradient border */}
      <LinearGradient
        colors={GIFT_CARD_BORDER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.inner}>
        <View style={unavailable && styles.dimmed}>
          {/* ---- Image with scrim & floating badges ---- */}
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: CONFIG.image_base_url + item.bannerImage }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.75)']}
              style={styles.imageScrim}
              pointerEvents="none"
            />

            {!!dateParts && (
              <View style={styles.dateBadge}>
                <Text style={styles.dateMonth}>{dateParts.month}</Text>
                <Text style={styles.dateDay}>{dateParts.day}</Text>
              </View>
            )}

            {/* Category chip on image */}
            {!!item?.categoryName && (
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </View>
            )}
          </View>

          {/* ---- Body ---- */}
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={1}>
              {displayTitle}
            </Text>

            {/* Location row */}
            {!!location && (
              <View style={styles.locationRow}>
                <Image source={icons.locationtwo} style={styles.locationIcon} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            )}

            {/* Info pills */}
            <View style={styles.pillsRow}>
              {!!eventStart && (
                <View style={styles.pill}>
                  <Image source={icons.calendarTwo} style={styles.pillIcon} />
                  <Text style={styles.pillText}>{formatDate(eventStart)}</Text>
                </View>
              )}

              {!!timeText && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{timeText}</Text>
                </View>
              )}

              {!!item?.brand && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.brand}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Unavailable overlay */}
        {unavailable && (
          <View style={styles.unavailableOverlay} pointerEvents="none">
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Not Available</Text>
            </View>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Outer wrapper — the gradient border bleeds through the 1.5 px margin
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Inner card sits *inside* the gradient border
  inner: {
    margin: 1.5,
    borderRadius: 14.5,
    overflow: 'hidden',
    backgroundColor: '#141428',
  },

  // ---- Image ----
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
  },

  // Floating date badge — top-left
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(14, 14, 40, 0.85)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(110, 52, 192, 0.5)',
  },
  dateMonth: {
    color: COLORS.lavender,
    fontSize: 10,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 1,
  },
  dateDay: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Heavy',
    lineHeight: 22,
    marginTop: 1,
  },

  // Category chip — top-right
  categoryChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(110, 52, 192, 0.75)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Gilroy-SemiBold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // ---- Body ----
  body: {
    padding: 14,
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.2,
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    width: 13,
    height: 13,
    tintColor: COLORS.lavender,
  },
  locationText: {
    flex: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(110, 52, 192, 0.45)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(110, 52, 192, 0.08)',
  },
  pricePill: {
    borderColor: 'rgba(242, 80, 0, 0.45)',
    backgroundColor: 'rgba(242, 80, 0, 0.10)',
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontFamily: 'Gilroy-Medium',
  },
  priceValue: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: 'Gilroy-Bold',
  },
  pillIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.lavender,
  },
  pillText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
  },

  // Unavailable
  dimmed: {
    opacity: 0.45,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  unavailableText: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.8,
    fontFamily: 'Gilroy-Bold',
    textTransform: 'uppercase',
  },
});

export default React.memo(EventCard);
