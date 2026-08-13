import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditText from '@/screens/cart/components/atoms/CartText';
import PressableScale from './PressableScale';
import { CART_COLORS, CART_RADIUS, CART_SPACING, hp, wp } from '@/styles/cartTheme';

const GenderChip = ({ label, selected, onPress }) => (
  <PressableScale
    to={0.96}
    style={styles.pressable}
    contentStyle={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    {selected && (
      <MaterialCommunityIcons
        name="check"
        size={wp('3.4%')}
        color={CART_COLORS.primary}
      />
    )}
    <EditText
      variant={selected ? 'labelStrong' : 'label'}
      tone={selected ? 'primary' : 'muted'}
      numberOfLines={1}
    >
      {label}
    </EditText>
  </PressableScale>
);

export default React.memo(GenderChip);

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.xs,
    minHeight: hp('5.4%'),
    paddingHorizontal: CART_SPACING.sm,
    borderRadius: CART_RADIUS.input,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    backgroundColor: CART_COLORS.well,
  },
  chipSelected: {
    backgroundColor: CART_COLORS.card,
    borderColor: CART_COLORS.borderStrong,
  },
});
