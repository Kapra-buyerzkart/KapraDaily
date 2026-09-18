import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

type Props = {
  appliedCouponCode?: string | null;
  onPress: () => void;
};

export const CartCouponCard: React.FC<Props> = ({
  appliedCouponCode,
  onPress,
}) => {
  const isApplied = !!appliedCouponCode;

  return (
    <TouchableOpacity
      testID="cart-apply-coupon"
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      {/* Left Orange Tag Outline in Warm Cream Squircle */}
      <View style={styles.iconContainer}>
        <Ionicons
          name="pricetag-outline"
          size={s(19)}
          color="#C85215"
          style={{ transform: [{ rotate: '-10deg' }] }}
        />
      </View>

      {/* Center Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Apply Coupon</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {isApplied
            ? `Code "${appliedCouponCode}" applied`
            : 'Unlock special offers and savings'}
        </Text>
      </View>

      {/* Right Action */}
      <View style={styles.actionRow}>
        <Text style={[styles.actionText, isApplied && styles.actionTextApplied]}>
          {isApplied ? 'Change' : 'Add Coupon'}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={s(14)}
          color={isApplied ? CART_COLORS.green : '#07332C'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.card,
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    marginHorizontal: s(16),
    marginBottom: s(24),
  },
  iconContainer: {
    width: s(40),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: '#FFF8F2',
    borderWidth: 1,
    borderColor: '#F3C5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  textContainer: {
    flex: 1,
    paddingRight: s(8),
  },
  title: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13),
    color: CART_COLORS.textDark,
  },
  subtitle: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10.5),
    color: '#7A7A7A',
    marginTop: s(2),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  actionText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12),
    color: '#07332C',
  },
  actionTextApplied: {
    color: CART_COLORS.green,
  },
});
