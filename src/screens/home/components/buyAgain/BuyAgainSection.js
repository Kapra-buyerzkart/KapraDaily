import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { GUTTER } from '@/styles/homeTheme';
import TokenProductCard from '@/components/TokenProductCard';
import SectionHeader from '../SectionHeader';
import styles from './styles';
import { CARD_MARGIN, CARD_STRIDE } from './constants';

const EMPTY_PRODUCTS = [];

// Mirrors railContent's paddingLeft, otherwise scroll offsets land short by it.
const LEADING_OFFSET = GUTTER - CARD_MARGIN;

const BuyAgainRailCard = React.memo(function BuyAgainRailCard({
  item,
  index,
  navigation,
}) {
  const handlePress = useCallback(
    () =>
      navigation.navigate('ProductDetailsScreen', {
        productId: item.productId || item.id,
        product: item,
      }),
    [navigation, item],
  );

  return <TokenProductCard item={item} index={index} onPress={handlePress} />;
});

/**
 * Renders nothing until the rail has products. A customer with no order history
 * never sees an empty shell, and the section cannot collapse under the scroll
 * position mid-load the way a shimmer placeholder would.
 */
const BuyAgainSection = ({ products, navigation }) => {
  const items = products || EMPTY_PRODUCTS;

  const keyExtractor = useCallback(
    (item, index) => (item.productId || item.id || index).toString(),
    [],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_STRIDE,
      offset: LEADING_OFFSET + CARD_STRIDE * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <BuyAgainRailCard item={item} index={index} navigation={navigation} />
    ),
    [navigation],
  );

  const handleViewAll = useCallback(
    () => navigation.navigate('MyOrdersScreen'),
    [navigation],
  );

  if (items.length === 0) return null;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.section}>
        <SectionHeader
          eyebrow="From your orders"
          title="Buy it"
          titleAccent="again"
          subtitle="Your regulars, one tap away"
          actionLabel="My orders"
          onAction={handleViewAll}
        />

        <FlatList
          horizontal
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.railContent}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={false}
          decelerationRate="normal"
        />
      </View>
    </>
  );
};

export default React.memo(BuyAgainSection);
