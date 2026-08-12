import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
} from '@/styles/cartTheme';
import DayCell from '../atoms/DayCell';
import { MONTHS_LONG, WEEKDAYS } from '../constants';

const CalendarGrid = ({
  month,
  year,
  days,
  getDayState,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onPrevMonth}
        hitSlop={hitSlopTo(20)}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={wp('6%')}
          color={CART_COLORS.textSecondary}
        />
      </TouchableOpacity>

      <CartText variant="labelStrong">
        {MONTHS_LONG[month]} {year}
      </CartText>

      <TouchableOpacity
        onPress={onNextMonth}
        hitSlop={hitSlopTo(20)}
        accessibilityRole="button"
        accessibilityLabel="Next month"
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={wp('6%')}
          color={CART_COLORS.textSecondary}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.weekdays}>
      {WEEKDAYS.map(day => (
        <CartText key={day} variant="micro" tone="muted" style={styles.weekday}>
          {day}
        </CartText>
      ))}
    </View>

    <View style={styles.grid}>
      {days.map(item => (
        <DayCell
          key={item.key}
          day={item.day}
          state={getDayState(item.dateStr)}
          disabled={!item.dateStr}
          onPress={() => onSelectDay(item.dateStr)}
        />
      ))}
    </View>
  </View>
);

export default React.memo(CalendarGrid);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: CART_RADIUS.card,
    padding: CART_SPACING.md,
    backgroundColor: CART_COLORS.well,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: CART_SPACING.md,
  },
  weekdays: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: CART_SPACING.xs,
    marginBottom: CART_SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CART_COLORS.borderStrong,
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});
