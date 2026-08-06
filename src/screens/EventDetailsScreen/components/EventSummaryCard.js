import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import CalendarIcon from '../../../assets/icons/calendarOutline.svg';
import LocationPinIcon from '../../../assets/icons/locationPinOutline.svg';
import PriceIcon from '../../../assets/icons/mobilePaymentSuccess.svg';
import styles, { GLASS_BLUR_ROUNDS } from '../styles';
import { formatPrice } from '../utils';
import VenueMapStrip from './VenueMapStrip';
import { hp, wp } from '@/utils/responsive';

const FACT_ICON_SIZE = wp(10);

const FactCell = ({ Icon, primary, secondary, secondaryStyle }) => (
  <View style={styles.factCell}>
    <Icon
      width={FACT_ICON_SIZE}
      height={FACT_ICON_SIZE}
      style={styles.factIcon}
    />
    <View style={styles.factTextGroup}>
      {!!primary && (
        <Text style={styles.factPrimary} numberOfLines={2}>
          {primary}
        </Text>
      )}
      {!!secondary && (
        <Text style={[styles.factSecondary, secondaryStyle]} numberOfLines={2}>
          {secondary}
        </Text>
      )}
    </View>
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
      <FactCell
        key="date"
        Icon={CalendarIcon}
        primary={dateText}
        secondary={timeText}
      />
    ),
    (!!venue || !!city) && (
      <FactCell
        key="venue"
        Icon={LocationPinIcon}
        primary={venue}
        secondary={city}
      />
    ),
    !!price && (
      <FactCell
        key="price"
        Icon={PriceIcon}
        primary="Starts from"
        secondary={price}
        secondaryStyle={styles.factPrice}
      />
    ),
  ].filter(Boolean);

  return (
    <BlurView
      style={styles.summaryCard}
      blurType="dark"
      blurAmount={24}
      blurRounds={GLASS_BLUR_ROUNDS}
    >
      <Text style={styles.eventName}>{name}</Text>
      {!!subtitle && <Text style={styles.eventTagline}>{subtitle}</Text>}
      {!!category && (
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{category}</Text>
        </View>
      )}
      {facts.length > 0 && (
        <View style={styles.factStrip}>
          {facts.map((fact, index) => (
            <React.Fragment key={fact.key}>
              {index > 0 && <View style={styles.factDivider} />}
              {fact}
            </React.Fragment>
          ))}
        </View>
      )}
      <View style={{ paddingTop: hp(1.5) }} />
      <VenueMapStrip venue={venue} city={city} />
    </BlurView>
  );
};

export default React.memo(EventSummaryCard);
