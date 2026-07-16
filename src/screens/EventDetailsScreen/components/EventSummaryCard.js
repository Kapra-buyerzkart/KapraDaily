import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import icons from '@/assets/icons';
import styles from '../styles';
import { formatPrice } from '../utils';

const EventSummaryCard = ({
  name,
  category,
  organizer,
  minPrice,
  dateText,
  timeText,
  venue,
  city,
}) => (
  <Animated.View
    entering={FadeInUp.delay(120).duration(400)}
    style={styles.summaryCard}
  >
    <Text style={styles.eventName}>{name}</Text>

    {(!!category || !!organizer) && (
      <View style={styles.metaChipRow}>
        {!!category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{category}</Text>
          </View>
        )}
        {!!organizer && (
          <Text style={styles.organizerText} numberOfLines={1}>
            by {organizer}
          </Text>
        )}
      </View>
    )}

    {(minPrice ?? null) !== null && !!formatPrice(minPrice) && (
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Starts from </Text>
        <Text style={styles.priceValue}>{formatPrice(minPrice)}</Text>
      </View>
    )}

    {!!dateText && (
      <View style={styles.infoRow}>
        <View style={styles.infoIconTile}>
          <Image
            source={icons.calendar}
            style={styles.infoIcon}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.infoPrimary}>{dateText}</Text>
          {!!timeText && <Text style={styles.infoSecondary}>{timeText}</Text>}
        </View>
      </View>
    )}

    {(!!venue || !!city) && (
      <View style={styles.infoRow}>
        <View style={styles.infoIconTile}>
          <Image
            source={icons.locationtwo}
            style={styles.infoIcon}
            resizeMode="contain"
          />
        </View>
        <View>
          {!!venue && <Text style={styles.infoPrimary}>{venue}</Text>}
          {!!city && <Text style={styles.infoSecondary}>{city}</Text>}
        </View>
      </View>
    )}
  </Animated.View>
);

export default React.memo(EventSummaryCard);
