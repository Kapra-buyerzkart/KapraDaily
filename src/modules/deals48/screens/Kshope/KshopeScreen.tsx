import React from 'react';
import { View, StatusBar, RefreshControl } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CART_COLORS } from '@/styles/cartTheme';
import { DEALS48_ROUTES } from '../../navigation/routes';
import { useKshopeScreen } from './useKshopeScreen';
import { BAR_REST, BAR_SOLID, styles } from './styles';
import { BORDER_FADE_RANGE, HEADER_SOLID_RANGE, entrance } from './motion';
import KshopeHeader from './organisms/KshopeHeader';
import BannerCarousel from './organisms/BannerCarousel';
import CategoryRail from './organisms/CategoryRail';
import AccessorizeSection from './organisms/AccessorizeSection';
import BrandRail from './organisms/BrandRail';
import ShowcaseBanner from './organisms/ShowcaseBanner';
import BestSellingCard from './organisms/BestSellingCard';
import ProductRail from './organisms/ProductRail';
import BannerRail from './organisms/BannerRail';
import GoatDealsGrid from './organisms/GoatDealsGrid';
import KshopeSkeleton from './organisms/KshopeSkeleton';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';

const KshopeScreen: React.FC = () => {
  const {
    navigation,
    profile,
    refreshing,
    onRefresh,
    isLoading,
    toggleWishlist,
    isInWishlist,
    bannerRef,
    bannerIndex,
    setBannerIndex,
    midBannerIndex,
    setMidBannerIndex,
    bestSellingIndex,
    setBestSellingIndex,
    selectedAccessorize,
    setSelectedAccessorize,
    topBanner,
    midBanner,
    bottomBanner,
    goatDeals,
    showcaseBanner,
    showcaseItems,
    topBrands,
    bestSelling,
    displayCategories,
    firstBlock,
    secondBlock,
    firstProducts,
    secondProducts,
    accessorizeCategories,
    accessorizeItems,
    openBanner,
    openCategory,
    openBrand,
    openProduct,
    openCollection,
    blockCatId,
  } = useKshopeScreen();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      HEADER_SOLID_RANGE,
      [BAR_REST, BAR_SOLID],
    ),
  }));

  const headerBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const firstTitle = firstBlock?.title || firstBlock?.Title || 'Top deals';
  const secondTitle =
    secondBlock?.title || secondBlock?.Title || 'Featured products';

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KshopeHeader
        name={profile?.custName}
        backgroundStyle={headerBackgroundStyle}
        borderStyle={headerBorderStyle}
        onProfile={() => navigation.navigate(DEALS48_ROUTES.PROFILE)}
        onCart={() => navigation.navigate(DEALS48_ROUTES.CART)}
        onNotifications={() => {}}
        onSearch={() => navigation.navigate(DEALS48_ROUTES.SEARCH)}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={CART_COLORS.primary}
            colors={[CART_COLORS.primary]}
          />
        }
      >
        {isLoading && <KshopeSkeleton />}

        {topBanner.length > 0 && (
          <Animated.View entering={entrance(0)}>
            <BannerCarousel
              listRef={bannerRef}
              banners={topBanner}
              index={bannerIndex}
              onIndexChange={setBannerIndex}
              onPress={openBanner}
            />
          </Animated.View>
        )}

        {displayCategories.length > 0 && (
          <Animated.View entering={entrance(1)}>
            <CategoryRail
              categories={displayCategories}
              onSelect={openCategory}
            />
          </Animated.View>
        )}

        {accessorizeCategories.length > 0 && (
          <Animated.View entering={entrance(2)}>
            <AccessorizeSection
              tabs={accessorizeCategories}
              items={accessorizeItems}
              selected={selectedAccessorize}
              onSelect={setSelectedAccessorize}
              onOpenItem={item =>
                openCollection({
                  catId: item.catId,
                  title: item.displayTitle || item.name || 'Category',
                })
              }
            />
          </Animated.View>
        )}

        {topBrands.length > 0 && (
          <Animated.View entering={entrance(3)}>
            <BrandRail brands={topBrands} onSelect={openBrand} />
          </Animated.View>
        )}

        {showcaseBanner && showcaseItems.length > 0 && (
          <ShowcaseBanner
            banner={showcaseBanner}
            items={showcaseItems}
            onPress={openBanner}
          />
        )}

        {bestSelling.length > 0 && (
          <View>
            <BestSellingCard
              items={bestSelling}
              index={bestSellingIndex}
              onIndexChange={setBestSellingIndex}
            />
            <View style={styles.more}>
              <ClickForMoreButton
                title="Click for more offers"
                onPress={() =>
                  openCollection({
                    title: 'Best Selling',
                    products: bestSelling,
                  })
                }
              />
            </View>
          </View>
        )}

        {firstProducts.length > 0 && (
          <ProductRail
            title={firstTitle}
            products={firstProducts}
            keyPrefix="first"
            moreLabel={`Click for more ${firstBlock?.title || 'Deals'}`}
            onOpenProduct={openProduct}
            onSeeAll={() =>
              openCollection({
                catId: blockCatId(firstBlock)?.toString(),
                title: firstBlock?.title || 'Top Deals',
              })
            }
            toggleWishlist={toggleWishlist}
            isInWishlist={isInWishlist}
          />
        )}

        {midBanner.length > 0 && (
          <BannerRail
            banners={midBanner}
            index={midBannerIndex}
            onIndexChange={setMidBannerIndex}
            onPress={openBanner}
            keyPrefix="mid"
          />
        )}

        {goatDeals.length > 0 && (
          <GoatDealsGrid deals={goatDeals} onPress={openBanner} />
        )}

        {secondProducts.length > 0 && (
          <ProductRail
            title={secondTitle}
            products={secondProducts}
            keyPrefix="second"
            moreLabel={`Click for more ${secondBlock?.title || 'Featured'}`}
            onOpenProduct={openProduct}
            onSeeAll={() =>
              openCollection({
                catId: blockCatId(secondBlock)?.toString(),
                title: secondBlock?.title || 'Featured Products',
              })
            }
            toggleWishlist={toggleWishlist}
            isInWishlist={isInWishlist}
          />
        )}

        {bottomBanner.length > 0 && (
          <BannerRail
            banners={bottomBanner}
            onPress={openBanner}
            keyPrefix="bottom"
            compact
          />
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default KshopeScreen;
