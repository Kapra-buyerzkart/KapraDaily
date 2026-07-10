import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeInUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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

const DiscoveryChip = React.memo(function DiscoveryChip({
  item,
  isActive,
  onPress,
}) {
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 180 });
  }, [isActive, activeProgress]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      ['#FFFFFF', '#FFE9E0'],
    ),
    borderColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      ['#F3F4F6', '#F25000'],
    ),
  }));

  const underlineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: activeProgress.value,
    transform: [{ scaleX: activeProgress.value }],
  }));

  return (
    <TouchableOpacity style={categoryChipStyles.item} onPress={onPress}>
      <Animated.View
        style={[categoryChipStyles.categoryItemContainer, containerAnimatedStyle]}
      >
        <Image
          source={{ uri: `${CONFIG.image_base_url}${item.imageUrl}` }}
          style={categoryChipStyles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Text
        style={[categoryChipStyles.label, isActive && styles.activeLabel]}
        numberOfLines={2}
      >
        {item.catName || item.name}
      </Text>

      <Animated.View style={[styles.chipUnderline, underlineAnimatedStyle]} />
    </TouchableOpacity>
  );
});

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
                  <DiscoveryChip
                    key={(item.catId || item.id || index).toString()}
                    item={item}
                    isActive={selectedDiscoveryCategory?.catId === item.catId}
                    onPress={() => onSelectCategory(item)}
                  />
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

const styles = StyleSheet.create({
  activeLabel: {
    color: '#F25000',
    fontFamily: FONTS.gilroy.semiBold,
  },
  chipUnderline: {
    height: 2,
    backgroundColor: '#F25000',
    width: '80%',
    marginTop: 4,
    borderRadius: 2,
  },
});

export default CategoryDiscoverySection;
