import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBottomModal from '../../../components/CustomBottomModal';
import CartText from './atoms/CartText';
import IconDisc from './atoms/IconDisc';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
  hp,
} from '../../../styles/cartTheme';
import { getPaymentMeta } from '../paymentMeta';

const PaymentOption = ({ mode, selected, onPress }) => {
  const { label, icon, subtitle } = getPaymentMeta(mode.paymentModeName);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.optionCard, selected && styles.optionCardSelected]}
      onPress={onPress}
    >
      <IconDisc size={wp('9.5%')} tone={selected ? 'brand' : 'neutral'}>
        <MaterialCommunityIcons
          name={icon}
          size={wp('5%')}
          color={selected ? CART_COLORS.primary : CART_COLORS.textMuted}
        />
      </IconDisc>

      <View style={styles.optionDetails}>
        <CartText variant="labelStrong" numberOfLines={1}>
          {label}
        </CartText>
        <CartText variant="micro" tone="muted" numberOfLines={1}>
          {subtitle}
        </CartText>
      </View>

      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </TouchableOpacity>
  );
};

const PaymentBottomSheet = forwardRef((props, ref) => {
  const {
    paymentModes = [],
    paymentMethod,
    setPaymentMethod,
    bottomInset = 0,
  } = props;

  const sheetRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }),
    [],
  );

  const snapPoints = useMemo(
    () => [`${Math.min(15 + paymentModes.length * 10, 70)}%`],
    [paymentModes.length],
  );

  const renderContent = useCallback(
    () => (
      <View style={styles.container}>
        <View style={styles.headingRow}>
          <CartText variant="heading">Pay using</CartText>
          <CartText variant="micro" tone="muted">
            Choose how you'd like to pay
          </CartText>
        </View>

        {paymentModes.map(mode => (
          <PaymentOption
            key={mode.paymentModeId}
            mode={mode}
            selected={paymentMethod === mode.paymentModeName}
            onPress={() => setPaymentMethod(mode.paymentModeName)}
          />
        ))}
      </View>
    ),
    [paymentModes, paymentMethod, setPaymentMethod],
  );

  return (
    <CustomBottomModal
      ref={sheetRef}
      snapPoints={snapPoints}
      bottomInset={bottomInset}
      renderContent={renderContent}
    />
  );
});

PaymentBottomSheet.displayName = 'PaymentBottomSheet';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.xs,
  },
  headingRow: {
    marginBottom: CART_SPACING.md,
    gap: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.card,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: CART_SPACING.md,
    marginBottom: CART_SPACING.md,
  },
  optionCardSelected: {
    borderColor: CART_COLORS.primaryEdge,
    backgroundColor: CART_COLORS.primaryTint,
  },
  optionDetails: {
    flex: 1,
    gap: 2,
  },
  radio: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: CART_RADIUS.pill,
    borderWidth: 1.5,
    borderColor: CART_COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: CART_COLORS.primary,
  },
  radioDot: {
    width: wp('2.4%'),
    height: wp('2.4%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.primary,
  },
});

export default React.memo(PaymentBottomSheet);
