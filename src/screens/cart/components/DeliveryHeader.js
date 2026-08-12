import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import icons from '../../../assets/icons';
import CartText from './atoms/CartText';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const DeliveryHeader = ({
  itemCount,
  isScheduled,
  scheduleLabel,
  onSchedulePress,
  onSwitchToExpress,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <IconDisc size={wp('10%')} tone="neutral">
          {isScheduled ? (
            <Ionicons
              name="calendar"
              size={wp('4.8%')}
              color={CART_COLORS.textSecondary}
            />
          ) : (
            <Image source={icons.expressicon} style={styles.expressIcon} />
          )}
        </IconDisc>

        <View style={styles.etaBlock}>
          <CartText variant="bodyStrong" numberOfLines={1}>
            {isScheduled ? scheduleLabel || 'Scheduled delivery' : 'Express delivery'}
          </CartText>
          <CartText variant="caption" tone="muted">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in this order
          </CartText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.scheduleBtn}
          onPress={onSchedulePress}
        >
          <Ionicons
            name="calendar-outline"
            size={wp('3.6%')}
            color={CART_COLORS.textSecondary}
          />
          <CartText variant="micro" tone="secondary">
            Schedule
          </CartText>
        </TouchableOpacity>
      </View>

      {isScheduled && (
        <View style={styles.metaRow}>
          <TouchableOpacity
            onPress={onSwitchToExpress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <CartText variant="micro" tone="brand" style={styles.switchText}>
              Switch to Express
            </CartText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(DeliveryHeader);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  expressIcon: {
    width: wp('4.8%'),
    height: wp('4.8%'),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  etaBlock: {
    flex: 1,
    gap: 1,
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CART_COLORS.borderStrong,
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
    gap: CART_SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    marginTop: CART_SPACING.md,
  },
  switchText: {
    textDecorationLine: 'underline',
  },
});
