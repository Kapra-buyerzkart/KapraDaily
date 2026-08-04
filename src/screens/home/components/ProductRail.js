import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FadeInUp } from 'react-native-reanimated';
import TokenProductCard from '../../../components/TokenProductCard';
import { getStaggerDelay } from '../../../utils/staggerDelay';
const CARD_STRIDE = wp('37%');

const DEFAULT_CONTENT_STYLE = {
  paddingLeft: wp('3.2%'),
  paddingRight: wp('2%'),
};

// The navigate closure lives here, bound to this cell's own item, instead of
// being rebuilt inside the rail's renderItem. Built there it was a fresh
// function per card per render, which meant TokenProductCard's React.memo
// never hit inside a rail: any re-render of the rail (a refetch landing, a
// discovery category swapping datasets) re-rendered every mounted card and
// every product image with it.
const RailCard = React.memo(function RailCard({
  item,
  index,
  animateEntrance,
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

  return (
    <TokenProductCard
      item={item}
      // Built here rather than passed in: a FadeInUp descriptor is a new
      // object every time it is constructed, so handing one down as a prop
      // would have defeated this memo the same way the closure did. It is
      // only read on mount, so recomputing it on a re-render costs nothing.
      entering={
        animateEntrance ? FadeInUp.delay(getStaggerDelay(index)) : undefined
      }
      onPress={handlePress}
    />
  );
});

const ProductRail = ({
  items,
  navigation,
  contentContainerStyle = DEFAULT_CONTENT_STYLE,
  animateEntrance = true,
}) => {
  const keyExtractor = useCallback(
    (item, index) => (item.productId || item.id || index).toString(),
    [],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_STRIDE,
      offset: CARD_STRIDE * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <RailCard
        item={item}
        index={index}
        animateEntrance={animateEntrance}
        navigation={navigation}
      />
    ),
    [navigation, animateEntrance],
  );

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      // Windowing for a horizontal rail: render a little over one screen width
      // up front and extend in small batches, so a rail of 30+ products does
      // not mount every card during the home screen's first commit.
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      updateCellsBatchingPeriod={50}
      // Still off: on Android this drops cells in a horizontal list nested in a
      // vertical scroll view. The shadow it was originally protecting never
      // existed (TokenProductCard's `ELEVATION.sm` resolved to nothing).
      removeClippedSubviews={false}
      decelerationRate="normal"
    />
  );
};

export default React.memo(ProductRail);
export { CARD_STRIDE, DEFAULT_CONTENT_STYLE };
