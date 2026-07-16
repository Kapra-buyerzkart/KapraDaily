import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import { getEventImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import COLORS from '@/styles/colors';
import icons from '@/assets/icons';

const PopularEventCard = ({ item, onPress, index = 0 }) => {
  const location = [item?.venueName, item?.city].filter(Boolean).join(', ');

  return (
    <AnimatedPressable
      style={styles.card}
      entering={FadeInUp.delay(getStaggerDelay(index))}
      onPress={() => onPress?.(item)}
    >
      <Image
        source={getEventImageSource(item)}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {item?.eventName}
        </Text>
        <View style={styles.pillsRow}>
          {!!item?.categoryName && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{item.categoryName}</Text>
            </View>
          )}

          {!!location && (
            <View style={styles.pill}>
              <Image source={icons.locationtwo} style={styles.pillIcon} />
              <Text style={styles.pillText} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>
      </View>
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
    flexWrap: 'wrap',
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
  pillIcon: {
    width: 14,
    height: 14,
  },
  pillText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
  },
});

export default React.memo(PopularEventCard);
