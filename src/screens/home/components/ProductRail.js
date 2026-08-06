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
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={false}
      decelerationRate="normal"
    />
  );
};

export default React.memo(ProductRail);
export { CARD_STRIDE, DEFAULT_CONTENT_STYLE };
