import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const DeliveryHeader = ({
  itemCount,
  tokenLabel,
  isScheduled,
  scheduleLabel,
  onSchedulePress,
  onSwitchToExpress,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.etaBlock}>
        <View style={styles.etaTitleRow}>
          <Ionicons
            name="time-outline"
            size={wp('4.5%')}
            color={CART_COLORS.primary}
          />
          <Text style={styles.etaText}>
            {isScheduled ? scheduleLabel || 'Scheduled' : 'Express delivery for'}
          </Text>
        </View>
        <Text style={styles.subText}>{itemCount} Items</Text>
        {isScheduled && (
          <TouchableOpacity
            onPress={onSwitchToExpress}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.switchText}>Switch to Express</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.scheduleBtn}
        onPress={onSchedulePress}
      >
        <Ionicons
          name="calendar-outline"
          size={wp('3.8%')}
          color={CART_COLORS.primary}
        />
        <Text style={styles.scheduleBtnText}>Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(DeliveryHeader);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.md,
  },
  etaBlock: {
    flex: 1,
  },
  etaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  etaText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: CART_COLORS.textPrimary,
  },
  subText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),

    color: CART_COLORS.textMuted,
    marginTop: hp('0.3%'),
  },
  switchText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: CART_COLORS.primary,
    marginTop: hp('0.5%'),
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CART_COLORS.primary,
    borderRadius: CART_RADIUS.sm,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
    gap: CART_SPACING.xs,
  },
  scheduleBtnText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.1%'),
    color: CART_COLORS.primary,
  },
});
