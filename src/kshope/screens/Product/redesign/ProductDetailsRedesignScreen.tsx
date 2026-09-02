import React, { useEffect, useState } from 'react';
import { ScrollView, Share, StatusBar, StyleSheet, View } from 'react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useWishlist } from '../../../context/WishlistContext';
import FloatingCartButton from '../../../components/FloatingCartButton';
import { s } from '../../Home/redesign/theme';
import Gallery from './sections/Gallery';
import PriceHeader from './sections/PriceHeader';
import TrustStrip from './sections/TrustStrip';
import DetailsAccordion from './sections/DetailsAccordion';
import FeatureGrid from './sections/FeatureGrid';
import SimilarProducts from './sections/SimilarProducts';
import BottomBar from './sections/BottomBar';
import { useProductDetails } from './data/useProductDetails';
import {
  featureList,
  galleryImages,
  isOutOfStock,
  money,
  pricing,
  productDescription,
  productSubtitle,
  productTitle,
  ratingSummary,
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
    setQuantity,
  } = useProductDetails(id, product);

  const [quantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    setLocalQuantity(cartQty > 0 ? cartQty : 1);
  }, [cartQty]);

  const wishlistId = current?.productId ?? rawId;
  const prices = pricing(current);
  const rating = ratingSummary(details);
  const outOfStock = isOutOfStock(current);

  const openProduct = (item: any) =>
    navigation.push('KshopeProductDetails', {
      productId: item?.productId,
      product: item,
    });

  const share = () => {
    const title = productTitle(current);
    if (!title) {
      return;
    }
    Share.share({ message: `${title} — ${prices.price}` }).catch(() => {});
  };

  return (
    <View style={styles.safe}>
      <ProductStatusBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Gallery
          images={galleryImages(details, current)}
          discountLabel={prices.discountLabel}
          wishlisted={isInWishlist(wishlistId)}
          onBack={() => navigation.goBack()}
          onToggleWishlist={() => toggleWishlist(current)}
          onShare={share}
        />

        <PriceHeader
          title={productTitle(current)}
          subtitle={productSubtitle(current)}
          price={prices.price}
          mrp={prices.mrp}
          saveLabel={prices.saveLabel}
          average={rating.average}
          ratings={rating.ratings}
          reviews={rating.reviews}
        />

        <View style={styles.stripSpacer} />
        <TrustStrip />

        <View style={styles.detailsSpacer} />
        <DetailsAccordion description={productDescription(current)} />
        <FeatureGrid features={featureList(details)} />

        <SimilarProducts
          items={related}
          isWishlisted={item => isInWishlist(item?.productId)}
          onPress={openProduct}
          onToggleWishlist={toggleWishlist}
        />
      </ScrollView>

      <FloatingCartButton bottom={s(90)} />

      <BottomBar
        quantity={quantity}
        price={money(
          (Number(current?.specialPrice) || Number(current?.unitPrice) || 0) *
            quantity,
        )}
        mrp={prices.mrp ? money(Number(current?.unitPrice) * quantity) : ''}
        inCart={cartQty > 0}
        outOfStock={outOfStock}
        onDecrement={() => setLocalQuantity(value => Math.max(1, value - 1))}
        onIncrement={() => setLocalQuantity(value => value + 1)}
        onSubmit={() => setQuantity(quantity)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PDP_COLORS.white,
  },
  content: {
    paddingBottom: s(24),
  },
  stripSpacer: {
    height: s(24),
  },
  detailsSpacer: {
    height: s(19),
  },
});

export default ProductDetailsRedesignScreen;
