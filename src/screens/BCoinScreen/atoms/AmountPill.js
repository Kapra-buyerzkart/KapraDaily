import React from 'react';
import { StyleSheet, View } from 'react-native';

import CoinText from './CoinText';
import { PALETTE, RADIUS } from '../theme';

const AmountPill = ({ isCredit, value, unit }) => (
  <View
    style={[
      styles.pill,
      { backgroundColor: isCredit ? PALETTE.creditTint : PALETTE.debitTint },
    ]}
  >
    <CoinText variant="price" tone={isCredit ? 'credit' : 'debit'}>
      {isCredit ? '+' : ''}
      {value}
    </CoinText>
    <CoinText
      variant="micro"
      tone={isCredit ? 'credit' : 'debit'}
      style={styles.unit}
    >
      {unit}
    </CoinText>
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
