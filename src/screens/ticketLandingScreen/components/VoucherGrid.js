import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import images from '@/assets/images';
import VoucherCard from '@/components/events/VoucherCard';
import VoucherGridSkeleton from './VoucherGridSkeleton';

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
            tintColor="#9A5CFF"
            colors={['#9A5CFF']}
            progressBackgroundColor="#1A1A1A"
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Image
            source={images.no_vocher_booking}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>{emptyText}</Text>
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
    gap: 16,
  },
  emptyImage: {
    width: 152,
    height: 103,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
  },
});

export default React.memo(VoucherGrid);
