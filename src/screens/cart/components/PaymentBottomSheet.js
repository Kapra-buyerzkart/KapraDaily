import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBottomModal from '../../../components/CustomBottomModal';
import { FONTS } from '../../../styles/typography';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
} from '../../../styles/cartTheme';
import { getPaymentMeta } from '../paymentMeta';

const PaymentOption = ({ mode, selected, onPress }) => {
  const { label, icon } = getPaymentMeta(mode.paymentModeName);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.optionCard, selected && styles.optionCardSelected]}
      onPress={onPress}
    >
      <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
        <MaterialCommunityIcons
          name={icon}
          size={wp('5%')}
          color={CART_COLORS.primary}
        />
      </View>
      <Text style={styles.optionLabel} numberOfLines={1}>
        {label}
      </Text>
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
    () => [`${Math.min(18 + paymentModes.length * 5, 64)}%`],
    [paymentModes.length],
  );

  const renderContent = useCallback(
    () => (
      <View style={styles.container}>
        <Text style={styles.title}>Pay using</Text>

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
  title: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4.2%'),
    color: CART_COLORS.textPrimary,
    marginBottom: CART_SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.button,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.md,
    marginBottom: CART_SPACING.md,
  },
  optionCardSelected: {
    borderColor: CART_COLORS.primary,
    backgroundColor: CART_COLORS.primaryTint,
  },
  optionIcon: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    borderWidth: 1.5,
    borderColor: CART_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CART_SPACING.md,
  },
  optionIconSelected: {
    backgroundColor: CART_COLORS.card,
  },
  optionLabel: {
    flex: 1,
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: CART_COLORS.textPrimary,
  },
});

export default React.memo(PaymentBottomSheet);
