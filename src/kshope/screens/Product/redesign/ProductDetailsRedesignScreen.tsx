import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useWishlist } from '../../../context/WishlistContext';
import { s } from '../../Home/redesign/theme';
import Gallery from './sections/Gallery';
import PriceHeader from './sections/PriceHeader';
import SpecDetailsRow from './sections/SpecDetailsRow';
import ProductInfoSection from './sections/ProductInfoSection';
import ReviewTabs from './sections/ReviewTabs';
import TrustStrip from './sections/TrustStrip';
import SimilarProducts from './sections/SimilarProducts';
import BottomBar from './sections/BottomBar';
import { useProductDetails } from './data/useProductDetails';
import {
  galleryImages,
  isOutOfStock,
  pricing,
  productDescription,
  productSubtitle,
  productTitle,
  ratingSummary,
  reviewList,
  reviewSummary,
  specificationList,
  tokenCount,
  warrantyText,
} from './data/selectors';
import { PDP_COLORS } from './theme';

const ProductStatusBar: React.FC = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const ProductDetailsRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { product, productId } = ((route.params as any) || {}) as {
    product?: any;
    productId?: string;
  };

  const rawId = product?.productId ?? productId;
  const id = String(rawId ?? '');

  const { isInWishlist, toggleWishlist } = useWishlist();
  const {
    details,
    product: current,
    related,
    cartQty,
    stockBlocked,
    addToCart,
  } = useProductDetails(id, product);

  const wishlistId = current?.productId ?? rawId;
  const prices = pricing(current);
  const rating = ratingSummary(details);
  const outOfStock = isOutOfStock(current) || stockBlocked;
  const reviewStats = reviewSummary(details);
  const reviews = reviewList(details);
  const specs = specificationList(details);
  const title = productTitle(current);
  const sku = current?.sku || current?.productCode || details?.sku || '';
  const description = productDescription(current);

  const openProduct = (item: any) =>
    navigation.push('KshopeProductDetails', {
      productId: item?.productId,
      product: item,
    });

  return (
    <View style={styles.safe}>
      <ProductStatusBar />

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Gallery
          images={galleryImages(details, current)}
          discountLabel={prices.discountLabel}
          wishlisted={isInWishlist(wishlistId)}
          title={title}
          onBack={() => navigation.goBack()}
          onToggleWishlist={() => toggleWishlist(current)}
        />

        <PriceHeader
          title={title}
          subtitle={productSubtitle(current)}
          price={prices.price}
          mrp={prices.mrp}
          saveLabel={prices.saveLabel}
          savingBadge={prices.savingBadge}
          average={rating.average}
          ratings={rating.ratings}
          reviews={rating.reviews}
          hasRating={rating.hasRating}
          tokens={tokenCount(current, details, product)}
        />

        <SpecDetailsRow attributes={specs} />

        <ProductInfoSection sku={sku} description={description} />

        <ReviewTabs
          average={reviewStats.average}
          total={reviewStats.total}
          bars={reviewStats.bars}
          reviews={reviews}
          hasRatings={reviewStats.hasData}
          specs={specs}
          warranty={warrantyText(details, current)}
          priceBreakup={prices}
        />

        <View style={styles.stripSpacer} />
        <TrustStrip />

        <SimilarProducts
          items={related}
          isWishlisted={item => isInWishlist(item?.productId)}
          onPress={openProduct}
          onToggleWishlist={toggleWishlist}
        />

        <View style={styles.barTopSpacer} />

        <BottomBar
          inWishlist={isInWishlist(wishlistId)}
          onToggleWishlist={() => toggleWishlist(current)}
          inCart={cartQty > 0}
          outOfStock={outOfStock}
          onAddToCart={addToCart}
        />

        <View style={styles.barBottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PDP_COLORS.white,
  },
  content: {
    paddingBottom: s(36),
  },
  stripSpacer: {
    height: s(20),
  },
  barTopSpacer: {
    height: s(24),
  },
  barBottomSpacer: {
    height: s(40),
  },
});

export default ProductDetailsRedesignScreen;
