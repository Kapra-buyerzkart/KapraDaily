import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProfileText, PressableScale } from '../atoms';
import {
  CART_COLORS,
  CART_GUTTER,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const LogoutRow = ({ onPress }) => (
  <PressableScale
    to={0.98}
    contentStyle={styles.button}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Log out"
  >
    <Ionicons
      name="log-out-outline"
      size={wp('4.2%')}
      color={CART_COLORS.danger}
    />
    <ProfileText variant="labelStrong" tone="danger">
      Log Out
    </ProfileText>
  </PressableScale>
);

export default React.memo(LogoutRow);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    minHeight: hp('5.6%'),
    marginTop: CART_SPACING.xl,
    marginHorizontal: CART_GUTTER,
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
});
