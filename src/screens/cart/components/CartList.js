import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import CartProductCard from '../../../components/CartProductCard';
import { styles } from '../styles/Cart.styles';

const ItemSeparator = () => (
  <View style={styles.itemCardWrap}>
    <View style={styles.itemSeparator} />
  </View>
);

const CartList = ({
  listRef,
  data,
  pincodeAreaId,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
  onScroll,
}) => {
  const renderCartItem = useCallback(
    ({ item }) => (
      <View style={styles.itemCardWrap}>
        <CartProductCard item={item} pincodeAreaIdOverride={pincodeAreaId} />
      </View>
    ),
    [pincodeAreaId],
  );

  const keyExtractor = useCallback(
    (item, idx) => String(item.cartItemId || item.productId || idx),
    [],
  );

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderCartItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      initialNumToRender={8}
      windowSize={7}
      removeClippedSubviews
      contentContainerStyle={styles.listContent}
    />
  );
};

export default CartList;
