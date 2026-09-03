import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, IconDisc } from '../../../components/atoms';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  hp,
  wp,
} from '../../../theme/tokens';

interface CheckoutBarProps {
  totalSavings?: number;
  toPay?: number;
  paymentMethod?: string;
  onSelectPayment: () => void;
  onPay: () => void;
}

const CheckoutBar: React.FC<CheckoutBarProps> = ({
  totalSavings = 0,
  toPay = 0,
  paymentMethod,
  onSelectPayment,
  onPay,
}) => {
  const isCod = paymentMethod?.toUpperCase() === 'COD';

  return (
    <View style={styles.bar}>
      {totalSavings > 0 && (
        <View style={styles.savingsStrip}>
          <MaterialCommunityIcons
            name="check-decagram"
            size={wp('4%')}
            color={UI_COLORS.successDeep}
          />
          <AppText variant="captionStrong" tone="success">
            Yay! You are saving ₹{totalSavings.toFixed(2)} on this order
          </AppText>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.paymentInfo}
          onPress={onSelectPayment}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Change payment method, currently ${paymentMethod}`}
        >
          <AppText variant="micro" tone="faint">
            PAY USING
          </AppText>
          <View style={styles.paymentMethod}>
            <IconDisc size={wp('6.5%')} tone="ink" radius={UI_RADIUS.pill}>
              <MaterialCommunityIcons
                name={isCod ? 'cash' : 'cellphone'}
                size={wp('3.6%')}
                color={UI_COLORS.ink}
              />
            </IconDisc>
            <AppText variant="labelStrong" numberOfLines={1}>
              {paymentMethod}
            </AppText>
            <MaterialCommunityIcons
              name="chevron-up"
              size={wp('5%')}
              color={UI_COLORS.textMuted}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPay}
          style={styles.payButton}
          accessibilityRole="button"
          accessibilityLabel={`Pay ₹${toPay.toFixed(2)}`}
        >
          <AppText variant="cta" tone="onDark">
            Pay ₹{toPay.toFixed(2)}
          </AppText>
          <MaterialCommunityIcons
            name="chevron-right"
            size={wp('5%')}
            color={UI_COLORS.onPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CheckoutBar);

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.card + 8,
    borderTopRightRadius: UI_RADIUS.card + 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: UI_COLORS.borderStrong,
    paddingBottom: hp('4%'),
    overflow: 'hidden',
    ...UI_ELEVATION.bar,
  },
  savingsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    backgroundColor: UI_COLORS.successTint,
    paddingVertical: hp('1.1%'),
    paddingHorizontal: UI_SPACING.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: UI_SPACING.md,
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.md,
  },
  paymentInfo: {
    flex: 1,
    gap: UI_SPACING.xs,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.xs,
    height: hp('6%'),
    minWidth: wp('42%'),
    paddingHorizontal: UI_SPACING.lg,
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.primary,
  },
});
