import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditText from '@/screens/cart/components/atoms/CartText';
import PressableScale from '../atoms/PressableScale';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

const SaveBar = ({ enabled, onPress }) => (
  <SafeAreaView edges={['bottom']} style={styles.footer}>
    <PressableScale
      to={0.98}
      contentStyle={[styles.btn, !enabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel="Save changes"
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={
        enabled ? undefined : 'Available once you change something'
      }
    >
      <MaterialCommunityIcons
        name={enabled ? 'check-circle-outline' : 'check'}
        size={wp('4.4%')}
        color={enabled ? CART_COLORS.onPrimary : CART_COLORS.textFaint}
      />
      <EditText
        variant="cta"
        tone={enabled ? 'onDark' : 'faint'}
        numberOfLines={1}
      >
        {enabled ? 'Save Changes' : 'No Changes Yet'}
      </EditText>
    </PressableScale>
  </SafeAreaView>
);

export default React.memo(SaveBar);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.md,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
    ...CART_ELEVATION.bar,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    backgroundColor: CART_COLORS.primary,
    borderRadius: CART_RADIUS.button,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.6%'),
    marginBottom: CART_SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: CART_COLORS.primary,
        shadowOpacity: 0.22,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  btnDisabled: {
    backgroundColor: CART_COLORS.well,
    shadowOpacity: 0,
    elevation: 0,
  },
});
