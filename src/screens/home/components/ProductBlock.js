import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TokenProductCard from '../../../components/TokenProductCard';
import SeeAllButton from '../../../components/SeeAllButton';
import FlatOfferBadge from '../../../components/FlatOfferBadge';
import CONFIG from '../../../globals/config';
import sectionCardStyles from './sectionCardStyles';
import ProductBlockShimmer from './ProductBlockShimmer';

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
  shouldShowSeeAll = count => count > 3,
  seeAllButtonStyle = { alignSelf: 'center' },
  trailingSpacer = false,
  navigation,
}) => {
  if (isLoading) return <ProductBlockShimmer />;
  if (!shouldShow) return null;

  return (
    <>
      <ImageBackground
        source={backgroundImage}
        style={sectionCardStyles.headerBackgroundbg}
        imageStyle={sectionCardStyles.headerBackgroundbgImage}
      >
        <View style={sectionCardStyles.headerBackgroundbgContent}>
          {showTitleImage && (
            <Image
              source={titleImageSource}
              style={sectionCardStyles.starImage}
              resizeMode={titleImageResizeMode}
            />
          )}

          <Text
            style={[sectionCardStyles.featuredProductsText, titleExtraStyle]}
          >
            {title}
          </Text>

          <View style={sectionCardStyles.tokenTopDivider} />

          <FlatList
            horizontal
            data={items}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            renderItem={({ item }) => (
              <TokenProductCard
                item={item}
                onPress={() =>
                  navigation.navigate('ProductDetailsScreen', {
                    productId: item.productId || item.id,
                    product: item,
                  })
                }
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
          />

          {shouldShowSeeAll(items.length) && (
            <SeeAllButton
              onPress={() =>
                navigation.navigate('ProductListScreen', {
                  title,
                  products: items,
                })
              }
              style={seeAllButtonStyle}
            />
          )}
        </View>
      </ImageBackground>
      {trailingSpacer && <View style={{ height: hp('1%') }} />}
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
  flatOfferBadgeOverlay: {
    position: 'absolute',
    top: -hp('1%'),
    left: wp('2%'),
    zIndex: 5,
    paddingTop: 0,
    paddingLeft: 0,
  },
});

export default ProductBlock;
