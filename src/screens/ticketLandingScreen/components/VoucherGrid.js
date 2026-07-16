import React, { useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import VoucherCard from '@/components/events/VoucherCard';

const keyExtractor = (item, index) =>
  String(item?.purchaseId || item?.voucherId || item?.id || index);

const VoucherGrid = ({
  vouchers = [],
  loading = false,
  onVoucherPress,
  bottomInset = 0,
}) => {
  const renderItem = useCallback(
    ({ item, index }) => (
      <VoucherCard item={item} onPress={onVoucherPress} index={index} />
    ),
    [onVoucherPress],
  );

  if (loading) {
    return (
      <View style={[styles.list, styles.centered]}>
        <ActivityIndicator color="#9A5CFF" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={vouchers}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomInset + 20 },
      ]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No vouchers yet</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  column: {
    gap: 12,
    marginBottom: 12,
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

export default React.memo(VoucherGrid);
