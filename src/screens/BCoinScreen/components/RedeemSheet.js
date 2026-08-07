import React, { useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import { FONTS } from '@/styles/typography';
import { hp } from '@/utils/responsive';

import SheetHeader from './SheetHeader';
import { COIN_ICON, QUICK_AMOUNTS, REDEEM_METHODS } from '../constants';
import { formatAmount, formatCurrency, toNumber } from '../utils';
import { PALETTE, RADIUS, SHADOW } from '../theme';

const RedeemSheet = ({
  visible,
  onClose,
  balance,
  coinValue,
  amount,
  onAmountChange,
  method,
  onMethodChange,
  isSubmitting,
  onSubmit,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  const enteredAmount = toNumber(amount);
  const exceedsBalance = enteredAmount > balance;
  const canSubmit = enteredAmount > 0 && !exceedsBalance && !isSubmitting;

  const payout = useMemo(
    () => formatCurrency(enteredAmount * coinValue),
    [coinValue, enteredAmount],
  );

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp(88)}
      scrollable={false}
      onClose={onClose}
      contentStyle={styles.sheet}
    >
      <SheetHeader
        title="Redeem UD Coins"
        caption="Convert your coins into cash"
        onClose={onClose}
      />

      <View style={styles.body}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceLeft}>
            <Image source={COIN_ICON} style={styles.balanceCoin} />
            <View>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceValue}>
                {formatAmount(balance)} UD Coins
              </Text>
            </View>
          </View>
          <Text style={styles.balanceWorth}>
            {formatCurrency(balance * coinValue)}
          </Text>
        </View>

        <Text style={styles.fieldLabel}>Coins to redeem</Text>

        <View
          style={[styles.inputRow, exceedsBalance && styles.inputRowInvalid]}
        >
          <Image source={COIN_ICON} style={styles.inputCoin} />
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={PALETTE.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={onAmountChange}
          />
          <Text style={styles.inputSuffix}>coins</Text>
        </View>

        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map(quick => (
            <TouchableOpacity
              key={quick.id}
              style={styles.quickChip}
              activeOpacity={0.75}
              onPress={() =>
                onAmountChange(String((balance * quick.fraction).toFixed(2)))
              }
            >
              <Text style={styles.quickChipText}>{quick.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {exceedsBalance ? (
          <Text style={styles.errorHint}>
            That's more than your available balance.
          </Text>
        ) : (
          <Text style={styles.payoutHint}>
            You'll receive <Text style={styles.payoutValue}>{payout}</Text>
          </Text>
        )}

        <Text style={[styles.fieldLabel, styles.methodLabel]}>
          Preferred method
        </Text>

        <View style={styles.methodRow}>
          {REDEEM_METHODS.map(item => {
            const isActive = method === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.methodCard, isActive && styles.methodCardActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                onPress={() => onMethodChange(item.id)}
              >
                <View style={styles.methodTop}>
                  <MaterialIcons
                    name={item.icon}
                    size={18}
                    color={isActive ? PALETTE.orange : PALETTE.textSecondary}
                  />
                  <View
                    style={[styles.radio, isActive && styles.radioActive]}
                  >
                    {isActive && <View style={styles.radioDot} />}
                  </View>
                </View>
                <Text
                  style={[styles.methodLabelText, isActive && styles.methodTextActive]}
                >
                  {item.label}
                </Text>
                <Text style={styles.methodCaption}>{item.caption}</Text>
              </Pressable>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.submit, !canSubmit && styles.submitDisabled]}
          activeOpacity={0.85}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color={PALETTE.surface} />
          ) : (
            <Text
              style={[styles.submitText, !canSubmit && styles.submitTextIdle]}
            >
              Submit request
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 6,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: PALETTE.goldTint,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  balanceCoin: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  balanceLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 11.5,
    color: PALETTE.textSecondary,
  },
  balanceValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15,
    color: PALETTE.textPrimary,
    marginTop: 2,
  },
  balanceWorth: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15,
    color: PALETTE.goldDeep,
  },
  fieldLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 12,
    color: PALETTE.textSecondary,
    marginTop: 20,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 54,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.canvas,
  },
  inputRowInvalid: {
    borderColor: PALETTE.debit,
    backgroundColor: PALETTE.debitTint,
  },
  inputCoin: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: FONTS.gilroy.bold,
    fontSize: 18,
    color: PALETTE.textPrimary,
  },
  inputSuffix: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 12.5,
    color: PALETTE.textMuted,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.surface,
  },
  quickChipText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 12,
    color: PALETTE.textSecondary,
  },
  payoutHint: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 12.5,
    color: PALETTE.textMuted,
    marginTop: 12,
  },
  payoutValue: {
    fontFamily: FONTS.gilroy.bold,
    color: PALETTE.credit,
  },
  errorHint: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 12.5,
    color: PALETTE.debit,
    marginTop: 12,
  },
  methodLabel: {
    marginTop: 18,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  methodCard: {
    flex: 1,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.2,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.surface,
  },
  methodCardActive: {
    borderColor: PALETTE.orange,
    backgroundColor: PALETTE.orangeTint,
  },
  methodTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: PALETTE.orange,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.orange,
  },
  methodLabelText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 13.5,
    color: PALETTE.textPrimary,
    marginTop: 10,
  },
  methodTextActive: {
    color: PALETTE.orange,
  },
  methodCaption: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 11,
    color: PALETTE.textMuted,
    marginTop: 2,
  },
  submit: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.orange,
    marginTop: 22,
    ...SHADOW.cta,
  },
  submitDisabled: {
    backgroundColor: PALETTE.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 15.5,
    color: PALETTE.surface,
  },
  submitTextIdle: {
    color: PALETTE.disabledText,
  },
});

export default React.memo(RedeemSheet);
