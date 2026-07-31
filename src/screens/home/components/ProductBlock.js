import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FadeInUp } from 'react-native-reanimated';
import { FONTS } from '../../../styles/typography';
import TokenProductCard from '../../../components/TokenProductCard';
import CONFIG from '../../../globals/config';
import sectionCardStyles from './sectionCardStyles';
import ProductBlockShimmer from './ProductBlockShimmer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getStaggerDelay } from '../../../utils/staggerDelay';

const defaultShouldShowSeeAll = count => count > 3;
const DEFAULT_SEE_ALL_STYLE = { alignSelf: 'center' };

const ProductBlock = ({
  isLoading,
  shouldShow,
  backgroundImage,
  discountBadge,
  showTitleImage,
  titleImageSource,
  titleImageResizeMode,
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
      <View style={styles.surface}>
        <View style={sectionCardStyles.headerBackgroundbgContent}>
          <View style={styles.headerRow}>
            <Text
              style={[sectionCardStyles.featuredProductsText, titleExtraStyle]}
            >
              {title}
            </Text>

            {shouldShowSeeAll(items.length) && (
              // Previously carried two `style` props; the first (an empty
              // object) was silently discarded by JSX. Kept the one that
              // actually applied.
              <TouchableOpacity
                onPress={handleViewAll}
                hitSlop={40}
                style={styles.viewAllRow}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <View style={styles.viewAllChevron}>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={15}
                    color="#323135"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

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
      </View>
      {trailingSpacer && <View style={styles.trailingSpacer} />}
    </>
  );
};

// Resolves the title-image source the same way each of the 3 original blocks
// did: prefer the API-mapped banner image, fall back to a raw `Image` field.
export const resolveTitleImageSource = (block, titleImage) =>
  titleImage?.uri
    ? titleImage.uri
    : { uri: `${CONFIG.image_base_url}${block?.Image || block?.image}` };

const styles = StyleSheet.create({
  surface: {
    backgroundColor: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: FONTS.gilroy.medium,
  },
  viewAllChevron: {
    paddingLeft: 5,
  },
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
