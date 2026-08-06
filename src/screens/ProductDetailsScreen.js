import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  ActivityIndicator,
  Share,
} from 'react-native';
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
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
  withDelay,
  FadeInUp,
} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import CONFIG from '../globals/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProductDetails } from '../hooks/useProductDetails';
import { getStaggerDelay } from '../utils/staggerDelay';
import { impactTick, selectionTick } from '../utils/haptics';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { AppContext } from '../context/appContext';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';
import AnimatedPressable from '../components/AnimatedPressable';
import icons from '@/assets/icons';
import {
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  ELEVATION,
  GUTTER,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';

const BUMP_SPRING = { damping: 8, stiffness: 260, mass: 0.4 };
const HEART_SPRING = { damping: 10, stiffness: 340, mass: 0.5 };

const SECTION_STAGGER_MS = 90;

const HERO_H = hp('50%');
const SHEET_OVERLAP = SPACE.lg;

const HEADER_BTN = 38;
const HEADER_HIT_SLOP = hitSlopTo(HEADER_BTN);
const STEP_HIT_SLOP = { top: 10, bottom: 6, left: 8, right: 8 };

const ACTION_W = wp('32%');
const ACTION_H = 46;

const scaleFadeIn =
  (delayMs = 0) =>
  () => {
    'worklet';
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.92 }],
      },
      animations: {
        opacity: withDelay(delayMs, withTimingReanimated(1, { duration: 260 })),
        transform: [
          {
            scale: withDelay(
              delayMs,
              withSpring(1, { damping: 16, stiffness: 220, mass: 0.5 }),
            ),
          },
        ],
      },
    };
  };

const GalleryImage = ({ source, style, imageStyle }) => {
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <ReanimatedView.Image
      source={source}
      style={[style, imageStyle, animatedStyle]}
      onLoadEnd={() => {
        opacity.value = withTimingReanimated(1, { duration: 220 });
      }}
    />
  );
};

const PaginationDot = ({ isSelected }) => (
  <View
    style={[
      styles.paginationDot,
      isSelected ? styles.paginationDotActive : styles.paginationDotIdle,
    ]}
  />
);

const ProductDetailsScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const mainScrollViewRef = useRef(null);
  const detailsScrollViewRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const route = useRoute();
  const { product: initialProduct, productId } = route.params || {};
  const { isInWishlist, toggleWishlist } = useWishlist();
  const {
    addToCart,
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    showStatus,
  } = useCart();

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
    urlKey,
    relatedProducts,
    relatedLoading,
  } = useProductDetails(productId, initialProduct);

  const handleShare = async () => {
    try {
      const productUrl = `${
        CONFIG.WEBSITE_URL || 'https://kapradaily.com'
      }/product/${urlKey || finalProductId}`;
      const message = `Take a look at this product from Uden Deal.\n${productUrl}`;

      const result = await Share.share({
        message: message,
        url: productUrl,
        title: productName,
      });
    } catch (error) {
      console.error('Share Error:', error);
    }
  };

  const isLiked = isInWishlist(finalProductId);

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
      withTimingReanimated(1.18, { duration: 90 }),
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

  const toggleDetails = () => {
    const isExpanding = !showDetails;
    selectionTick();
    Animated.timing(animation, {
      toValue: isExpanding ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setShowDetails(isExpanding);

    if (isExpanding) {
      setTimeout(() => {
        mainScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hp('40%')],
  });

  const chevronRotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  useEffect(() => {
    if (productImage) {
      setSelectedImage(productImage);
    } else if (apiImages && apiImages.length > 0) {
      setSelectedImage(apiImages[0]);
    }
  }, [productImage, apiImages]);

  useEffect(() => {
    if (finalProductId) {
      mainScrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [finalProductId]);

  const savings =
    Number(unitPrice) > Number(specialPrice)
      ? Math.round(Number(unitPrice) - Number(specialPrice))
      : 0;
  const outOfStock = !isAvailable || stockQty === 0;

  if (loading && !product) {
    return (
      <SafeAreaView edges={['top']} style={styles.mainContainer}>
        <View style={styles.standardHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={HEADER_HIT_SLOP}
          >
            <Image source={icons.backArrowNew} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('5%') }}
        >
          <View style={styles.heroSkeleton}>
            <ShimmerPlaceholder
              style={styles.heroSkeletonImage}
              width={wp('62%')}
            />
          </View>

          <View style={styles.sheet}>
            <ShimmerPlaceholder
              style={[styles.skelLine, { width: wp('26%'), height: 22 }]}
              width={wp('26%')}
            />
            <ShimmerPlaceholder
              style={[
                styles.skelLine,
                { width: wp('72%'), height: 20, marginTop: SPACE.base },
              ]}
              width={wp('72%')}
            />
            <ShimmerPlaceholder
              style={[styles.skelLine, { width: wp('44%'), height: 14 }]}
              width={wp('44%')}
            />

            <View style={styles.skelPriceRow}>
              <ShimmerPlaceholder
                style={[styles.skelLine, { width: wp('30%'), height: 26 }]}
                width={wp('30%')}
              />
              <ShimmerPlaceholder
                style={{
                  width: ACTION_W,
                  height: ACTION_H,
                  borderRadius: RADIUS.sm,
                }}
                width={ACTION_W}
              />
            </View>

            <View style={styles.rule} />

            <ShimmerPlaceholder
              style={[styles.skelLine, { width: wp('40%'), height: 16 }]}
              width={wp('40%')}
            />
          </View>

          <View style={styles.skelRailBlock}>
            <ShimmerPlaceholder
              style={[styles.skelLine, { width: wp('40%'), height: 20 }]}
              width={wp('40%')}
            />
            <View style={styles.skelRail}>
              {[0, 1, 2].map(i => (
                <ShimmerPlaceholder
                  key={i}
                  style={{
                    width: wp('35%'),
                    height: hp('20%'),
                    borderRadius: RADIUS.md,
                  }}
                  width={wp('35%')}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={[styles.floatingHeader, { top: insets.top + SPACE.sm }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={HEADER_HIT_SLOP}
        style={styles.headerButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} />
      </TouchableOpacity>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          hitSlop={HEADER_HIT_SLOP}
          onPress={handleWishlistToggle}
          accessibilityRole="button"
          accessibilityLabel={
            isLiked ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <ReanimatedView.View style={heartAnimatedStyle}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? '#E1233A' : INK.base}
            />
          </ReanimatedView.View>
        </TouchableOpacity>
        {}
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {isStoreUnavailable ? (
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={styles.standardHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={HEADER_HIT_SLOP}
            >
              <Image source={icons.backArrowNew} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product Details</Text>
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
            contentContainerStyle={{ paddingBottom: hp('15%') }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ReanimatedView.View style={styles.hero} entering={scaleFadeIn(0)}>
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
                    <GalleryImage
                      source={item || productImage}
                      style={styles.heroImage}
                      imageStyle={{ resizeMode: 'contain' }}
                    />
                  </View>
                )}
              />

              <View style={styles.paginationContainer}>
                {apiImages &&
                  apiImages.length > 1 &&
                  apiImages.map((_, index) => {
                    const isSelected =
                      selectedImage?.uri === apiImages[index]?.uri;
                    return (
                      <PaginationDot key={index} isSelected={isSelected} />
                    );
                  })}
              </View>
            </ReanimatedView.View>

            <ReanimatedView.View
              style={styles.sheet}
              entering={scaleFadeIn(SECTION_STAGGER_MS)}
            >
              <View style={styles.badgeRow}>
                {discountPercentage > 0 && (
                  <View style={styles.discountBadge}>
                    <Text
                      style={styles.discountText}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {Math.round(discountPercentage) ||
                        ((unitPrice - specialPrice) / unitPrice) * 100}
                      % OFF
                    </Text>
                  </View>
                )}

                <View style={styles.tokenBadge}>
                  <Image
                    style={styles.tokenIconSmall}
                    source={require('../assets/icons/tokenud.png')}
                  />
                  <Text
                    style={styles.tokenBadgeText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {Number(bTokenValue)} UD Token
                  </Text>
                </View>
              </View>

              <Text style={styles.productName} accessibilityRole="header">
                {productName}
              </Text>
              {!!shortDescription && (
                <Text style={styles.productDescription}>
                  {shortDescription}
                </Text>
              )}
              {outOfStock && (
                <View style={styles.outOfStockPill}>
                  <Text
                    style={styles.outOfStockText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Out of stock
                  </Text>
                </View>
              )}

              <View style={styles.priceBlock}>
                <View style={styles.priceColumn}>
                  <View style={styles.priceRow}>
                    <Text
                      style={styles.currentPrice}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      ₹{specialPrice}
                    </Text>
                    {!!unitPrice &&
                      Number(unitPrice) > Number(specialPrice) && (
                        <Text
                          style={styles.originalPrice}
                          maxFontSizeMultiplier={MAX_FONT_SCALE}
                        >
                          ₹{unitPrice}
                        </Text>
                      )}
                  </View>
                  <Text
                    style={savings > 0 ? styles.savingsText : styles.taxNote}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {savings > 0
                      ? `You save ₹${savings}`
                      : 'Inclusive of all taxes'}
                  </Text>
                </View>

                <View style={styles.actionContainer}>
                  {(() => {
                    const cartItem = cartItems.find(
                      i =>
                        String(i.productId || i.id) === String(finalProductId),
                    );
                    const quantity = cartItem ? cartItem.quantity : 0;
                    const cartItemId = cartItem?.cartItemId || finalProductId;

                    if (quantity > 0) {
                      return (
                        <View style={styles.quantitySelector}>
                          <AnimatedPressable
                            hitSlop={STEP_HIT_SLOP}
                            style={styles.stepButton}
                            accessibilityRole="button"
                            accessibilityLabel="Decrease quantity"
                            onPress={() => {
                              selectionTick();
                              bumpQty();
                              quantity === 1
                                ? removeFromCart(cartItemId)
                                : updateCartItemQuantity(
                                    cartItemId,
                                    quantity - 1,
                                  );
                            }}
                          >
                            <Entypo name="minus" size={18} color="#FFFFFF" />
                          </AnimatedPressable>
                          <ReanimatedView.Text
                            style={[styles.qtyValue, qtyAnimatedStyle]}
                            maxFontSizeMultiplier={MAX_FONT_SCALE}
                          >
                            {quantity}
                          </ReanimatedView.Text>
                          <AnimatedPressable
                            hitSlop={STEP_HIT_SLOP}
                            style={styles.stepButton}
                            accessibilityRole="button"
                            accessibilityLabel="Increase quantity"
                            onPress={() => {
                              selectionTick();
                              bumpQty();
                              updateCartItemQuantity(cartItemId, quantity + 1);
                            }}
                          >
                            <Entypo name="plus" size={18} color="#FFFFFF" />
                          </AnimatedPressable>
                        </View>
                      );
                    }

                    if (outOfStock) {
                      return (
                        <View style={styles.disabledBtn}>
                          <Text
                            style={styles.disabledBtnText}
                            maxFontSizeMultiplier={MAX_FONT_SCALE}
                          >
                            OUT OF STOCK
                          </Text>
                        </View>
                      );
                    }

                    return (
                      <AnimatedPressable
                        style={styles.addBtn}
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${productName} to cart`}
                        onPress={() => {
                          impactTick();
                          bumpQty();
                          product && addToCart(product);
                        }}
                      >
                        <Entypo
                          name="plus"
                          size={17}
                          color="#FFFFFF"
                          style={styles.addBtnIcon}
                        />
                        <Text
                          style={styles.addBtnText}
                          maxFontSizeMultiplier={MAX_FONT_SCALE}
                        >
                          ADD
                        </Text>
                      </AnimatedPressable>
                    );
                  })()}
                </View>
              </View>

              <View style={styles.rule} />

              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={toggleDetails}
                style={styles.detailsToggle}
                accessibilityRole="button"
                accessibilityState={{ expanded: showDetails }}
              >
                <Text
                  style={styles.detailsToggleText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Product details
                </Text>
                <Animated.View
                  style={{ transform: [{ rotate: chevronRotate }] }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={ACCENT.primary}
                  />
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.productDetailsView,
                  {
                    height: heightInterpolate,
                    overflow: 'hidden',
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ScrollView
                    ref={detailsScrollViewRef}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    onContentSizeChange={(w, h) => {
                      if (h > hp('35%')) {
                        setShowScrollHint(true);
                      }
                    }}
                    onScroll={event => {
                      const { layoutMeasurement, contentOffset, contentSize } =
                        event.nativeEvent;
                      const isCloseToBottom =
                        layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - 20;
                      setShowScrollHint(!isCloseToBottom);
                    }}
                    scrollEventThrottle={16}
                  >
                    <Text style={styles.productDetailsText}>
                      {productDescription?.replace(/<[^>]*>?/gm, '')}
                    </Text>
                    {attributes && attributes.length > 0 && (
                      <>
                        <Text style={styles.specsHeader}>Highlights</Text>
                        <View style={styles.specsContainer}>
                          {attributes.map((attr, idx) => (
                            <View
                              key={idx}
                              style={[
                                styles.specRow,
                                idx === attributes.length - 1 &&
                                  styles.specRowLast,
                              ]}
                            >
                              <Text style={styles.specLabel}>
                                {attr.attrName}
                              </Text>
                              <Text style={styles.specValue}>
                                {attr.attrValue}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                    <View style={{ height: hp('5%') }} />
                  </ScrollView>

                  {showScrollHint && showDetails && (
                    <>
                      <LinearGradient
                        colors={[
                          'rgba(255,255,255,0)',
                          'rgba(255,255,255,0.85)',
                          '#FFFFFF',
                        ]}
                        style={styles.fadeGradient}
                        pointerEvents="none"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          detailsScrollViewRef.current?.scrollToEnd({
                            animated: true,
                          })
                        }
                        style={styles.scrollIndicator}
                      />
                    </>
                  )}
                </View>
              </Animated.View>
            </ReanimatedView.View>

            <ReanimatedView.View
              style={styles.similarProductsSection}
              entering={scaleFadeIn(SECTION_STAGGER_MS * 2)}
            >
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Similar products
              </Text>
              {relatedLoading ? (
                <ActivityIndicator
                  size="small"
                  color={ACCENT.primary}
                  style={{ marginVertical: hp('2%') }}
                />
              ) : (
                <FlatList
                  horizontal
                  data={relatedProducts}
                  keyExtractor={(item, index) =>
                    (item.productId || item.id || index).toString()
                  }
                  renderItem={({ item, index }) => (
                    <TokenProductCard
                      item={item}
                      entering={FadeInUp.delay(getStaggerDelay(index))}
                      onPress={() =>
                        navigation.push('ProductDetailsScreen', {
                          productId: item.productId || item.id,
                          product: item,
                        })
                      }
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.railContent}
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
              )}
            </ReanimatedView.View>
          </ScrollView>
        </>
      )}

      {cartItems && cartItems.length > 0 && (
        <View style={styles.floatingCart}>
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
    backgroundColor: CANVAS,
    flex: 1,
  },

  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingVertical: SPACE.md,
    backgroundColor: CANVAS,
  },
  floatingHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    zIndex: 10,
  },
  headerButton: {
    width: HEADER_BTN,
    height: HEADER_BTN,
    borderRadius: HEADER_BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.sm,
  },
  headerTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginHorizontal: SPACE.md,
  },

  hero: {
    height: HERO_H,
    width: '100%',
    backgroundColor: CANVAS,
  },
  heroSlide: {
    width: wp('100%'),
    height: HERO_H,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('4%'),
    paddingBottom: SHEET_OVERLAP + SPACE.base,
  },
  heroImage: {
    width: wp('72%'),
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: SHEET_OVERLAP + SPACE.sm,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 5,
    borderRadius: RADIUS.pill,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: ACCENT.primary,
  },
  paginationDotIdle: {
    width: 5,
    backgroundColor: 'rgba(17,19,26,0.18)',
  },

  sheet: {
    marginTop: -SHEET_OVERLAP,
    backgroundColor: CANVAS,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.sm,
    marginBottom: SPACE.md,
  },
  discountBadge: {
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
  },
  discountText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.successText,
    letterSpacing: 0.3,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EEF9',
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
  },
  tokenIconSmall: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  tokenBadgeText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#5E3568',
    marginLeft: SPACE.xs + 1,
  },

  productName: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  productDescription: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: SPACE.xs + 2,
  },
  outOfStockPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEC',
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
    marginTop: SPACE.sm,
  },
  outOfStockText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.bold,
    color: '#B3261E',
    letterSpacing: 0.3,
  },

  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.lg,
  },
  priceColumn: {
    flex: 1,
    paddingRight: SPACE.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  currentPrice: {
    ...TYPE.display,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.4,
  },
  originalPrice: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
    textDecorationLine: 'line-through',
    marginLeft: SPACE.sm,
  },
  savingsText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.savings,
    marginTop: 3,
  },
  taxNote: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: 3,
  },
  actionContainer: {
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: ACCENT.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.sm,
  },
  addBtnIcon: {
    marginRight: SPACE.xs + 1,
  },
  addBtnText: {
    ...TYPE.heading,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.6,
  },
  disabledBtn: {
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: HAIRLINE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.sm,
  },
  disabledBtnText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.bold,
    color: INK.faint,
    letterSpacing: 0.4,
  },
  quantitySelector: {
    backgroundColor: ACCENT.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ACTION_W,
    height: ACTION_H,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.md,
  },
  stepButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    ...TYPE.heading,
    lineHeight: undefined,
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },

  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
    marginTop: SPACE.lg,
  },
  detailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACE.base,
  },
  detailsToggleText: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  productDetailsView: {
    marginTop: 0,
  },
  productDetailsText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: INK.base,
    lineHeight: TYPE.body.lineHeight + 4,
  },
  specsHeader: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: SPACE.lg,
    marginBottom: SPACE.sm,
  },
  specsContainer: {
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.base,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACE.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    width: wp('34%'),
    paddingRight: SPACE.sm,
  },
  specValue: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
    flex: 1,
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('8%'),
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('5%'),
  },

  similarProductsSection: {
    paddingTop: SPACE.lg,
    backgroundColor: CANVAS,
  },
  sectionTitle: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
    paddingHorizontal: GUTTER,
    marginBottom: SPACE.md,
  },
  railContent: {
    paddingLeft: GUTTER - wp('1%'),
    paddingRight: GUTTER,
  },
  emptyContainer: {
    paddingVertical: SPACE.xl,
    paddingHorizontal: SPACE.base,
    alignItems: 'center',
  },
  emptyText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },

  floatingCart: {
    position: 'absolute',
    bottom: hp('1%'),
    left: 0,
    right: 0,
  },

  heroSkeleton: {
    height: HERO_H,
    backgroundColor: CANVAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSkeletonImage: {
    width: wp('62%'),
    height: hp('24%'),
    borderRadius: RADIUS.md,
  },
  skelLine: {
    borderRadius: RADIUS.xs,
    marginBottom: SPACE.sm,
  },
  skelPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.base,
  },
  skelRailBlock: {
    marginTop: SPACE.xl,
    paddingHorizontal: GUTTER,
  },
  skelRail: {
    flexDirection: 'row',
    gap: wp('4%'),
    marginTop: SPACE.sm,
  },
});
