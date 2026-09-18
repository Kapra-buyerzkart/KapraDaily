import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  paymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  onApplyBankOffer?: () => void;
  supportsCOD?: boolean;
};

export const CartPaymentSection: React.FC<Props> = ({
  paymentMethod,
  onSelectPaymentMethod,
  onApplyBankOffer,
  supportsCOD = false,
}) => {
  const [selectedUpi, setSelectedUpi] = useState<'GPay' | 'PhonePe' | 'Paytm'>('GPay');

  const handleSelectUpi = (upi: 'GPay' | 'PhonePe' | 'Paytm') => {
    setSelectedUpi(upi);
    onSelectPaymentMethod('Online');
  };

  const isCardActive =
    paymentMethod?.toLowerCase().includes('card') ||
    (paymentMethod?.toLowerCase().includes('online') && selectedUpi === null);

  const isCodActive = paymentMethod?.toLowerCase() === 'cod';

  return (
    <View style={styles.outerWrap}>
      {/* Top Separator Shadow Bar */}
      <View style={styles.topShadowLine} />

      {/* Enclosed Payment Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={s(18)} color="#0D7A58" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Payment Method</Text>
            <Text style={styles.headerSubtitle}>
              100% Encrypted & Insured{'\n'}Settlement
            </Text>
          </View>
        </View>

        {/* Bank Discount Strip */}
        <View style={styles.promoStrip}>
          <Ionicons
            name="sparkles-outline"
            size={s(14)}
            color="#D97706"
            style={{ marginRight: s(6) }}
          />
          <Text style={styles.promoText} numberOfLines={2}>
            Flat ₹1,500 Instant Discount with HDFC / ICICI{'\n'}Cards
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onApplyBankOffer}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </View>

        {/* UPI Section Heading */}
        <View style={styles.upiHeadingRow}>
          <Text style={styles.upiCaption}>RECOMMENDED: UPI 1-TAP</Text>
          <Text style={styles.zeroFeeBadge}>Fast & Zero Fee</Text>
        </View>

        {/* 3 UPI Options Grid */}
        <View style={styles.upiGrid}>
          {/* GPay */}
          <TouchableOpacity
            testID="payment-upi-gpay"
            activeOpacity={0.8}
            onPress={() => handleSelectUpi('GPay')}
            style={[
              styles.upiCard,
              paymentMethod !== 'COD' && selectedUpi === 'GPay' && styles.upiCardActive,
            ]}
          >
            {paymentMethod !== 'COD' && selectedUpi === 'GPay' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={s(15)} color="#07332C" />
              </View>
            )}
            <Text style={styles.upiTitle}>GPay</Text>
            <Text style={styles.upiSub}>Instant App</Text>
          </TouchableOpacity>

          {/* PhonePe */}
          <TouchableOpacity
            testID="payment-upi-phonepe"
            activeOpacity={0.8}
            onPress={() => handleSelectUpi('PhonePe')}
            style={[
              styles.upiCard,
              paymentMethod !== 'COD' && selectedUpi === 'PhonePe' && styles.upiCardActive,
            ]}
          >
            {paymentMethod !== 'COD' && selectedUpi === 'PhonePe' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={s(15)} color="#07332C" />
              </View>
            )}
            <Text style={styles.upiTitle}>PhonePe</Text>
            <Text style={styles.upiSub}>UPI App</Text>
          </TouchableOpacity>

          {/* Paytm */}
          <TouchableOpacity
            testID="payment-upi-paytm"
            activeOpacity={0.8}
            onPress={() => handleSelectUpi('Paytm')}
            style={[
              styles.upiCard,
              paymentMethod !== 'COD' && selectedUpi === 'Paytm' && styles.upiCardActive,
            ]}
          >
            {paymentMethod !== 'COD' && selectedUpi === 'Paytm' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={s(15)} color="#07332C" />
              </View>
            )}
            <Text style={styles.upiTitle}>Paytm</Text>
            <Text style={styles.upiSub}>UPI / Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Credit / Debit Card Option */}
        <TouchableOpacity
          testID="payment-option-card"
          activeOpacity={0.8}
          onPress={() => {
            setSelectedUpi(null as any);
            onSelectPaymentMethod('Online');
          }}
          style={[styles.cardOptionRow, isCardActive && styles.cardOptionRowActive]}
        >
          <View style={styles.cardOptionIconBox}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={s(18)}
              color={CART_COLORS.textDark}
            />
          </View>
          <View style={styles.cardOptionInfo}>
            <Text style={styles.cardOptionTitle}>Credit / Debit Card</Text>
            <Text style={styles.cardOptionSub}>Visa, Mastercard, RuPay & EMI options</Text>
          </View>
          <Ionicons name="chevron-forward" size={s(16)} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Cash on Delivery option (when supported) */}
        {supportsCOD && (
          <TouchableOpacity
            testID="payment-option-cod"
            activeOpacity={0.8}
            onPress={() => onSelectPaymentMethod('COD')}
            style={[styles.cardOptionRow, isCodActive && styles.cardOptionRowActive]}
          >
            <View style={styles.cardOptionIconBox}>
              <MaterialCommunityIcons
                name="cash"
                size={s(18)}
                color={CART_COLORS.textDark}
              />
            </View>
            <View style={styles.cardOptionInfo}>
              <Text style={styles.cardOptionTitle}>Cash on Delivery</Text>
              <Text style={styles.cardOptionSub}>Pay at doorstep upon delivery</Text>
            </View>
            {isCodActive ? (
              <Ionicons name="checkmark-circle" size={s(18)} color="#07332C" />
            ) : (
              <Ionicons name="chevron-forward" size={s(16)} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrap: {
    marginBottom: s(20),
  },
  topShadowLine: {
    height: s(8),
    backgroundColor: '#F7F8F9',
    marginBottom: s(14),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F1F3',
  },
  card: {
    backgroundColor: CART_COLORS.card,
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: s(16),
    marginHorizontal: s(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: s(12),
    borderBottomWidth: 1,
    borderColor: '#F3EFEA',
  },
  iconCircle: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: '#E8F4EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13.5),
    color: CART_COLORS.textDark,
  },
  headerSubtitle: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10.5),
    color: '#7A7A7A',
    marginTop: s(2),
    lineHeight: fs(14),
  },
  promoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF7E6',
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: '#FCE8B2',
    paddingHorizontal: s(10),
    paddingVertical: s(8),
    marginTop: s(12),
  },
  promoText: {
    flex: 1,
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(10),
    color: '#78350F',
    lineHeight: fs(13),
  },
  applyBtnText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(10.5),
    color: CART_COLORS.textDark,
    marginLeft: s(6),
  },
  upiHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(16),
    marginBottom: s(10),
  },
  upiCaption: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(10),
    color: '#7A7A7A',
    letterSpacing: 0.3,
  },
  zeroFeeBadge: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(10),
    color: '#0E8A44',
  },
  upiGrid: {
    flexDirection: 'row',
    gap: s(10),
  },
  upiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: s(10),
    paddingVertical: s(12),
    paddingHorizontal: s(6),
    alignItems: 'center',
    backgroundColor: CART_COLORS.white,
    position: 'relative',
  },
  upiCardActive: {
    borderColor: '#07332C',
    borderWidth: 1.5,
    backgroundColor: '#F9FCFA',
  },
  checkBadge: {
    position: 'absolute',
    top: s(4),
    right: s(4),
  },
  upiTitle: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12.5),
    color: CART_COLORS.textDark,
  },
  upiSub: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(9.5),
    color: '#7A7A7A',
    marginTop: s(2),
  },
  cardOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: s(10),
    paddingVertical: s(11),
    paddingHorizontal: s(12),
    marginTop: s(12),
    backgroundColor: CART_COLORS.white,
  },
  cardOptionRowActive: {
    borderColor: '#07332C',
  },
  cardOptionIconBox: {
    width: s(32),
    height: s(32),
    borderRadius: s(6),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  cardOptionInfo: {
    flex: 1,
  },
  cardOptionTitle: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12.5),
    color: CART_COLORS.textDark,
  },
  cardOptionSub: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10),
    color: '#7A7A7A',
    marginTop: s(1),
  },
});
