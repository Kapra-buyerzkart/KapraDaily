import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';
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
  const { label } = getPaymentMeta(paymentMethod);

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer} onLayout={onLayout}>
      {/* Payment Selection Row */}
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.paymentStrip}
        onPress={onPaymentChipPress}
      >
        <Feather name="credit-card" size={18} color="#374151" />

        <View style={styles.paymentCopy}>
          <Text style={styles.payUsingLabel}>PAY USING</Text>
          <Text style={styles.paymentMethodText} numberOfLines={1}>
            {label || 'Online payment'}
          </Text>
        </View>

        <View style={styles.changeBtn}>
          <Text style={styles.changeText}>Change</Text>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {/* Action Row: Total & Pay Button */}
      <View style={styles.actionRow}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>₹{Math.round(totalToPay || 0)}</Text>
        </View>

        <View style={styles.payBtnWrapper}>
          <View
            style={[
              styles.payBtnShadow,
              ctaDisabled && styles.payBtnShadowDisabled,
            ]}
          />
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.payBtn, ctaDisabled && styles.payBtnDisabled]}
            onPress={onCheckout}
            disabled={ctaDisabled}
          >
            <Text style={styles.payBtnText}>
              {ctaLabel || 'Pay'}
            </Text>
            <AntDesign name="arrowright" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  paymentStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingVertical: hp('0.8%'),
  },
  paymentCopy: {
    flex: 1,
    gap: 1,
  },
  payUsingLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.6%'),
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  paymentMethodText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#000000',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.3%'),
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.2%'),
    gap: wp('4%'),
  },
  totalBlock: {
    gap: 1,
    minWidth: wp('20%'),
  },
  totalLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.6%'),
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  totalAmount: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.8%'),
    color: '#000000',
    letterSpacing: -0.3,
  },
  payBtnWrapper: {
    flex: 1,
    position: 'relative',
    height: 48,
  },
  payBtnShadow: {
    position: 'absolute',
    top: 3,
    left: 2.5,
    right: -1.5,
    bottom: -3,
    backgroundColor: '#000000',
    borderRadius: 10,
  },
  payBtnShadowDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#FD7301',
    borderColor: '#000000',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payBtnText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.4%'),
    color: '#FFFFFF',
  },
  payBtnDisabled: {
    backgroundColor: '#D1D5DB',
    borderColor: '#9CA3AF',
  },
});
