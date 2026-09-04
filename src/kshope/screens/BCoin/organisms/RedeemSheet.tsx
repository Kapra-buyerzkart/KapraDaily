import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AppText } from '../../../components/atoms';
import { UI_TYPE } from '../../../theme/tokens';
import { SheetHeader } from '../molecules';
import { COIN_ICON, QUICK_AMOUNTS, REDEEM_METHODS } from '../constants';
import { formatAmount, formatCurrency, toNumber } from '../utils';
import { PALETTE, RADIUS, SPACING } from '../theme';
import BottomSheet from './BottomSheet';

export type RedeemMethod = 'bank' | 'wallet';

interface RedeemSheetProps {
  visible: boolean;
  onClose: () => void;
  balance: number;
  coinValue: number;
  amount: string;
  onAmountChange: (value: string) => void;
  method: RedeemMethod;
  onMethodChange: (method: RedeemMethod) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const RedeemSheet: React.FC<RedeemSheetProps> = ({
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
  const enteredAmount = toNumber(amount);
  const exceedsBalance = enteredAmount > balance;
  const canSubmit = enteredAmount > 0 && !exceedsBalance && !isSubmitting;

  const payout = useMemo(
    () => formatCurrency(enteredAmount * coinValue),
    [coinValue, enteredAmount],
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightPercent={88}>
      <SheetHeader
        title="Redeem UD Coins"
        caption="Convert your coins into cash"
        onClose={onClose}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceLeft}>
            <Image source={COIN_ICON} style={styles.balanceCoin} />
            <View>
              <AppText variant="caption" tone="secondary">
                Available balance
              </AppText>
              <AppText variant="bodyStrong" style={styles.balanceValue}>
                {formatAmount(balance)} UD Coins
              </AppText>
            </View>
          </View>
          <AppText variant="price" tone={PALETTE.goldDeep}>
            {formatCurrency(balance * coinValue)}
          </AppText>
        </View>

        <AppText
          variant="labelStrong"
          tone="secondary"
          style={styles.fieldLabel}
        >
          Coins to redeem
        </AppText>

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
          <AppText variant="caption" tone="muted">
            coins
          </AppText>
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
              <AppText variant="captionStrong" tone="muted">
                {quick.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {exceedsBalance ? (
          <AppText variant="caption" tone="danger" style={styles.hint}>
            That's more than your available balance.
          </AppText>
        ) : (
          <AppText variant="caption" tone="muted" style={styles.hint}>
            You'll receive{' '}
            <AppText variant="price" tone={PALETTE.credit}>
              {payout}
            </AppText>
          </AppText>
        )}

        <AppText
          variant="labelStrong"
          tone="secondary"
          style={[styles.fieldLabel, styles.methodLabel]}
        >
          Preferred method
        </AppText>

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
                <AppText variant="bodyStrong" style={styles.methodLabelText}>
                  {item.label}
                </AppText>
                <AppText variant="micro" tone="muted">
                  {item.caption}
                </AppText>
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
            <AppText variant="cta" tone={canSubmit ? 'onDark' : 'faint'}>
              Submit request
            </AppText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </BottomSheet>
  );
};

export default React.memo(RedeemSheet);

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
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
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: SPACING.lg,
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
    ...UI_TYPE.priceLarge,
    color: PALETTE.textPrimary,
  },
  quickRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 10,
  },
  quickChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.well,
  },
  hint: {
    marginTop: SPACING.md,
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
    padding: SPACING.md,
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
