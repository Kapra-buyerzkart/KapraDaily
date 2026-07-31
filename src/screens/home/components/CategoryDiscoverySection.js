import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
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
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import ProductBlockShimmer from './ProductBlockShimmer';
import SectionHeader from './SectionHeader';
import { getStaggerDelay } from '../../../utils/staggerDelay';
import {
  INK,
  ACCENT,
  SURFACE,
  RADIUS,
  SPACE,
  GUTTER,
  HAIRLINE,
  divider,
} from '../homeTheme';

const CHIP_ICON = wp('6.4%');

const ExploreShimmer = () => (
  <View style={styles.section}>
    <View style={styles.shimmerHeader}>
      <ShimmerPlaceholder style={styles.shimmerEyebrow} />
      <ShimmerPlaceholder style={styles.shimmerTitle} />
    </View>
    <View style={styles.shimmerChipRow}>
      {[1, 2, 3].map((_, i) => (
        <ShimmerPlaceholder key={i} style={styles.shimmerChip} />
      ))}
    </View>
    <ProductBlockShimmer />
  </View>
);

// The discovery categories used to repeat the exact tile-and-label shape of the
// grid higher up the page, so the two sections read as the same control twice.
// As inline pills they are unmistakably a filter for the rail beneath them, and
// a row of them fits far more categories in the same vertical space.
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
      [SURFACE.base, ACCENT.primary],
    ),
    borderColor: interpolateColor(
      activeProgress.value,
      [0, 1],
      [HAIRLINE, ACCENT.primary],
    ),
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      [INK.base, INK.onDark],
    ),
  }));

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Animated.View style={[styles.chip, containerAnimatedStyle]}>
        <View style={styles.chipIconWell}>
          <Image
            source={{ uri: `${CONFIG.image_base_url}${item.imageUrl}` }}
            style={styles.chipIcon}
            resizeMode="contain"
          />
        </View>
        <Animated.Text
          style={[styles.chipLabel, labelAnimatedStyle]}
          numberOfLines={1}
        >
          {item.catName || item.name}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const CategoryDiscoverySection = ({
  isHomeLoading,
  categoryDiscovery,
  shouldShow,
  discoveryCategories,
  selectedDiscoveryCategory,
  onSelectCategory,
  isDiscoveryLoading,
  discoveryProducts,
  navigation,
}) => {
  if (isHomeLoading && !categoryDiscovery) return <ExploreShimmer />;
  if (!shouldShow) return null;

  const activeName =
    selectedDiscoveryCategory?.catName || selectedDiscoveryCategory?.name;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.section}>
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Explore"
          titleAccent="deals"
          subtitle={
            activeName ? `Top picks in ${activeName}` : 'Pick a category to shop'
          }
          onAction={
            selectedDiscoveryCategory
              ? () =>
                  navigation.navigate('SearchScreen', {
                    catId: selectedDiscoveryCategory.catId,
                    catName: selectedDiscoveryCategory.catName,
                  })
              : undefined
          }
        />

        {discoveryCategories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
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
        )}

        {isDiscoveryLoading ? (
          <View style={styles.railLoading}>
            <ProductBlockShimmer />
          </View>
        ) : (
          discoveryProducts.length > 0 && (
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
              contentContainerStyle={styles.railContent}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          )
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  divider,
  section: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.md,
  },
  chipRow: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
    gap: wp('2.4%'),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingVertical: hp('0.7%'),
    paddingLeft: wp('1.6%'),
    paddingRight: wp('3.6%'),
  },
  // A white well behind the icon so transparent category PNGs stay legible
  // once the chip fills with orange in its active state.
  chipIconWell: {
    width: CHIP_ICON,
    height: CHIP_ICON,
    borderRadius: CHIP_ICON / 2,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
    overflow: 'hidden',
  },
  chipIcon: {
    width: '78%',
    height: '78%',
  },
  chipLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.3%'),
    maxWidth: wp('34%'),
  },
  railContent: {
    paddingLeft: wp('3.2%'),
    paddingRight: wp('2%'),
  },
  railLoading: {
    minHeight: hp('28%'),
  },

  // Shimmer
  shimmerHeader: {
    paddingHorizontal: GUTTER,
    paddingTop: hp('2%'),
    paddingBottom: hp('1.2%'),
  },
  shimmerEyebrow: {
    width: wp('30%'),
    height: hp('1.3%'),
    borderRadius: 4,
    marginBottom: hp('0.8%'),
  },
  shimmerTitle: {
    width: wp('24%'),
    height: hp('2.4%'),
    borderRadius: 6,
  },
  shimmerChipRow: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    gap: wp('2.4%'),
  },
  shimmerChip: {
    width: wp('26%'),
    height: hp('4.4%'),
    borderRadius: RADIUS.pill,
  },
});

export default CategoryDiscoverySection;
