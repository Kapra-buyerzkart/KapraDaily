import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import VoucherCard from '@/components/events/VoucherCard';

import { COLORS } from '../../theme';
import { VoucherEmptyState, VoucherGridSkeleton } from '../molecules';

const keyExtractor = (item, index) =>
  String(item?.purchaseId || item?.voucherId || item?.id || index);

const VoucherGrid = ({
  vouchers = [],
  loading = false,
  onVoucherPress,
  bottomInset = 0,
  ListHeaderComponent,
  emptyText = 'No vouchers yet',
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = useCallback(
    ({ item, index }) => (
      <VoucherCard item={item} onPress={onVoucherPress} index={index} />
    ),
    [onVoucherPress],
  );

  if (loading) {
    return (
      <View style={styles.list}>
        <VoucherGridSkeleton />
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
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
            progressBackgroundColor={COLORS.refreshSurface}
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<VoucherEmptyState text={emptyText} />}
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
});

export default React.memo(VoucherGrid);
