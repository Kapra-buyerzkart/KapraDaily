import React from 'react';
import { View, Text, Platform } from 'react-native';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import CalendarIcon from '../../../assets/icons/calendarOutline.svg';
import LocationPinIcon from '../../../assets/icons/locationPinOutline.svg';
import PriceIcon from '../../../assets/icons/mobilePaymentSuccess.svg';
import styles, { GLASS_BLUR_ROUNDS } from '../styles';
import { formatPrice } from '../utils';
import VenueMapStrip from './VenueMapStrip';
import { hp, wp } from '@/utils/responsive';

const FACT_ICON_SIZE = wp(5);

// Native blur crashes on low-end Android devices, so we fall back to a solid tint.
const IS_ANDROID = Platform.OS === 'android';

const FactChip = ({ Icon, value, meta, accent }) => (
  <View style={[styles.factChip, accent && styles.factChipAccent]}>
    <Icon width={FACT_ICON_SIZE} height={FACT_ICON_SIZE} />
    <Text
      style={[styles.factChipValue, accent && styles.factChipValueAccent]}
      numberOfLines={1}
    >
      {value}
    </Text>
    {!!meta && (
      <Text style={styles.factChipMeta} numberOfLines={1}>
        {meta}
      </Text>
    )}
  </View>
);

const EventSummaryCard = ({
  name,
  tagline,
  category,
  organizer,
  minPrice,
  dateText,
  timeText,
  venue,
  city,
}) => {
  const price = (minPrice ?? null) !== null ? formatPrice(minPrice) : '';
  const subtitle = tagline || (organizer ? `by ${organizer}` : '');

  const facts = [
    !!dateText && (
      <FactChip
        key="date"
        Icon={CalendarIcon}
        value={dateText}
        meta={timeText}
      />
    ),
    (!!venue || !!city) && (
      <FactChip
        key="venue"
        Icon={LocationPinIcon}
        value={venue || city}
        meta={venue ? city : ''}
      />
    ),
    !!price && (
      <FactChip key="price" Icon={PriceIcon} value={price} accent meta="onwards" />
    ),
  ].filter(Boolean);

  const Surface = IS_ANDROID ? View : BlurView;
  const surfaceProps = IS_ANDROID
    ? {}
    : { blurType: 'dark', blurAmount: 24, blurRounds: GLASS_BLUR_ROUNDS };

  return (
    <Surface
      style={[styles.summaryCard, IS_ANDROID && styles.summaryCardFallback]}
      {...surfaceProps}
    >
      <Text style={styles.eventName}>{name}</Text>
      {!!subtitle && <Text style={styles.eventTagline}>{subtitle}</Text>}
      {!!category && (
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{category}</Text>
        </View>
      )}
      {facts.length > 0 && (
        <View style={styles.factChipRow}>{facts}</View>
      )}
      <View style={{ paddingTop: hp(1.5) }} />
      <VenueMapStrip venue={venue} city={city} />
    </Surface>
  );
};

export default React.memo(EventSummaryCard);
