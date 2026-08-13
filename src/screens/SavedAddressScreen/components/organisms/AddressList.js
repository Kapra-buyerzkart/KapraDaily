import { View, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { ACCENT } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { entrance } from '../../motion';
import SectionLabel from '../atoms/SectionLabel';
import AddNewAddressCTA from '../molecules/AddNewAddressCTA';
import AddressCard from '../molecules/AddressCard';
import AddressCardSkeleton from '../molecules/AddressCardSkeleton';
import AddressEmptyState from '../molecules/AddressEmptyState';

const SKELETON_COUNT = 3;

export default function AddressList({
  addresses,
  isLoading,
  isFirstLoad,
  onRefresh,
  onAdd,
  onSelect,
  onEdit,
  onDelete,
  scrollY,
}) {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderItem = useCallback(
    ({ item, index }) => (
      <AddressCard
        item={item}
        index={index}
        onSelect={() => onSelect(item.id)}
        onEdit={() => onEdit(item.raw)}
        onDelete={() => onDelete(item.id)}
      />
    ),
    [onSelect, onEdit, onDelete],
  );

  const listHeader = useCallback(
    () => (
      <>
        <Animated.View entering={entrance(0)}>
          <AddNewAddressCTA onPress={onAdd} />
        </Animated.View>
        {(isFirstLoad || addresses.length > 0) && (
          <SectionLabel title="Saved addresses" />
        )}
      </>
    ),
    [onAdd, isFirstLoad, addresses.length],
  );

  const listEmpty = useCallback(
    () =>
      isFirstLoad ? (
        <View>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <AddressCardSkeleton key={index} />
          ))}
        </View>
      ) : (
        <AddressEmptyState />
      ),
    [isFirstLoad],
  );

  return (
    <Animated.FlatList
      data={addresses}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isFirstLoad}
          onRefresh={onRefresh}
          tintColor={ACCENT.primary}
          colors={[ACCENT.primary]}
        />
      }
    />
  );
}
