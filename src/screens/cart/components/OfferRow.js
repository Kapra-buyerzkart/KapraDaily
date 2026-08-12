import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CartText from './atoms/CartText';
import Badge from './atoms/Badge';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';

const ICON_TONES = {
  brand: { disc: 'brand', color: CART_COLORS.primary },
  pink: { disc: 'pink', color: CART_COLORS.pink },
  success: { disc: 'success', color: CART_COLORS.successDeep },
};

const OfferRow = ({
  iconName,
  iconTone = 'brand',
  title,
  appliedLabel,
  subtitle,
  isApplied,
  onPress,
}) => {
  const tone = ICON_TONES[iconTone] || ICON_TONES.brand;

  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.row} onPress={onPress}>
      <IconDisc
        size={wp('9.5%')}
        tone={isApplied ? 'success' : tone.disc}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={wp('5%')}
          color={isApplied ? CART_COLORS.successDeep : tone.color}
        />
      </IconDisc>

      <View style={styles.details}>
        <CartText variant="labelStrong">{title}</CartText>
        {isApplied ? (
          <View style={styles.appliedRow}>
            {appliedLabel ? (
              <Badge tone="neutral" label={appliedLabel} />
            ) : null}
            <Badge
              tone="success"
              label="Applied"
              icon={
                <MaterialCommunityIcons
                  name="check-circle"
                  size={wp('3%')}
                  color={CART_COLORS.successDeep}
                />
              }
            />
          </View>
        ) : (
          <CartText variant="micro" tone="muted" numberOfLines={1}>
            {subtitle}
          </CartText>
        )}
      </View>

      <AntDesign name="right" size={wp('3.4%')} color={CART_COLORS.textFaint} />
    </TouchableOpacity>
  );
};

export default React.memo(OfferRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: CART_SPACING.lg,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    flexWrap: 'wrap',
  },
});
