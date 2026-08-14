import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import images from '@/assets/images';

import { TicketText } from '../atoms';

const VoucherEmptyState = ({ text = 'No vouchers yet' }) => (
  <View style={styles.centered}>
    <Image
      source={images.no_vocher_booking}
      style={styles.emptyImage}
      resizeMode="contain"
    />
    <TicketText tone="muted">{text}</TicketText>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyImage: {
    width: 152,
    height: 103,
  },
});

export default React.memo(VoucherEmptyState);
