import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import VoucherCard from '@/components/events/VoucherCard';

const VoucherGrid = ({ vouchers = [], loading = false, onVoucherPress }) => {
  if (loading) {
    return (
      <View style={[styles.grid, styles.centered]}>
        <ActivityIndicator color="#9A5CFF" />
      </View>
    );
  }

  if (!vouchers?.length) {
    return (
      <View style={[styles.grid, styles.centered]}>
        <Text style={styles.emptyText}>No vouchers yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {vouchers.map((item, index) => (
        <VoucherCard
          key={item?.purchaseId || item?.voucherId || item?.id || index}
          item={item}
          onPress={onVoucherPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
  },
});

export default VoucherGrid;
