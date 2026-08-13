import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS, CART_RADIUS, CART_SPACING, wp } from '@/styles/cartTheme';

const VerifiedPill = () => (
  <View style={styles.pill}>
    <MaterialCommunityIcons
      name="check-decagram"
      size={wp('3.2%')}
      color={CART_COLORS.successDeep}
    />
    <EditText variant="micro" tone="success">
      Verified
    </EditText>
  </View>
);

export default React.memo(VerifiedPill);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 3,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.successTint,
  },
});
