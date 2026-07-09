import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FadeInUp } from 'react-native-reanimated';
import { FONTS } from '../../../styles/typography';
import TokenProductCard from '../../../components/TokenProductCard';
import SeeAllButton from '../../../components/SeeAllButton';
import FlatOfferBadge from '../../../components/FlatOfferBadge';
import CONFIG from '../../../globals/config';
import sectionCardStyles from './sectionCardStyles';
import ProductBlockShimmer from './ProductBlockShimmer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getStaggerDelay } from '../../../utils/staggerDelay';

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
      <View style={{ backgroundColor: 'white' }}>
        <View style={sectionCardStyles.headerBackgroundbgContent}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 20,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={[sectionCardStyles.featuredProductsText, titleExtraStyle]}
            >
              {title}
            </Text>

            {shouldShowSeeAll(items.length) && (
              <TouchableOpacity
                style={{}}
                onPress={() =>
                  navigation.navigate('SearchScreen', {
                    title,
                    products: items,
                  })
                }
                hitSlop={40}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: FONTS.gilroy.medium,
                  }}
                >
                  View All
                </Text>
                <View style={{ paddingLeft: 5 }}>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={15}
                    color="#323135"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* <View style={sectionCardStyles.tokenTopDivider} /> */}

          <FlatList
            horizontal
            data={items}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            renderItem={({ item, index }) => (
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
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
          />

          {/* {shouldShowSeeAll(items.length) && (
            <SeeAllButton
              onPress={() =>
                navigation.navigate('ProductListScreen', {
                  title,
                  products: items,
                })
              }
              style={seeAllButtonStyle}
            />
          )} */}
        </View>
      </View>
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
