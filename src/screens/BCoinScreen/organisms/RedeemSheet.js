import React, { useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import { CART_SPACING, CART_TYPE } from '@/styles/cartTheme';
import { hp } from '@/utils/responsive';

import { CoinText } from '../atoms';
import { SheetHeader } from '../molecules';
import { COIN_ICON, QUICK_AMOUNTS, REDEEM_METHODS } from '../constants';
import { formatAmount, formatCurrency, toNumber } from '../utils';
import { PALETTE, RADIUS } from '../theme';

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
              <CoinText variant="caption" tone="secondary">
                Available balance
              </CoinText>
              <CoinText variant="bodyStrong" style={styles.balanceValue}>
                {formatAmount(balance)} UD Coins
              </CoinText>
            </View>
          </View>
          <CoinText variant="price" tone="gold">
            {formatCurrency(balance * coinValue)}
          </CoinText>
        </View>

        <CoinText
          variant="labelStrong"
          tone="secondary"
          style={styles.fieldLabel}
        >
          Coins to redeem
        </CoinText>

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
          <CoinText variant="caption" tone="muted">
            coins
          </CoinText>
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
              <CoinText variant="captionStrong" tone="muted">
                {quick.label}
              </CoinText>
            </TouchableOpacity>
          ))}
        </View>

        {exceedsBalance ? (
          <CoinText variant="caption" tone="debit" style={styles.hint}>
            That's more than your available balance.
          </CoinText>
        ) : (
          <CoinText variant="caption" tone="muted" style={styles.hint}>
            You'll receive{' '}
            <CoinText variant="price" tone="credit">
              {payout}
            </CoinText>
          </CoinText>
        )}

        <CoinText
          variant="labelStrong"
          tone="secondary"
          style={[styles.fieldLabel, styles.methodLabel]}
        >
          Preferred method
        </CoinText>

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
                    color={
                      isActive ? PALETTE.textPrimary : PALETTE.textSecondary
                    }
                  />
                  <View style={[styles.radio, isActive && styles.radioActive]}>
                    {isActive && <View style={styles.radioDot} />}
                  </View>
                </View>
                <CoinText variant="bodyStrong" style={styles.methodLabelText}>
                  {item.label}
                </CoinText>
                <CoinText variant="micro" tone="muted">
                  {item.caption}
                </CoinText>
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
            <CoinText variant="cta" tone={canSubmit ? 'onDark' : 'faint'}>
              Submit request
            </CoinText>
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
    paddingHorizontal: CART_SPACING.xl,
    paddingTop: CART_SPACING.lg,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: CART_SPACING.lg,
    borderRadius: RADIUS.card,
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
  balanceValue: {
    marginTop: 2,
  },
  fieldLabel: {
    marginTop: CART_SPACING.xl,
    marginBottom: CART_SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: CART_SPACING.lg,
    height: 54,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.well,
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
    ...CART_TYPE.priceLarge,
    color: PALETTE.textPrimary,
  },
  quickRow: {
    flexDirection: 'row',
    gap: CART_SPACING.sm,
    marginTop: 10,
  },
  quickChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: CART_SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
  hint: {
    marginTop: CART_SPACING.md,
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
    padding: CART_SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.surface,
  },
  methodCardActive: {
    borderColor: PALETTE.selected,
    backgroundColor: PALETTE.selectedTint,
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
    borderColor: PALETTE.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: PALETTE.selected,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.selected,
  },
  methodLabelText: {
    marginTop: 10,
  },
  submit: {
    height: 52,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.orange,
    marginTop: 22,
  },
  submitDisabled: {
    backgroundColor: PALETTE.well,
  },
});

export default React.memo(RedeemSheet);
