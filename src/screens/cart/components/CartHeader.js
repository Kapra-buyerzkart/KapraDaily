import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import icons from '@/assets/icons';
import { FONTS } from '../../../styles/typography';
import { CART_COLORS, CART_SPACING, wp, hp } from '../../../styles/cartTheme';

const CartHeader = ({ onBack, onClearAll }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={40}>
        <Image
          source={icons.backArrowNew}
          style={{
            resizeMode: 'contain',
            tintColor: CART_COLORS.textPrimary,
          }}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Cart</Text>

      <TouchableOpacity
        hitSlop={40}
        onPress={onClearAll}
        activeOpacity={0.8}
        style={styles.clearAllBtn}
      >
        <Feather
          name="trash-2"
          size={wp('3.4%')}
          color={CART_COLORS.textMuted}
        />
        <Text style={styles.clearAllText}>Clear all</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(CartHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.5%'),
    backgroundColor: CART_COLORS.card,
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    color: CART_COLORS.textPrimary,
    marginLeft: CART_SPACING.sm,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: 20,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
    gap: CART_SPACING.xs,
  },
  clearAllText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: CART_COLORS.textMuted,
  },
});
