import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CartText from './atoms/CartText';
import Badge from './atoms/Badge';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
  hitSlopTo,
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
  appliedSubtitle,
  subtitle,
  isApplied,
  onPress,
  onRemove,
  removeLabel = 'Remove',
}) => {
  const tone = ICON_TONES[iconTone] || ICON_TONES.brand;
  const Wrapper = isApplied ? View : TouchableOpacity;
  const wrapperProps = isApplied
    ? {}
    : { activeOpacity: 0.75, onPress, accessibilityRole: 'button' };

  return (
    <Wrapper style={styles.row} {...wrapperProps}>
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
              label={appliedSubtitle || 'Applied'}
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

      {isApplied ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={hitSlopTo(hp('3.2%'))}
          accessibilityRole="button"
          accessibilityLabel={`${removeLabel} ${title}`}
        >
          <MaterialCommunityIcons
            name="close"
            size={wp('3.2%')}
            color={CART_COLORS.danger}
          />
          <CartText variant="micro" tone="danger">
            {removeLabel}
          </CartText>
        </TouchableOpacity>
      ) : (
        <AntDesign
          name="right"
          size={wp('3.4%')}
          color={CART_COLORS.textFaint}
        />
      )}
    </Wrapper>
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
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs / 2,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: CART_SPACING.xs,
    borderRadius: CART_RADIUS.pill,
    borderWidth: 1,
    borderColor: CART_COLORS.danger,
    backgroundColor: CART_COLORS.dangerTint,
  },
});
