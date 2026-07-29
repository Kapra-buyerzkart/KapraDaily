import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { getEventImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import { formatTime } from '@/screens/EventDetailsScreen/utils';
import COLORS from '@/styles/colors';
import { GIFT_CARD_BORDER_GRADIENT } from '@/styles/gradients';
import icons from '@/assets/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.56;

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

const UpcomingEventCard = ({ item, onPress, index = 0 }) => {
  const location = [item?.venueName, item?.city].filter(Boolean).join(', ');
  const eventStart =
    item?.EventStartDate ||
    item?.SessionStart ||
    item?.sessionStart ||
    item?.eventDate ||
    item?.date ||
    item?.startDate;
  const dateParts = getDateParts(eventStart);
  const timeText = formatTime(eventStart);
  // isActive === 0 (or false) means the event is no longer bookable. Block the
  // press and dim the card with a "Not Available" badge so it reads as disabled.
  const unavailable = item?.isActive === 0 || item?.isActive === false;

  return (
    <AnimatedPressable
      style={styles.card}
      entering={FadeInUp.delay(getStaggerDelay(index))}
      disabled={unavailable}
      onPress={() => !unavailable && onPress?.(item)}
    >
      <LinearGradient
        colors={GIFT_CARD_BORDER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <View style={unavailable && styles.dimmed}>
          <Image
            source={getEventImageSource(item)}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.body}>
            <View style={styles.infoRow}>
              {!!dateParts && (
                <View style={styles.dateBadge}>
                  <Text style={styles.dateMonth}>{dateParts.month}</Text>
                  <Text style={styles.dateDay}>{dateParts.day}</Text>
                </View>
              )}
              <View style={styles.infoCol}>
                <Text style={styles.title} numberOfLines={1}>
                  {item?.eventName}
                </Text>
                {!!location && (
                  <View style={styles.locationRow}>
                    <Image
                      source={icons.locationtwo}
                      style={styles.locationIcon}
                    />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {location}
                    </Text>
                  </View>
                )}
                {!!timeText && (
                  <Text style={styles.timeText} numberOfLines={1}>
                    {timeText}
                  </Text>
                )}
              </View>
            </View>
            <ImageBackground
              source={icons.selectionPillthree}
              style={styles.bookButton}
              resizeMode="stretch"
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </ImageBackground>
          </View>
        </View>

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

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inner: {
    margin: 1.5,
    borderRadius: 12.5,
    overflow: 'hidden',
    backgroundColor: '#1E1E2E',
  },
  image: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dateBadge: {
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  dateMonth: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.5,
  },
  dateDay: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Heavy',
    lineHeight: 18,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: {
    width: 12,
    height: 12,
  },
  locationText: {
    flex: 1,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
  },
  timeText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
    marginTop: 4,
  },
  bookButton: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
  },
  dimmed: {
    opacity: 0.45,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  unavailableText: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(UpcomingEventCard);
