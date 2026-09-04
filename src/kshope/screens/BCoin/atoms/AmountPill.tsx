import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/atoms';
import { PALETTE, RADIUS } from '../theme';

interface AmountPillProps {
  isCredit: boolean;
  value: string;
  unit: string;
}

const AmountPill: React.FC<AmountPillProps> = ({ isCredit, value, unit }) => (
  <View
    style={[
      styles.pill,
      { backgroundColor: isCredit ? PALETTE.creditTint : PALETTE.debitTint },
    ]}
  >
    <AppText variant="price" tone={isCredit ? PALETTE.credit : PALETTE.debit}>
      {isCredit ? '+' : ''}
      {value}
    </AppText>
    <AppText
      variant="micro"
      tone={isCredit ? PALETTE.credit : PALETTE.debit}
      style={styles.unit}
    >
      {unit}
    </AppText>
  </View>
);

export default React.memo(AmountPill);

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.stepper,
    minWidth: 78,
  },
  unit: {
    opacity: 0.85,
    marginTop: 1,
  },
});
