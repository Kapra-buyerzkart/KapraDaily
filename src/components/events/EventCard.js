import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { getEventImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import { formatDate } from '@/screens/EventDetailsScreen/utils';
import COLORS from '@/styles/colors';
import icons from '@/assets/icons';

const EventCard = ({ item, onPress, index = 0 }) => {
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
      <View style={unavailable && styles.dimmed}>
        <Image
          source={getEventImageSource(item)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>From ₹ {item?.MinPrice ?? 0}</Text>
            </View>

            <View style={styles.pill}>
              <Image source={icons.calendarTwo} />
              <Text style={styles.pillText}>
                {formatDate(item?.SessionStart)}
              </Text>
            </View>

            {!!item?.brand && (
              <View style={styles.pill}>
                <Text style={styles.pillText}>{item.brand}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {unavailable && (
        <View style={styles.unavailableOverlay} pointerEvents="none">
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Not Available</Text>
          </View>
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 12,
    padding: 10,
  },
  pillText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
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

export default React.memo(EventCard);
