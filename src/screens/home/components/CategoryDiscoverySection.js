import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FadeInUp } from 'react-native-reanimated';
import { FONTS } from '../../../styles/typography';
import CONFIG from '../../../globals/config';
import TokenProductCard from '../../../components/TokenProductCard';
import SeeAllButton from '../../../components/SeeAllButton';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import sectionCardStyles from './sectionCardStyles';
import categoryChipStyles from './categoryChipStyles';
import ProductBlockShimmer from './ProductBlockShimmer';
import { getStaggerDelay } from '../../../utils/staggerDelay';

const HOME_BG = require('../../../assets/images/homebg.png');

const ExploreShimmer = () => (
  <View style={sectionCardStyles.headerBackgroundbg}>
    <View
      style={{
        paddingHorizontal: wp('5%'),
        paddingTop: hp('3%'),
        paddingBottom: hp('3%'),
      }}
    >
      <ShimmerPlaceholder
        style={{
          width: wp('30%'),
          height: hp('3%'),
          borderRadius: 5,
          marginBottom: hp('2%'),
        }}
      />
      <View style={{ flexDirection: 'row', marginBottom: hp('3%') }}>
        {[1, 2, 4].map((_, i) => (
          <View
            key={i}
            style={{
              marginRight: wp('4%'),
              alignItems: 'center',
              width: wp('22.7%'),
            }}
          >
            <View style={categoryChipStyles.categoryItemContainer}>
              <ShimmerPlaceholder
                style={{
                  width: wp('17%'),
                  height: wp('17%'),
                  borderRadius: 15,
                }}
              />
            </View>
            <ShimmerPlaceholder
              style={{
                width: wp('15%'),
                height: hp('1.2%'),
                borderRadius: 3,
                marginTop: hp('1%'),
              }}
            />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2].map((_, i) => (
          <ShimmerPlaceholder
            key={i}
            style={{
              width: wp('35%'),
              height: hp('22%'),
              borderRadius: 20,
              marginRight: wp('4%'),
            }}
          />
        ))}
      </View>
    </View>
  </View>
);

const CategoryDiscoverySection = ({
  isHomeLoading,
  categoryDiscovery,
  shouldShow,
  categoryDiscoveryBackgroundImage,
  discoveryCategories,
  selectedDiscoveryCategory,
  onSelectCategory,
  isDiscoveryLoading,
  discoveryProducts,
  navigation,
}) => {
  if (isHomeLoading && !categoryDiscovery) return <ExploreShimmer />;
  if (!shouldShow) return null;

  return (
    <>
      <ImageBackground
        source={
          categoryDiscoveryBackgroundImage
            ? categoryDiscoveryBackgroundImage.uri
            : HOME_BG
        }
        style={sectionCardStyles.headerBackgroundbg}
        imageStyle={sectionCardStyles.headerBackgroundbgImage}
      >
        <View style={sectionCardStyles.headerBackgroundbgContent}>
          {discoveryCategories.length > 0 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: hp('2%'),
                  paddingHorizontal: wp('5%'),
                }}
              >
                <Text
                  style={[
                    sectionCardStyles.featuredProductsText,
                    { marginLeft: 0, marginVertical: 0, marginTop: 0 },
                  ]}
                >
                  Explore
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: wp('4.6%'),
                  paddingTop: hp('1%'),
                }}
              >
                {discoveryCategories.map((item, index) => (
                  <TouchableOpacity
                    key={(item.catId || item.id || index).toString()}
                    style={categoryChipStyles.item}
                    onPress={() => onSelectCategory(item)}
                  >
                    <View
                      style={[
                        categoryChipStyles.categoryItemContainer,
                        selectedDiscoveryCategory?.catId === item.catId &&
                          categoryChipStyles.categoryItemContainerActive,
                      ]}
                    >
                      <Image
                        source={{
                          uri: `${CONFIG.image_base_url}${item.imageUrl}`,
                        }}
                        style={categoryChipStyles.image}
                        resizeMode="contain"
                      />
                    </View>

                    <Text
                      style={[
                        categoryChipStyles.label,
                        selectedDiscoveryCategory?.catId === item.catId && {
                          color: '#F25000',
                          fontFamily: FONTS.gilroy.semiBold,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.catName || item.name}
                    </Text>

                    {selectedDiscoveryCategory?.catId === item.catId && (
                      <View
                        style={{
                          height: 2,
                          backgroundColor: '#F25000',
                          width: '80%',
                          marginTop: 4,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {isDiscoveryLoading ? (
            <View style={{ height: hp('30%') }}>
              <ProductBlockShimmer />
            </View>
          ) : (
            discoveryProducts.length > 0 && (
              <View>
                <FlatList
                  horizontal
                  data={discoveryProducts}
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
                  contentContainerStyle={{ paddingHorizontal: wp('4.6%') }}
                />
              </View>
            )
          )}
          {shouldShow && selectedDiscoveryCategory && (
            <SeeAllButton
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  catId: selectedDiscoveryCategory.catId,
                  catName: selectedDiscoveryCategory.catName,
                })
              }
              style={{ alignSelf: 'center' }}
            />
          )}
        </View>
      </ImageBackground>
      <View style={{ height: hp('2%') }} />
    </>
  );
};

export default CategoryDiscoverySection;
