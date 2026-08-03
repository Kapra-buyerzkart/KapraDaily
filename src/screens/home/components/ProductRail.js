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
      <TokenProductCard
        item={item}
        entering={
          animateEntrance ? FadeInUp.delay(getStaggerDelay(index)) : undefined
        }
        onPress={() =>
          navigation.navigate('ProductDetailsScreen', {
            productId: item.productId || item.id,
            product: item,
          })
        }
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
