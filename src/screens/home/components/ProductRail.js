import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TokenProductCard from '../../../components/TokenProductCard';
const CARD_STRIDE = wp('37%');

const DEFAULT_CONTENT_STYLE = {
  paddingLeft: wp('3.2%'),
  paddingRight: wp('2%'),
};

const RailCard = React.memo(function RailCard({ item, index, navigation }) {
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

const ProductRail = ({
  items,
  navigation,
  contentContainerStyle = DEFAULT_CONTENT_STYLE,
}) => {
  const keyExtractor = useCallback(
    (item, index) => (item.productId || item.id || index).toString(),
    [],
  );

  const leadingOffset = useMemo(
    () => StyleSheet.flatten(contentContainerStyle)?.paddingLeft || 0,
    [contentContainerStyle],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: CARD_STRIDE,
      offset: leadingOffset + CARD_STRIDE * index,
      index,
    }),
    [leadingOffset],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <RailCard item={item} index={index} navigation={navigation} />
    ),
    [navigation],
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
