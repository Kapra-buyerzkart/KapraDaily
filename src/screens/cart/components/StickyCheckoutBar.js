import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from './atoms/CartText';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';
import { getPaymentMeta } from '../paymentMeta';

const StickyCheckoutBar = ({
  paymentMethod,
  onPaymentChipPress,
  totalToPay,
  ctaLabel,
  ctaDisabled,
  ctaShowPrice = true,
  onCheckout,
  onLayout,
}) => {
  const { label, icon } = getPaymentMeta(paymentMethod);

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer} onLayout={onLayout}>
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.paymentStrip}
        onPress={onPaymentChipPress}
      >
        <IconDisc size={wp('7.5%')} tone="neutral">
          <MaterialCommunityIcons
            name={icon}
            size={wp('4%')}
            color={CART_COLORS.textSecondary}
          />
        </IconDisc>

        <View style={styles.paymentCopy}>
          <CartText variant="micro" tone="muted">
            PAY USING
          </CartText>
          <CartText variant="labelStrong" numberOfLines={1}>
            {label}
          </CartText>
        </View>

        <View style={styles.changeChip}>
          <CartText variant="micro" tone="muted">
            Change
          </CartText>
          <AntDesign
            name="up"
            size={wp('2.4%')}
            color={CART_COLORS.textMuted}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.actionRow}>
        {ctaShowPrice && !ctaDisabled ? (
          <View style={styles.totalBlock}>
            <CartText variant="micro" tone="muted">
              TOTAL
            </CartText>
            <CartText variant="priceLarge">₹{totalToPay?.toFixed()}</CartText>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.payBtn,
            !ctaShowPrice || ctaDisabled ? styles.payBtnWide : null,
            ctaDisabled && styles.payBtnDisabled,
          ]}
          onPress={onCheckout}
          disabled={ctaDisabled}
        >
          <CartText
            variant="cta"
            tone={ctaDisabled ? 'faint' : 'onDark'}
            numberOfLines={1}
          >
            {ctaLabel}
          </CartText>
          {!ctaDisabled && (
            <AntDesign
              name="arrowright"
              size={wp('4%')}
              color={CART_COLORS.onPrimary}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(StickyCheckoutBar);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.sm,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
    ...CART_ELEVATION.bar,
  },
  paymentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.well,
    borderRadius: CART_RADIUS.button,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.9%'),
  },
  paymentCopy: {
    flex: 1,
    gap: 1,
  },
  changeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: hp('0.35%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingVertical: CART_SPACING.md,
  },
  totalBlock: {
    gap: 1,
  },
  payBtn: {
    flex: 1,
    backgroundColor: CART_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.6%'),
    borderRadius: CART_RADIUS.button,
    ...Platform.select({
      ios: {
        shadowColor: CART_COLORS.primary,
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  payBtnWide: {
    flex: 1,
  },
  payBtnDisabled: {
    backgroundColor: CART_COLORS.well,
    shadowOpacity: 0,
    elevation: 0,
  },
});
