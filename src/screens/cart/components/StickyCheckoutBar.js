import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
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
  onCheckout,
  onLayout,
}) => {
  const { label, icon } = getPaymentMeta(paymentMethod);

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer} onLayout={onLayout}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.paymentChip}
        onPress={onPaymentChipPress}
      >
        <MaterialCommunityIcons
          name={icon}
          size={wp('4%')}
          color={CART_COLORS.primary}
        />
        <View style={styles.paymentChipText}>
          <Text style={styles.payUsingLabel}>PAY USING</Text>
          <View style={styles.paymentMethodRow}>
            <Text style={styles.paymentMethodText} numberOfLines={1}>
              {label}
            </Text>
            <AntDesign
              name="up"
              size={wp('2.5%')}
              color={CART_COLORS.textMuted}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.payBtn, ctaDisabled && styles.payBtnDisabled]}
        onPress={onCheckout}
        disabled={ctaDisabled}
      >
        <Text style={styles.payBtnText}>{ctaLabel}</Text>
        {!ctaDisabled && (
          <>
            <Text style={styles.payBtnPrice}>₹{totalToPay?.toFixed()}</Text>
            <AntDesign
              name="right"
              size={wp('3.2%')}
              color="#FFF"
              style={{ marginLeft: CART_SPACING.xs }}
            />
          </>
        )}
      </TouchableOpacity>
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
    paddingTop: CART_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: CART_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  paymentChipText: {
    marginLeft: 2,
  },
  payUsingLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.2%'),
    color: CART_COLORS.textFaint,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentMethodText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    color: CART_COLORS.textPrimary,
    maxWidth: wp('38%'),
  },
  payBtn: {
    backgroundColor: CART_COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.xl,
    paddingVertical: hp('1.5%'),
    borderRadius: CART_RADIUS.button,
    shadowColor: CART_COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  payBtnDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  payBtnText: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('3.8%'),
    color: '#FFF',
    marginRight: CART_SPACING.sm,
  },
  payBtnPrice: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFF',
  },
});
