import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CartText from '../../../cart/components/atoms/CartText';
import IconDisc from '../../../cart/components/atoms/IconDisc';
import AreaOption from '../molecules/AreaOption';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
} from '../../../../styles/cartTheme';

const AreaSelectCard = ({ areas, selectedArea, onSelect }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <IconDisc size={wp('8%')} tone="brand">
        <Ionicons
          name="location-sharp"
          size={wp('4.2%')}
          color={CART_COLORS.primary}
        />
      </IconDisc>
      <View style={styles.copy}>
        <CartText variant="labelStrong">Select your area</CartText>
        <CartText variant="micro" tone="muted">
          Please select your Pincode area
        </CartText>
      </View>
    </View>

    <View style={styles.options}>
      {areas.map((area, index) => (
        <AreaOption
          key={area?.pincodeAreaId ?? index}
          label={area.areaName}
          selected={selectedArea?.areaName === area?.areaName}
          onPress={() => onSelect(area)}
        />
      ))}
    </View>
  </View>
);

export default React.memo(AreaSelectCard);

const styles = StyleSheet.create({
  card: {
    gap: CART_SPACING.md,
    padding: CART_SPACING.md,
    borderRadius: CART_RADIUS.card,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    backgroundColor: CART_COLORS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  options: {
    gap: CART_SPACING.sm,
  },
});
