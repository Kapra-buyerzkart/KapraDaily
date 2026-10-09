import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ReanimatedView, {
  useSharedValue,
  useAnimatedStyle,
  withTiming as withTimingReanimated,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Entypo from 'react-native-vector-icons/Entypo';

import { FONTS } from '../styles/typography';
import images from '../assets/images';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProductDetails } from '../hooks/useProductDetails';
import { impactTick, selectionTick } from '../utils/haptics';
import {
  maxQtyMessage,
  resolveQuantityCeiling,
} from '../utils/cartQuantityLimits';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { AppContext } from '../context/appContext';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';
import {
  BrandIcon,
  ManufacturerIcon,
  CountryOriginIcon,
  TokenCoinIcon,
  CartOutlineIcon,
  WishlistHeartIcon,
  BackArrowIcon,
} from './product/components/ProductDetailIcons';

const HERO_BG = '#DEF7E5'; // Soft pastel mint green background matching the mockup
const ACCENT_ORANGE = '#F25C05'; // Vibrant orange for CTA button
const ACCENT_GREEN = '#16A34A'; // Pill discount & savings green
const PRICE_GREEN = '#006837'; // Deep emerald green for product price
const BUMP_SPRING = { damping: 8, stiffness: 260, mass: 0.4 };
const HEART_SPRING = { damping: 10, stiffness: 340, mass: 0.5 };

const formatCurrencyDisplay = value => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  return num.toLocaleString('en-IN');
};

const ProductDetailsScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const mainScrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const route = useRoute();
  const { product: initialProduct, productId } = route.params || {};

  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, cartItems, changeCartItemQuantity } = useCart();

  const {
    loading,
    product,
    images: apiImages,
    attributes,
    productImage,
    productName,
    productDescription,
    shortDescription,
    unitPrice,
    specialPrice,
    discountPercentage,
    stockQty,
    isAvailable,
    bTokenValue,
    productId: finalProductId,
    relatedProducts,
    relatedLoading,
  } = useProductDetails(productId, initialProduct);

  const isLiked = isInWishlist(finalProductId);

  // Animations
  const heartScale = useSharedValue(1);
  const qtyScale = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const qtyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: qtyScale.value }],
  }));

  const handleWishlistToggle = useCallback(() => {
    impactTick();
    heartScale.value = withSequence(
      withTimingReanimated(1.22, { duration: 90 }),
      withSpring(1, HEART_SPRING),
    );
    if (product) {
      toggleWishlist(product);
    }
  }, [heartScale, toggleWishlist, product]);

  const bumpQty = useCallback(() => {
    qtyScale.value = withSequence(
      withTimingReanimated(1.18, { duration: 100 }),
      withSpring(1, BUMP_SPRING),
    );
  }, [qtyScale]);

  const { maxQty, maxQtyIsStock } = useMemo(
    () => resolveQuantityCeiling(product),
    [product],
  );

  const notifyMaxQty = useCallback(() => {
    Toast.show(maxQtyMessage({ maxQty, maxQtyIsStock }), Toast.SHORT);
  }, [maxQty, maxQtyIsStock]);

  const primaryImageUri =
    productImage?.uri || (apiImages && apiImages[0]?.uri) || null;
  useEffect(() => {
    if (productImage) {
      setSelectedImage(productImage);
    } else if (apiImages && apiImages.length > 0) {
      setSelectedImage(apiImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryImageUri]);

  useEffect(() => {
    if (finalProductId) {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [finalProductId]);

  // Pricing & Savings calculations
  const savings =
    Number(unitPrice) > Number(specialPrice)
      ? Math.round(Number(unitPrice) - Number(specialPrice))
      : 0;

  const displayDiscount = useMemo(() => {
    if (Number(discountPercentage) > 0) {
      return Math.round(Number(discountPercentage));
    }
    if (savings > 0 && Number(unitPrice) > 0) {
      return Math.round((savings / Number(unitPrice)) * 100);
    }
    return 0;
  }, [discountPercentage, savings, unitPrice]);

  const outOfStock = !isAvailable || stockQty === 0;

  // Dynamic feature badges extraction
  const brandValue = useMemo(() => {
    const match = attributes?.find(a =>
      /brand/i.test(a?.attrName || a?.name || a?.code || ''),
    );
    return match?.attrValue || match?.value || 'Brand';
  }, [attributes]);

  const manufacturerValue = useMemo(() => {
    const match = attributes?.find(a =>
      /manufacturer|mfg|producer|maker|packed by/i.test(
        a?.attrName || a?.name || a?.code || '',
      ),
    );
    return match?.attrValue || match?.value || 'Manufacturer';
  }, [attributes]);

  const countryValue = useMemo(() => {
    const match = attributes?.find(a =>
      /country|origin/i.test(a?.attrName || a?.name || a?.code || ''),
    );
    return match?.attrValue || match?.value || 'country of origin';
  }, [attributes]);

  // Clean description text
  const cleanDescription = useMemo(() => {
    if (!productDescription) return '';
    return productDescription.replace(/<[^>]*>?/gm, '').trim();
  }, [productDescription]);

  // Current product cart item
  const cartItem = cartItems?.find(
    i => String(i.productId || i.id) === String(finalProductId),
  );
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const cartItemId = cartItem?.cartItemId || finalProductId;
  const atMaxQty = maxQty !== null && currentQuantity >= maxQty;

  // Top header floating bar
  const renderHeader = () => (
    <View
      style={[
        styles.floatingHeader,
        { top: insets.top + (Platform.OS === 'ios' ? 8 : 12) },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={styles.headerIconButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <BackArrowIcon size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.headerRightActions}>
        <TouchableOpacity
          onPress={handleWishlistToggle}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
          accessibilityRole="button"
          accessibilityLabel={
            isLiked ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <ReanimatedView.View style={heartAnimatedStyle}>
            <WishlistHeartIcon size={24} isLiked={isLiked} color="#111827" />
          </ReanimatedView.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('CartScreen')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
          accessibilityRole="button"
          accessibilityLabel="Go to shopping cart"
        >
          <CartOutlineIcon size={24} color="#111827" />
          {cartItems && cartItems.length > 0 && (
            <View style={styles.headerCartBadge}>
              <Text style={styles.headerCartBadgeText}>
                {cartItems.length > 9 ? '9+' : cartItems.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Skeleton Loader matching redesign
  if (loading && !product) {
    return (
      <SafeAreaView edges={['top']} style={styles.mainContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={HERO_BG}
          translucent={false}
        />
        <View style={styles.skeletonHero}>
          <ShimmerPlaceholder
            style={styles.skeletonHeroImg}
            width={wp('75%')}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          <View style={styles.skeletonRowBetween}>
            <ShimmerPlaceholder
              style={{ width: wp('55%'), height: 26, borderRadius: 6 }}
              width={wp('55%')}
            />
            <ShimmerPlaceholder
              style={{ width: wp('22%'), height: 26, borderRadius: 12 }}
              width={wp('22%')}
            />
          </View>
          <ShimmerPlaceholder
            style={{
              width: wp('85%'),
              height: 16,
              marginTop: 12,
              borderRadius: 4,
            }}
            width={wp('85%')}
          />
          <View style={[styles.skeletonRowBetween, { marginTop: 20 }]}>
            <ShimmerPlaceholder
              style={{ width: wp('35%'), height: 32, borderRadius: 6 }}
              width={wp('35%')}
            />
            <ShimmerPlaceholder
              style={{ width: wp('28%'), height: 28, borderRadius: 14 }}
              width={wp('28%')}
            />
          </View>
          <View style={styles.skeletonBadgesRow}>
            {[1, 2, 3].map(i => (
              <ShimmerPlaceholder
                key={i}
                style={{ width: 64, height: 64, borderRadius: 32 }}
                width={64}
              />
            ))}
          </View>
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: 50,
              borderRadius: 14,
              marginTop: 24,
            }}
            width={wp('90%')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={HERO_BG}
        translucent={false}
      />

      {isStoreUnavailable ? (
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={styles.standardHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <BackArrowIcon size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.standardHeaderTitle}>Product Details</Text>
          </View>
          <StoreUnavailable
            image={storeUnavailableData.image}
            text={storeUnavailableData.text}
            onChangeLocation={() => setIsLocationModalVisible(true)}
          />
        </SafeAreaView>
      ) : (
        <>
          {renderHeader()}

          <ScrollView
            ref={mainScrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 1. Hero Product Showcase with Soft Mint Green Background */}
            <View
              style={[
                styles.heroContainer,
                { paddingTop: insets.top + (Platform.OS === 'ios' ? 44 : 48) },
              ]}
            >
              <FlatList
                data={
                  apiImages && apiImages.length > 0 ? apiImages : [productImage]
                }
                horizontal
                pagingEnabled
                keyExtractor={(_, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                onScroll={e => {
                  const x = e.nativeEvent.contentOffset.x;
                  const index = Math.round(x / wp('100%'));
                  if (apiImages && index < apiImages.length) {
                    setSelectedImage(apiImages[index]);
                  } else if (!apiImages && index === 0) {
                    setSelectedImage(productImage);
                  }
                }}
                renderItem={({ item }) => (
                  <View style={styles.heroSlide}>
                    <Image
                      source={item || productImage || images.product1}
                      style={styles.heroImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />

              {/* Pagination Dots */}
              {apiImages && apiImages.length > 1 && (
                <View style={styles.paginationContainer}>
                  {apiImages.map((_, index) => {
                    const isSelected =
                      selectedImage?.uri === apiImages[index]?.uri;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          isSelected
                            ? styles.paginationDotActive
                            : styles.paginationDotIdle,
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </View>

            {/* 2. Main Details Sheet (White Background) */}
            <View style={styles.sheetContainer}>
              {/* Product Title & Discount Badge Row */}
              <View style={styles.titleRow}>
                <Text style={styles.productTitle} accessibilityRole="header">
                  {productName}
                </Text>

                {displayDiscount > 0 && (
                  <View style={styles.discountPill}>
                    <Text
                      style={styles.discountPillText}
                    >{`${displayDiscount}% OFF`}</Text>
                  </View>
                )}
              </View>

              {/* Short Description */}
              {shortDescription ? (
                <Text style={styles.shortDescriptionText}>
                  {shortDescription}
                </Text>
              ) : cleanDescription ? (
                <Text style={styles.shortDescriptionText} numberOfLines={2}>
                  {cleanDescription}
                </Text>
              ) : null}

              {/* Price, Strikethrough & Token Badge Row */}
              <View style={styles.priceAndTokenRow}>
                <View style={styles.priceGroup}>
                  <Text style={styles.sellingPriceText}>
                    {`₹${
                      formatCurrencyDisplay(specialPrice) || specialPrice
                    }/-`}
                  </Text>
                  {!!unitPrice && Number(unitPrice) > Number(specialPrice) && (
                    <Text style={styles.mrpText}>
                      {`₹ ${formatCurrencyDisplay(unitPrice) || unitPrice}/-`}
                    </Text>
                  )}
                </View>

                {/* Token Badge */}
                <View style={styles.tokenPill}>
                  <TokenCoinIcon size={18} />
                  <Text style={styles.tokenPillText}>
                    {`${Number(bTokenValue) || 10.6} tokens`}
                  </Text>
                </View>
              </View>

              {/* Savings & Dotted Divider Line */}
              <View style={styles.savingsRow}>
                <Text style={styles.savingsText}>
                  {savings > 0
                    ? `₹${formatCurrencyDisplay(savings)}/- OFF`
                    : 'Inclusive of all taxes'}
                </Text>
                <View style={styles.dottedDivider} />
              </View>

              {/* 3. Three Specification / Feature Badges */}
              <View style={styles.specBadgesRow}>
                {/* Brand */}
                <View style={styles.specBadgeItem}>
                  <BrandIcon size={38} color="#111827" />
                  <Text style={styles.specBadgeLabel} numberOfLines={1}>
                    {brandValue}
                  </Text>
                </View>

                {/* Manufacturer */}
                <View style={styles.specBadgeItem}>
                  <ManufacturerIcon size={38} color="#111827" />
                  <Text style={styles.specBadgeLabel} numberOfLines={1}>
                    {manufacturerValue}
                  </Text>
                </View>

                {/* Country of origin */}
                <View style={styles.specBadgeItem}>
                  <CountryOriginIcon size={38} color="#111827" />
                  <Text style={styles.specBadgeLabel} numberOfLines={1}>
                    {countryValue}
                  </Text>
                </View>
              </View>

              {/* 4. Primary "Add to Cart" Action CTA */}
              <View style={styles.actionSection}>
                {(() => {
                  if (currentQuantity > 0) {
                    return (
                      <View style={styles.ctaButtonWrapper}>
                        <View
                          style={styles.ctaButtonUnderlay}
                          pointerEvents="none"
                        />
                        <View style={styles.quantitySelectorContainer}>
                          <TouchableOpacity
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                            style={styles.quantityStepBtn}
                            onPress={() => {
                              selectionTick();
                              bumpQty();
                              changeCartItemQuantity(cartItemId, -1);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Decrease quantity"
                          >
                            <Entypo name="minus" size={20} color="#FFFFFF" />
                          </TouchableOpacity>

                          <ReanimatedView.Text
                            style={[styles.quantityValueText, qtyAnimatedStyle]}
                          >
                            {currentQuantity}
                          </ReanimatedView.Text>

                          <TouchableOpacity
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                            style={[
                              styles.quantityStepBtn,
                              atMaxQty && styles.quantityStepBtnDisabled,
                            ]}
                            onPress={() => {
                              if (atMaxQty) {
                                notifyMaxQty();
                                return;
                              }
                              selectionTick();
                              bumpQty();
                              changeCartItemQuantity(cartItemId, 1);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={
                              atMaxQty
                                ? 'Maximum quantity reached'
                                : 'Increase quantity'
                            }
                          >
                            <Entypo name="plus" size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }

                  if (outOfStock) {
                    return (
                      <View style={styles.outOfStockBtn}>
                        <Text style={styles.outOfStockBtnText}>
                          OUT OF STOCK
                        </Text>
                      </View>
                    );
                  }

                  return (
                    <View style={styles.ctaButtonWrapper}>
                      <View
                        style={styles.ctaButtonUnderlay}
                        pointerEvents="none"
                      />
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.addToCartBtn}
                        onPress={() => {
                          impactTick();
                          product && addToCart(product);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${productName} to cart`}
                      >
                        <CartOutlineIcon size={22} color="#FFFFFF" />
                        <Text style={styles.addToCartBtnText}>Add to cart</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })()}
              </View>

              {/* 5. Product Details Section */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionHeading}>Product Details</Text>
                <Text style={styles.detailsBodyText}>{cleanDescription}</Text>

                {/* Additional Highlights Table if attributes are available */}
                {attributes && attributes.length > 0 && (
                  <View style={styles.attributesTable}>
                    {attributes.map((attr, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.attributeRow,
                          idx === attributes.length - 1 &&
                            styles.attributeRowLast,
                        ]}
                      >
                        <Text style={styles.attributeLabel}>
                          {attr.attrName || attr.name || 'Detail'}
                        </Text>
                        <Text style={styles.attributeValue}>
                          {attr.attrValue || attr.value || '-'}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* 6. Similar Products Section */}
              <View style={styles.similarSection}>
                <Text style={styles.sectionHeading}>Similar Products</Text>
                <Text style={styles.sectionSubtitle}>
                  Fresh deals, exclusive savings & more
                </Text>

                <FlatList
                  horizontal
                  data={relatedProducts}
                  keyExtractor={(item, index) =>
                    (item.productId || item.id || index).toString()
                  }
                  renderItem={({ item, index }) => (
                    <TokenProductCard
                      item={item}
                      index={index}
                      containerStyle={styles.similarProductCard}
                      onPress={() =>
                        navigation.push('ProductDetailsScreen', {
                          productId: item.productId || item.id,
                          product: item,
                        })
                      }
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarRailContent}
                  ListEmptyComponent={
                    !relatedLoading && (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                          No similar products found
                        </Text>
                      </View>
                    )
                  }
                />
              </View>

              {/* 7. SOMETHING SPECIAL Deals & Offers Banner */}
              <View style={styles.dealsSection}>
                <Text style={styles.dealsKicker}>SOMETHING SPECIAL</Text>
                <Text style={styles.sectionHeading}>The Pantry Collection</Text>
                <Text style={styles.sectionSubtitle}>
                  Your daily favourites, all in one place.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.92}
                  style={styles.dealsBannerContainer}
                  onPress={() =>
                    navigation.navigate('ProductListScreen', {
                      title: 'Deals & Offers',
                      products: relatedProducts || [],
                    })
                  }
                >
                  <Image
                    source={images.pantryDealsBanner}
                    style={styles.dealsBannerImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}

      {/* Floating Cart Indicator */}
      {cartItems && cartItems.length > 0 && (
        <View style={styles.floatingCart} pointerEvents="box-none">
          {!isStoreUnavailable && (
            <SelectedProducts selectedProducts={cartItems} />
          )}
        </View>
      )}

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  // Floating Header
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 20,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerCartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: ACCENT_ORANGE,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: FONTS.gilroy.bold,
  },

  // Standard Header for Fallback / Store Unavailable
  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  standardHeaderTitle: {
    fontSize: 18,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#111827',
    marginLeft: 14,
  },

  scrollContent: {
    paddingBottom: hp('10%'),
  },

  // 1. Hero Product Section
  heroContainer: {
    backgroundColor: HERO_BG,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
    overflow: 'hidden',
  },
  heroSlide: {
    width: wp('100%'),
    height: hp('34%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: wp('80%'),
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  paginationDot: {
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: '#111827',
  },
  paginationDotIdle: {
    width: 5,
    backgroundColor: 'rgba(17, 24, 39, 0.25)',
  },

  // 2. White Card Details Sheet
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  productTitle: {
    flex: 1,
    fontSize: 22,
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
    marginRight: 12,
    lineHeight: 28,
  },
  discountPill: {
    backgroundColor: '#D4F5D8',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  discountPillText: {
    color: ACCENT_GREEN,
    fontSize: 12,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
  },
  shortDescriptionText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 6,
  },

  // Pricing & Tokens
  priceAndTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellingPriceText: {
    fontSize: 24,
    fontFamily: FONTS.gilroy.bold,
    color: PRICE_GREEN,
    letterSpacing: -0.4,
  },
  mrpText: {
    fontSize: 15,
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  tokenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2DB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tokenPillText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.bold,
    color: '#92400E',
    marginLeft: 6,
  },

  // Savings & Dotted Divider
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  savingsText: {
    fontSize: 14,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT_GREEN,
  },
  dottedDivider: {
    flex: 1,
    borderBottomWidth: 1.2,
    borderBottomColor: '#FDA4AF',
    borderStyle: 'dashed',
    marginLeft: 12,
    opacity: 0.7,
  },

  // 3. Spec Badges Row
  specBadgesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 10,
  },
  specBadgeItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  specBadgeLabel: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },

  // 4. Primary "Add to cart" CTA Button
  actionSection: {
    marginTop: 20,
  },
  ctaButtonWrapper: {
    position: 'relative',
    height: 50,
    marginRight: 2.5,
    marginBottom: 4,
  },
  ctaButtonUnderlay: {
    position: 'absolute',
    top: 3,
    left: 2.5,
    right: -1.5,
    bottom: -3.5,
    backgroundColor: '#000000',
    borderRadius: 14,
  },
  addToCartBtn: {
    backgroundColor: '#FD7301',
    height: 50,
    borderRadius: 14,
    // borderWidth: 1.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.gilroy.bold,
    marginLeft: 8,
  },
  quantitySelectorContainer: {
    backgroundColor: '#FD7301',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  quantityStepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  quantityStepBtnDisabled: {
    opacity: 0.4,
  },
  quantityValueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONTS.gilroy.bold,
  },
  outOfStockBtn: {
    backgroundColor: '#E5E7EB',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockBtnText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.5,
  },

  // 5. Product Details Section
  detailsSection: {
    marginTop: 26,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: FONTS.gilroy.bold,
    paddingVertical: 10,
    color: '#111827',
  },
  detailsBodyText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: '#4B5563',
    lineHeight: 20,
  },
  attributesTable: {
    marginTop: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  attributeRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attributeRowLast: {
    borderBottomWidth: 0,
  },
  attributeLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#6B7280',
  },
  attributeValue: {
    flex: 1.2,
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: '#111827',
  },

  // 6. Similar Products Section
  similarSection: {
    marginTop: 26,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.regular,
    color: '#6B7280',
    marginTop: 10,
  },
  similarRailContent: {
    paddingVertical: 14,
    gap: 12,
  },
  similarProductCard: {
    marginRight: 2,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: '#9CA3AF',
  },

  // 7. SOMETHING SPECIAL Deals & Offers
  dealsSection: {
    marginTop: 26,
    marginBottom: 20,
  },
  dealsKicker: {
    color: ACCENT_ORANGE,
    fontSize: 11,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  dealsBannerContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F7F2EC',
  },
  dealsBannerImage: {
    width: '100%',
    height: 280,
  },

  // Floating Cart Container
  floatingCart: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Skeleton
  skeletonHero: {
    height: hp('36%'),
    backgroundColor: HERO_BG,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonHeroImg: {
    height: hp('24%'),
    borderRadius: 16,
  },
  skeletonRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 24,
  },
});
