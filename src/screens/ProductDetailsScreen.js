import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useProductDetails } from '../hooks/useProductDetails';
import { getStaggerDelay } from '../utils/staggerDelay';
import { LoaderContext } from '../context/loaderContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { AppContext } from '../context/appContext';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';
import AnimatedPressable from '../components/AnimatedPressable';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';

const BUMP_SPRING = { damping: 8, stiffness: 260, mass: 0.4 };
const HEART_SPRING = { damping: 10, stiffness: 340, mass: 0.5 };

const SECTION_STAGGER_MS = 90;

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

  // Animate the Image directly (a Fabric host component) instead of wrapping
  // ImageBackground with createAnimatedComponent. On the New Architecture,
  // ImageBackground's ref resolves to the class instance — not a host view —
  // so Reanimated can't attach the animated `opacity` prop and the screen
  // crashes. ImageBackground had no children here, so Image is a drop-in.
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
      {
        width: wp(isSelected ? '5%' : '2%'),
        backgroundColor: isSelected ? COLORS.primary : 'rgba(255,255,255,0.55)',
      },
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

  if (loading && !product) {
    return (
      <SafeAreaView edges={['top']} style={styles.mainContainer}>
        <View style={styles.loaderHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconCircle}
          >
            <Image source={icons.backArrowNew} />
            {/* <Ionicons name="chevron-back" size={wp('6%')} color="#000" /> */}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('5%') }}
        >
          <View style={styles.topSection}>
            <View style={styles.mainImageContainer}>
              <ShimmerPlaceholder
                style={{
                  width: wp('85%'),
                  height: hp('28%'),
                  borderRadius: 15,
                }}
                width={wp('85%')}
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <View
              style={{
                borderColor: '#D9D9D9',
                borderWidth: 0.5,
                width: wp('92%'),
                alignSelf: 'center',
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingTop: 25,
                paddingVertical: 10,
              }}
            >
              <ShimmerPlaceholder
                style={{
                  width: wp('60%'),
                  height: hp('3%'),
                  borderRadius: 4,
                  marginBottom: hp('1%'),
                }}
                width={wp('60%')}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp('40%'),
                  height: hp('2%'),
                  borderRadius: 4,
                  marginBottom: hp('2%'),
                }}
                width={wp('40%')}
              />

              <ShimmerPlaceholder
                style={{
                  width: wp('30%'),
                  height: hp('4%'),
                  borderRadius: 8,
                  marginTop: hp('1%'),
                  marginBottom: hp('2%'),
                }}
                width={wp('30%')}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <View>
                  <ShimmerPlaceholder
                    style={{
                      width: wp('20%'),
                      height: hp('2%'),
                      borderRadius: 4,
                      marginBottom: hp('0.5%'),
                    }}
                    width={wp('20%')}
                  />
                  <ShimmerPlaceholder
                    style={{
                      width: wp('35%'),
                      height: hp('4%'),
                      borderRadius: 4,
                    }}
                    width={wp('35%')}
                  />
                </View>
                <ShimmerPlaceholder
                  style={{
                    width: wp('34%'),
                    height: hp('5.5%'),
                    borderRadius: hp('3%'),
                  }}
                  width={wp('34%')}
                />
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#EEE',
                  marginVertical: hp('2%'),
                  width: wp('70%'),
                  alignSelf: 'center',
                }}
              />

              <ShimmerPlaceholder
                style={{
                  width: wp('40%'),
                  height: hp('2.5%'),
                  borderRadius: 4,
                  alignSelf: 'center',
                }}
                width={wp('40%')}
              />
            </View>
          </View>

          <View style={{ marginTop: hp('4%'), paddingHorizontal: wp('8%') }}>
            <ShimmerPlaceholder
              style={{
                width: wp('40%'),
                height: hp('3%'),
                borderRadius: 4,
                marginBottom: hp('2%'),
              }}
              width={wp('40%')}
            />
            <View style={{ flexDirection: 'row', gap: wp('4%') }}>
              <ShimmerPlaceholder
                style={{
                  width: wp('30%'),
                  height: hp('15%'),
                  borderRadius: 12,
                }}
                width={wp('30%')}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp('30%'),
                  height: hp('15%'),
                  borderRadius: 12,
                }}
                width={wp('30%')}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp('30%'),
                  height: hp('15%'),
                  borderRadius: 12,
                }}
                width={wp('30%')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.floatingHeader}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.backArrowNew} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={handleWishlistToggle}
        >
          <ReanimatedView.View style={heartAnimatedStyle}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={wp('7%')}
              color={COLORS.error}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </ReanimatedView.View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconCircle} onPress={handleShare}>
                    <Ionicons name="share-social" size={wp('6%')} color="#000" />
                </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {isStoreUnavailable ? (
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={styles.standardHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.backArrowNew} />
              {/* <Ionicons name="chevron-back" size={wp('6%')} color="#000" /> */}
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
            contentContainerStyle={{
              paddingBottom: hp('15%'),
              paddingTop: hp('5'),
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ReanimatedView.View
              style={styles.topSection}
              entering={scaleFadeIn(0)}
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
                  <View style={styles.mainImageContainer}>
                    <GalleryImage
                      source={item || productImage}
                      style={styles.imageStyle}
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
              style={styles.infoCard}
              entering={scaleFadeIn(SECTION_STAGGER_MS)}
            >
              <View
                style={{
                  borderColor: '#D9D9D9',
                  borderWidth: 0.5,
                  width: wp('92%'),
                  borderRadius: 30,
                  paddingHorizontal: 20,
                  paddingTop: 25,
                  paddingVertical: 10,
                }}
              >
                <View style={styles.titleRow}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: hp('1%'),
                      }}
                    >
                      <View>
                        {discountPercentage > 0 && (
                          <Text style={styles.discountText}>
                            {Math.round(discountPercentage) ||
                              ((unitPrice - specialPrice) / unitPrice) * 100}
                            % OFF
                          </Text>
                        )}
                      </View>

                      <View style={styles.tokenBadge}>
                        <Image
                          style={styles.tokenIconSmall}
                          source={require('../assets/icons/tokenud.png')}
                        />
                        <Text style={styles.tokenBadgeText}>
                          {Number(bTokenValue)} UD Token
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.productName}>{productName}</Text>
                    <Text style={styles.productDescription}>
                      {shortDescription}
                    </Text>
                    {/* <Text style={styles.weightText}>{product?.unit || ''}</Text> */}
                    {(!isAvailable || stockQty === 0) && (
                      <Text style={styles.outOfStockBadge}>Out of Stock</Text>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={styles.priceRow}>
                    <Text style={styles.currentPrice}>₹{specialPrice}</Text>
                    {!!unitPrice &&
                      Number(unitPrice) > Number(specialPrice) && (
                        <Text style={styles.originalPrice}>₹{unitPrice}</Text>
                      )}
                  </View>

                  <View style={styles.priceSection}>
                    <View style={styles.actionContainer}>
                      {(() => {
                        const cartItem = cartItems.find(
                          i =>
                            String(i.productId || i.id) ===
                            String(finalProductId),
                        );
                        const quantity = cartItem ? cartItem.quantity : 0;
                        const cartItemId =
                          cartItem?.cartItemId || finalProductId;

                        if (quantity > 0) {
                          return (
                            <View style={styles.quantitySelector}>
                              <AnimatedPressable
                                onPress={() => {
                                  bumpQty();
                                  quantity === 1
                                    ? removeFromCart(cartItemId)
                                    : updateCartItemQuantity(
                                        cartItemId,
                                        quantity - 1,
                                      );
                                }}
                              >
                                <LinearGradient
                                  colors={['#FFFFFF', '#FFD8C4']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={styles.plusIconCircle}
                                >
                                  <Entypo
                                    name="minus"
                                    size={wp('5%')}
                                    color="#F25000"
                                    style={styles.qtyIcon}
                                  />
                                </LinearGradient>
                              </AnimatedPressable>
                              <ReanimatedView.Text
                                style={[styles.qtyValue, qtyAnimatedStyle]}
                              >
                                {quantity}
                              </ReanimatedView.Text>
                              <AnimatedPressable
                                onPress={() => {
                                  bumpQty();
                                  updateCartItemQuantity(
                                    cartItemId,
                                    quantity + 1,
                                  );
                                }}
                              >
                                <LinearGradient
                                  colors={['#FFFFFF', '#FFD8C4']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={styles.plusIconCircle}
                                >
                                  <Entypo
                                    name="plus"
                                    size={wp('5%')}
                                    color="#F25000"
                                    style={styles.qtyIcon}
                                  />
                                </LinearGradient>
                              </AnimatedPressable>
                            </View>
                          );
                        }

                        if (!isAvailable || stockQty === 0) {
                          return (
                            <View style={styles.disabledBtn}>
                              <Text
                                style={[
                                  styles.addBtnText,
                                  { fontSize: wp('3.5%') },
                                ]}
                              >
                                OUT OF STOCK
                              </Text>
                            </View>
                          );
                        }

                        return (
                          <AnimatedPressable
                            style={styles.addBtn}
                            onPress={() => {
                              bumpQty();
                              product && addToCart(product);
                            }}
                          >
                            <LinearGradient
                              colors={['#FFFFFF', '#FFD8C4']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={[
                                styles.plusIconCircle,
                                { marginRight: wp('3%') },
                              ]}
                            >
                              <Entypo
                                name="plus"
                                size={wp('5%')}
                                color="#F25000"
                              />
                            </LinearGradient>
                            <Text style={styles.addBtnText}>ADD</Text>
                          </AnimatedPressable>
                        );
                      })()}
                    </View>
                  </View>
                </View>

                <LinearGradient
                  colors={[
                    'rgba(242, 80, 0, 0)',
                    '#FCD3C0',
                    'rgba(242, 80, 0, 0)',
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.detailsDivider}
                />
                <View style={styles.divider} />
                <TouchableOpacity
                  hitSlop={30}
                  onPress={toggleDetails}
                  style={styles.viewProductDetailsButton}
                >
                  <Text style={styles.viewProductDetailsButtonText}>
                    {showDetails ? 'View less details' : 'View product details'}
                  </Text>
                  <AntDesign
                    name={showDetails ? 'up' : 'down'}
                    size={wp('3%')}
                    color="#f25000"
                  />
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
                        const {
                          layoutMeasurement,
                          contentOffset,
                          contentSize,
                        } = event.nativeEvent;
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
                          <Text style={styles.specsHeader}>Attributes</Text>
                          <View style={styles.specsContainer}>
                            {attributes.map((attr, idx) => (
                              <View
                                key={idx}
                                style={[
                                  styles.specRow,
                                  idx % 2 !== 0 && styles.specRowAlt,
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
                            'rgba(255,255,255,0.8)',
                            '#FFFFFF',
                          ]}
                          style={styles.fadeGradient}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            detailsScrollViewRef.current?.scrollToEnd({
                              animated: true,
                            })
                          }
                          style={styles.scrollIndicator}
                        >
                          {/* <Text style={styles.scrollHintText}>
                            Scroll for more
                          </Text>
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            size={wp('4%')}
                            color="#F25000"
                          /> */}
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </Animated.View>
              </View>
            </ReanimatedView.View>

            <ReanimatedView.View
              style={styles.similarProductsSection}
              entering={scaleFadeIn(SECTION_STAGGER_MS * 2)}
            >
              <Text style={styles.sectionTitle}>Similar Products</Text>
              {relatedLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#F25000"
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
                  contentContainerStyle={{
                    paddingLeft: wp('7%'),
                    paddingRight: wp('7%'),
                  }}
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
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  loaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  standardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#FFF',
  },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp('6%') : hp('5%'),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.8%'),
    color: '#000',
    marginHorizontal: wp('4%'),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp('15%'),
  },
  topSection: {
    height: hp('38%'),
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  imageBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: wp('100%'),
    height: hp('40%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  imageStyle: {
    width: wp('85%'),
    height: hp('28%'),
  },
  paginationContainer: {
    position: 'absolute',
    bottom: hp('2%'),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
    backgroundColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCard: {
    // marginTop: -hp('5%'),
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: wp('12%'),
    borderTopRightRadius: wp('12%'),
    paddingTop: hp('5%'),
    paddingHorizontal: wp('8%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
  },
  productName: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: '#000',
    lineHeight: hp('3%'),
  },
  productDescription: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#727783',
    marginTop: hp('0.3%'),
  },
  weightText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4.4%'),
    color: '#727783',
    marginTop: hp('1%'),
  },
  tokenBadge: {
    top: 3,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    borderLeftWidth: 1,
    borderColor: 'black',
  },
  tokenIconSmall: {
    width: wp('4%'),
    height: wp('3%'),
    resizeMode: 'contain',
  },
  tokenBadgeText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#5e3568',
    marginLeft: wp('1.5%'),
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    //  marginTop: hp('3%'),
  },
  discountText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.4%'),
    color: '#FFF',
    paddingHorizontal: hp('2%'),
    borderRadius: 20,
    paddingVertical: hp('.5%'),
    marginRight: 16,
    backgroundColor: '#0CA201',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.4%'),
  },
  currentPrice: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.8%'),
    color: '#000',
  },
  originalPrice: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.8%'),
    color: '#727783',
    textDecorationLine: 'line-through',
    marginLeft: wp('3%'),
  },
  unitPriceText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: '#969696',
    marginTop: hp('0.4%'),
  },
  actionContainer: {
    height: hp('6.5%'),
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: '#F25000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp('34%'),
    height: hp('5.5%'),
    borderRadius: hp('3%'),
    paddingLeft: wp('2%'),
  },
  plusIconCircle: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: wp('4.25%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyIcon: {
    // textAlign: 'center',
    // textAlignVertical: 'center',
    // includeFontPadding: false,
  },
  addBtnText: {
    color: '#FFF',

    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.8%'),
  },
  disabledBtn: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('34%'),
    height: hp('5.5%'),
    borderRadius: hp('3%'),
  },
  outOfStockBadge: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: '#FF0000',
    marginTop: hp('0.5%'),
  },
  quantitySelector: {
    backgroundColor: '#F25000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('34%'),
    height: hp('5.5%'),
    borderRadius: hp('3%'),
    paddingHorizontal: wp('2%'),
  },
  qtyValue: {
    color: '#FFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
  },
  detailsDivider: {
    width: wp('70%'),
    height: 3,
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  viewProductDetailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  viewProductDetailsButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#f25000',
    marginRight: wp('1.5%'),
    paddingBottom: hp(0.5),
  },
  productDetailsView: {
    marginTop: hp('0.5%'),
  },
  productDetailsText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
    color: '#555',
    lineHeight: hp('3%'),
  },
  specsHeader: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#333',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  specsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: wp('4%'),
    padding: wp('2%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specRowAlt: {
    backgroundColor: '#FFFFFF',
  },
  specLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.6%'),
    color: '#444',
    width: wp('40%'),
  },
  specValue: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#777',
    flex: 1,
  },
  similarProductsSection: {
    paddingTop: hp('1%'),
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4.5%'),
    color: '#000',
    paddingHorizontal: wp('8%'),
    marginBottom: hp('2%'),
  },
  emptyContainer: {
    padding: wp('10%'),
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCart: {
    position: 'absolute',
    bottom: hp('1%'),
    left: 0,
    right: 0,
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp('10%'),
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
  },
  scrollHintText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#F25000',
    marginRight: wp('1%'),
  },
});
