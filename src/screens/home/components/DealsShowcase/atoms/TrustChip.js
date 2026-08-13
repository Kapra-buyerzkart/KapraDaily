import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { CART_SPACING } from '@/styles/cartTheme';
import DealText from './DealText';
import { CHIP_ICON, PEACH } from '../tokens';

const TrustChip = ({ icon, label, caption }) => (
  <View style={styles.chip}>
    <View style={styles.disc}>
      <Feather name={icon} size={CHIP_ICON * 0.5} color={PEACH.deep} />
    </View>

    <View style={styles.copy}>
      <DealText variant="chip" tone="deep" numberOfLines={1}>
        {label}
      </DealText>
      <DealText variant="chip" tone="deep" numberOfLines={1}>
        {caption}
      </DealText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  disc: {
    width: CHIP_ICON,
    height: CHIP_ICON,
    borderRadius: CHIP_ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PEACH.washSoft,
  },
  copy: {
    flex: 1,
  },
});

export default React.memo(TrustChip);
