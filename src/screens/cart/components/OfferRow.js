import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const OfferRow = ({
  iconSource,
  title,
  appliedLabel,
  subtitle,
  isApplied,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.row} onPress={onPress}>
      <Image source={iconSource} style={styles.icon} />

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        {isApplied ? (
          <View style={styles.appliedRow}>
            {appliedLabel ? (
              <View style={styles.appliedTag}>
                <Text style={styles.appliedTagText}>{appliedLabel}</Text>
              </View>
            ) : null}
            <View style={styles.appliedBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={wp('3%')}
                color={CART_COLORS.success}
              />
              <Text style={styles.appliedBadgeText}>Applies</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <AntDesign name="right" size={wp('3.5%')} color={CART_COLORS.textFaint} />
    </TouchableOpacity>
  );
};

export default React.memo(OfferRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.card,
    borderWidth: 1,
    borderColor: CART_COLORS.graySoftColor,
    borderRadius: CART_RADIUS.button,
    paddingVertical: hp('1.3%'),
    paddingHorizontal: CART_SPACING.md,
  },
  icon: {
  },
  details: {
    flex: 1,
    marginLeft: CART_SPACING.md,
  },
  title: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
    color: CART_COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: CART_COLORS.textMuted,
    marginTop: hp('0.3%'),
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  appliedTag: {
    backgroundColor: CART_COLORS.primaryTint,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.icon - 4,
    marginRight: CART_SPACING.sm,
  },
  appliedTagText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: CART_COLORS.primary,
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CART_COLORS.successTint,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.icon - 4,
  },
  appliedBadgeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.7%'),
    color: CART_COLORS.success,
    marginLeft: 3,
  },
});
