import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FadeInUp } from 'react-native-reanimated';
import TokenProductCard from '../../../components/TokenProductCard';
import ProductBlockShimmer from './ProductBlockShimmer';
import SectionHeader from './SectionHeader';
import { getStaggerDelay } from '../../../utils/staggerDelay';
import { SPACE, divider } from '../homeTheme';

const defaultShouldShowSeeAll = count => count > 3;
const DEFAULT_SEE_ALL_STYLE = { alignSelf: 'center' };

const ProductBlock = ({
  isLoading,
  shouldShow,
  title,
  titleExtraStyle,
  items,
  contentContainerStyle,
  shouldShowSeeAll = defaultShouldShowSeeAll,
  seeAllButtonStyle = DEFAULT_SEE_ALL_STYLE,
  trailingSpacer = false,
  navigation,
}) => {
  // Stable identities so FlatList can skip re-rendering cells whose data did
  // not change. As inline arrows these were new functions on every render, so
  // every card in the rail re-rendered whenever the parent did.
  const keyExtractor = useCallback(
    (item, index) => (item.productId || item.id || index).toString(),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <TokenProductCard
        item={item}
        entering={FadeInUp.delay(getStaggerDelay(index))}
        onPress={() =>
          navigation.navigate('ProductDetailsScreen', {
            productId: item.productId || item.id,
            product: item,
          })
        }
      />
    ),
    [navigation],
  );

  const handleViewAll = useCallback(
    () => navigation.navigate('SearchScreen', { title, products: items }),
    [navigation, title, items],
  );

  if (isLoading) return <ProductBlockShimmer />;
  if (!shouldShow) return null;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.surface}>
        <SectionHeader
          title={title}
          titleStyle={titleExtraStyle}
          onAction={shouldShowSeeAll(items.length) ? handleViewAll : undefined}
        />

        <FlatList
          horizontal
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          // Windowing for a horizontal rail: render a little over one screen
          // width up front and extend in small batches, so a rail of 30+
          // products does not mount every card during the home screen's
          // first commit.
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={false}
        />
      </View>
      {trailingSpacer && <View style={styles.trailingSpacer} />}
    </>
  );
};

const styles = StyleSheet.create({
  // Flat: the rail is part of the page, not a card on it. Consecutive rails are
  // told apart by the header's type hierarchy and a hairline rule, since two
  // adjacent product rails on plain white would otherwise run together.
  surface: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  divider,
  trailingSpacer: {
    height: hp('1%'),
  },
  flatOfferBadgeOverlay: {
    position: 'absolute',
    top: -hp('1%'),
    left: wp('2%'),
    zIndex: 5,
    paddingTop: 0,
    paddingLeft: 0,
  },
});

export default React.memo(ProductBlock);
