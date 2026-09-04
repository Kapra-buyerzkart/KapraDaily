import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { styles } from './styles';
import { useCommonStyles } from '../../assets/styles';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../theme/colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Rating } from 'react-native-ratings';
import LinearGradient from 'react-native-linear-gradient';
import { LoaderContext } from '../../context/loaderContext';
import {
  getProductDetails,
  getRelatedProductsApi,
} from '../../api/services/productService';
import CONFIG from '../../globals/config';
import {
  addToCartApi,
  removeFromCartApi,
  updateCartItemApi,
} from '../../api/services/cartService';
import { useCart } from '../../context/CartContext';
import Animated from 'react-native-reanimated';
import FloatingCartButton from '../../components/FloatingCartButton';
import { useCartPillScrollProps } from '../../components/cartPillScroll';
import {
  addToWishlistApi,
  removeFromWishlistApi,
} from '../../api/services/wishlistService';
import { useWishlist } from '../../context/WishlistContext';
import FallbackImage from '../../components/FallbackImage';
import { getKshopeAreaId } from '../../globals/storage';
import Toast from 'react-native-simple-toast';
import { isCartSuccess, cartErrorMessage } from '../../utils/cartFeedback';

const ADD_FAILED = 'Could not add this item to your cart';
const UPDATE_FAILED = 'Could not update the quantity';
const REMOVE_FAILED = 'Could not remove this item';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const homeStyles = useCommonStyles();

  const { cartItems, cartSummary, loadCart } = useCart();
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { product, productId } = (route.params as any) || {};

  const item = product || {};

  const product_id = item?.productId || productId;

  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const cartPillScroll = useCartPillScrollProps();
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth - 24;

  const getImageUrl = (imagePath: any) => {
    if (!imagePath) return require('../../assets/images/logos/noimage.png');
    if (typeof imagePath !== 'string') return imagePath;
    if (imagePath.startsWith('http')) return { uri: imagePath };
    return {
      uri: `${CONFIG.image_base_url}/${imagePath}`.replace(
        /([^:]\/)\/+/g,
        '$1',
      ),
    };
  };

  const currentImages =
    productDetails && productDetails.images && productDetails.images.length > 0
      ? productDetails.images
      : item?.imageUrl || item?.image || item?.featuredImage
      ? [{ imageUrl: item.imageUrl || item.image || item.featuredImage }]
      : [];

  const ProductTitle =
    productDetails?.product?.prName ||
    item?.prName ||
    item?.title ||
    'Loading...';
  const ProductDesc = productDetails?.product?.description
    ? productDetails.product.description.replace(/<\/?[^>]+(>|$)/g, '').trim()
    : productDetails?.product?.shortDescription ||
      item?.shortDescription ||
      'No description available.';

  const fetchProductDetails = async (pincodeAreaId: number | null) => {
    try {
      showLoader(true);
      const [response, relatedResponse] = await Promise.all([
        getProductDetails(product_id, pincodeAreaId),
        getRelatedProductsApi(product_id, pincodeAreaId),
      ]);

      console.log('ProductDetails response:', response);

      if (response && response.success && response.data) {
        setProductDetails(response.data);
      } else {
        setProductDetails(null);
      }
      if (relatedResponse && relatedResponse.success && relatedResponse.data) {
        setRelatedProducts(relatedResponse.data?.items || []);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      setProductDetails(null);
    } finally {
      showLoader(false);
    }
  };

  useEffect(() => {
    const initializeLocationAndSettings = async () => {
      try {
        const storedPincodeAreaId = await getKshopeAreaId();
        setPincodeAreaId(storedPincodeAreaId);
      } catch (error) {
        console.error('Error in initializeLocationAndSettings:', error);
      }
    };

    initializeLocationAndSettings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (pincodeAreaId !== null || pincodeAreaId === null) {
        fetchProductDetails(pincodeAreaId);
        loadCart();
      }
    }, [pincodeAreaId, product_id]),
  );

  const addToCartFunction = async (productId: string) => {
    try {
      showLoader(true);
      const existingItem = cartItems.find(
        (item: any) => String(item.productId) === String(productId),
      );

      let response;
      if (existingItem) {
        response = await updateCartItemApi(
          existingItem.cartItemId,
          existingItem.quantity + 1,
          cartSummary?.cartVersion,
          productId,
          pincodeAreaId,
        );
      } else {
        response = await addToCartApi(productId, 1, pincodeAreaId);
      }

      if (!isCartSuccess(response)) {
        Toast.show(cartErrorMessage(response, ADD_FAILED), Toast.SHORT);
        await loadCart();
        return;
      }

      await loadCart();

      setProductDetails((prev: any) => ({
        ...prev,
        customerspecific: {
          ...prev?.customerspecific,
          cartQty: (prev?.customerspecific?.cartQty || 0) + 1,
        },
      }));
    } catch (error) {
      Toast.show(cartErrorMessage(error, ADD_FAILED), Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  const updateCartFunction = async (productId: string, quantity: number) => {
    try {
      showLoader(true);
      const existingItem = cartItems.find(
        (item: any) => String(item.productId) === String(productId),
      );

      let response;
      if (existingItem) {
        response = await updateCartItemApi(
          existingItem.cartItemId,
          quantity,
          cartSummary?.cartVersion,
          productId,
          pincodeAreaId,
        );
      } else {
        response = await addToCartApi(productId, 1, pincodeAreaId);
      }

      if (!isCartSuccess(response)) {
        Toast.show(cartErrorMessage(response, UPDATE_FAILED), Toast.SHORT);
        await loadCart();
        return;
      }

      await loadCart();

      setProductDetails((prev: any) => ({
        ...prev,
        customerspecific: {
          ...prev?.customerspecific,
          cartQty: quantity,
        },
      }));
    } catch (error) {
      Toast.show(cartErrorMessage(error, UPDATE_FAILED), Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  const romoveFromCart = async (productId: string) => {
    try {
      showLoader(true);
      const existingItem = cartItems.find(
        (item: any) => String(item.productId) === String(productId),
      );

      if (existingItem) {
        const response = await removeFromCartApi(
          existingItem.cartItemId,
          cartSummary?.cartVersion,
          productId,
          pincodeAreaId,
        );

        if (!isCartSuccess(response)) {
          Toast.show(cartErrorMessage(response, REMOVE_FAILED), Toast.SHORT);
          await loadCart();
          return;
        }
      }

      await loadCart();

      setProductDetails((prev: any) => ({
        ...prev,
        customerspecific: {
          ...prev?.customerspecific,
          cartQty: 0,
        },
      }));
    } catch (error) {
      Toast.show(cartErrorMessage(error, REMOVE_FAILED), Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerIconBg}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.black} />
      </TouchableOpacity>
      <View style={styles.headerRightIcons}>
        <TouchableOpacity
          style={styles.headerIconBg}
          onPress={() => toggleWishlist(productDetails?.product || item)}
        >
          {isInWishlist(product_id) ? (
            <AppIcons.BookmarkFilled color={colors.themeTeal} size={24} />
          ) : (
            <AppIcons.BookmarkOutline color={colors.themeTeal} size={24} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageSection = () => {
    return (
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={e => {
            const slideSize = e.nativeEvent.layoutMeasurement.width;
            const index = Math.round(e.nativeEvent.contentOffset.x / slideSize);
            if (
              index !== activeImageIndex &&
              index >= 0 &&
              index < currentImages.length
            ) {
              setActiveImageIndex(index);
            }
          }}
          scrollEventThrottle={16}
        >
          {currentImages.map((img: any, idx: number) => (
            <FallbackImage
              key={idx}
              source={getImageUrl(img.imageUrl || img)}
              style={[styles.productImage, { width: imageWidth }]}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {currentImages.map((_: any, idx: number) => (
            <View
              key={idx}
              style={
                idx === activeImageIndex
                  ? styles.paginationDotActive
                  : styles.paginationDotInactive
              }
            />
          ))}
        </View>
      </View>
    );
  };

  const DeliveryAndService = () => {
    return (
      <View>
        <Text
          style={[
            styles.sectionTitle,
            { marginHorizontal: 16, marginTop: 8, marginBottom: 0 },
          ]}
        >
          Delivery and Service
        </Text>

        <View style={styles.deliveryFeaturesRow}>
          <View style={styles.deliveryFeatureItem}>
            <View style={styles.deliveryFeatureIcon}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="#F25000"
              />
            </View>
            <Text style={styles.deliveryFeatureText}>
              Quality{'\n'}products
            </Text>
          </View>
          <View style={styles.deliveryFeatureItem}>
            <View style={styles.deliveryFeatureIcon}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={24}
                color="#F25000"
              />
            </View>
            <Text style={styles.deliveryFeatureText}>Easy{'\n'}returns</Text>
          </View>
          <View style={styles.deliveryFeatureItem}>
            <View style={styles.deliveryFeatureIcon}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={24}
                color="#F25000"
              />
            </View>
            <Text style={styles.deliveryFeatureText}>
              Secure{'\n'}Transaction
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={homeStyles.exploreItemCard}
      onPress={() => {
        navigation.push('KshopeProductDetails', {
          productId: item?.productId,
          product: item,
        });
      }}
    >
      <View style={homeStyles.exploreTopBadgesRow}>
        <View
          style={[
            homeStyles.discountCircle,
            {
              opacity: item?.discountPercentage || item?.discountBadge ? 1 : 0,
            },
          ]}
        >
          <Text style={[homeStyles.discountCircleText]}>
            {item?.discountPercentage
              ? `${Math.round(item.discountPercentage)}%`
              : item?.discountBadge}
          </Text>
        </View>
      </View>

      <FallbackImage
        source={getImageUrl(
          item?.featuredImage || item?.imageUrl || item?.image,
        )}
        style={homeStyles.exploreItemImage}
        resizeMode="contain"
      />

      <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={[homeStyles.caption]} numberOfLines={3}>
            {item?.prName || item?.title}
          </Text>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 4,
              gap: 2,
            }}
          >
            <View style={homeStyles.pricePill}>
              <Text style={homeStyles.pricePillText}>
                {item?.specialPrice || item?.unitPrice
                  ? `₹${(item?.specialPrice || item?.unitPrice).toFixed(2)}`
                  : item?.currentPrice || ''}
              </Text>
            </View>
            {item?.unitPrice &&
            item?.specialPrice &&
            item.unitPrice > item.specialPrice ? (
              <Text style={homeStyles.originalPriceText}>
                MRP ₹{item.unitPrice.toFixed(2)}
              </Text>
            ) : item?.originalPrice ? (
              <Text style={homeStyles.originalPriceText}>
                {item.originalPrice}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {renderHeader()}

        <Animated.ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          {...cartPillScroll}
        >
          {renderImageSection()}

          <View style={styles.contentPadding}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingHorizontal: 24,
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.title}>{ProductTitle}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}
                >
                  {(productDetails?.ratingSummary?.reviewCount || 0) > 0 && (
                    <>
                      <Rating
                        type="custom"
                        readonly
                        startingValue={
                          productDetails?.ratingSummary?.avgRating || 0
                        }
                        ratingCount={5}
                        imageSize={16}
                        ratingColor={colors.starYellow}
                        ratingBackgroundColor={colors.lightGrey}
                        tintColor={colors.white}
                      />
                      <Text
                        style={{
                          marginLeft: 6,
                          fontSize: 12,
                          color: colors.grey,
                          fontFamily: 'Gilroy-Medium',
                        }}
                      >
                        ({productDetails?.ratingSummary?.reviewCount} Reviews)
                      </Text>
                    </>
                  )}
                </View>
              </View>
              {productDetails?.product?.discountPercentage ? (
                <View
                  style={[
                    homeStyles.discountCircle,
                    {
                      opacity: 1,
                      paddingHorizontal: 6,
                      position: 'relative',
                      alignSelf: 'flex-start',
                      marginTop: 4,
                    },
                  ]}
                >
                  <Text style={homeStyles.discountCircleText}>
                    {Math.round(productDetails?.product?.discountPercentage)}%
                    OFF
                  </Text>
                </View>
              ) : null}
            </View>

            {productDetails?.product && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                  marginBottom: 4,
                  gap: 8,
                  paddingHorizontal: 24,
                }}
              >
                <View
                  style={[
                    homeStyles.pricePill,
                    { minHeight: 35, minWidth: 70 },
                  ]}
                >
                  <Text style={homeStyles.pricePillText}>
                    ₹
                    {productDetails?.product?.specialPrice?.toFixed(2) ||
                      productDetails?.product?.unitPrice?.toFixed(2)}
                  </Text>
                </View>
                {productDetails?.product?.unitPrice &&
                productDetails?.product?.specialPrice &&
                productDetails?.product?.unitPrice >
                  productDetails?.product?.specialPrice ? (
                  <Text style={homeStyles.originalPriceText}>
                    MRP ₹{productDetails?.product?.unitPrice?.toFixed(2)}
                  </Text>
                ) : null}
              </View>
            )}

            <Text
              style={[
                styles.description,
                { marginTop: 4, paddingVertical: 20 },
              ]}
            >
              {productDetails?.product?.shortDescription}
            </Text>

            <View style={{ marginTop: !detailsExpanded ? 20 : -10 }}>
              <TouchableOpacity
                onPress={() => setDetailsExpanded(!detailsExpanded)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {!detailsExpanded ? (
                  <LinearGradient
                    colors={[
                      'rgba(255, 255, 255, 0)',
                      'rgba(255, 240, 230, 0.7)',
                      'rgba(255, 225, 210, 0.95)',
                    ]}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 50,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      alignSelf: 'center',
                      alignContent: 'center',
                      borderRadius: 80,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Gilroy-Medium',
                        color: colors.black,
                      }}
                    >
                      Product Details
                    </Text>
                    <MaterialIcons
                      name={
                        detailsExpanded
                          ? 'keyboard-arrow-up'
                          : 'keyboard-arrow-down'
                      }
                      size={20}
                      color={colors.black}
                    />
                  </LinearGradient>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Gilroy-medium',
                        color: colors.black,
                      }}
                    >
                      Product Details
                    </Text>
                    <MaterialIcons
                      name={
                        detailsExpanded
                          ? 'keyboard-arrow-up'
                          : 'keyboard-arrow-down'
                      }
                      size={20}
                      color={colors.black}
                    />
                  </>
                )}
              </TouchableOpacity>

              {detailsExpanded && (
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    height: specsExpanded ? 320 : 'auto',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={{ flex: 1, marginBottom: specsExpanded ? 80 : 0 }}
                    contentContainerStyle={{
                      paddingBottom: specsExpanded ? 16 : 70,
                    }}
                    scrollEnabled={specsExpanded}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        color: '#666',
                        fontSize: 13,
                        lineHeight: 18,
                        marginBottom: 16,
                        textAlign: 'left',
                        marginTop: 10,
                      }}
                    >
                      {ProductDesc}
                    </Text>

                    {specsExpanded && (
                      <View style={{ marginTop: 8 }}>
                        {(productDetails?.attributes || []).map(
                          (attr: any, idx: number) => (
                            <View
                              key={idx}
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 8,
                                borderBottomWidth: 0.5,
                                borderColor: '#F0F0F0',
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: 'Gilroy-Medium',
                                  color: '#888',
                                  fontSize: 13,
                                }}
                              >
                                {attr.attrName}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Gilroy-Bold',
                                  color: colors.black,
                                  fontSize: 13,
                                }}
                              >
                                {attr.attrValue}
                              </Text>
                            </View>
                          ),
                        )}
                      </View>
                    )}
                  </ScrollView>

                  {!specsExpanded ? (
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 240, 230, 0.7)',
                        'rgba(255, 225, 210, 0.95)',
                      ]}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 90,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        paddingBottom: 16,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setSpecsExpanded(true)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                        }}
                      >
                        <Ionicons
                          name="arrow-down-circle"
                          size={20}
                          color="#000"
                        />
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'Gilroy-Medium',
                            fontSize: 14,
                          }}
                        >
                          View more
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  ) : (
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 240, 230, 0.7)',
                        'rgba(255, 225, 210, 0.95)',
                      ]}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 90,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        paddingBottom: 16,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setSpecsExpanded(false)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="arrow-up-circle"
                          size={20}
                          color="#000"
                          style={{ bottom: 5 }}
                        />
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'Gilroy-Medium',
                            fontSize: 14,
                            bottom: 5,
                          }}
                        >
                          View less
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  )}
                </View>
              )}
            </View>
          </View>
          <DeliveryAndService />
          <View>
            <TouchableOpacity
              onPress={() => setReviewsExpanded(!reviewsExpanded)}
              style={[
                styles.accordionHeader,
                { paddingHorizontal: 16, marginTop: 12 },
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.accordionTitle}>Rating & Reviews</Text>
              <MaterialIcons
                name={
                  reviewsExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                }
                size={22}
                color={colors.black}
              />
            </TouchableOpacity>

            {reviewsExpanded && (
              <>
                <View style={styles.ratingOverviewRow}>
                  <View
                    style={[
                      styles.bigRatingBadge,
                      { borderColor: '#F25000', backgroundColor: '#FFF0E6' },
                    ]}
                  >
                    <Text style={[styles.bigRatingText, { color: '#F25000' }]}>
                      {productDetails?.ratingSummary?.avgRating || '0.0'}
                    </Text>
                    <AppIcons.Star size={18} color="#F25000" />
                  </View>

                  <View style={styles.ratingOverviewStats}>
                    <Text style={styles.ratingStatsText}>
                      {productDetails?.ratingSummary?.reviewCount || 0} Rating
                    </Text>
                    <View style={styles.ratingStatsDivider} />
                    <Text style={styles.ratingStatsText}>
                      {productDetails?.ratingSummary?.reviewCount || 0} Reviews
                    </Text>
                  </View>
                </View>
                <View style={{ marginBottom: 12 }}>
                  {(productDetails?.reviews || []).length > 0 ? (
                    (showAllReviews
                      ? productDetails.reviews
                      : productDetails.reviews.slice(0, 2)
                    ).map((review: any, index: number) => (
                      <View
                        key={review.reviewId || index}
                        style={styles.reviewItem}
                      >
                        <View style={styles.reviewerHeader}>
                          <Text
                            style={[
                              styles.reviewerName,
                              { fontFamily: 'Gilroy-Bold', fontSize: 15 },
                            ]}
                          >
                            {review.custName ||
                              review.customerName ||
                              'Customer'}
                          </Text>
                          <Rating
                            type="custom"
                            readonly
                            startingValue={review.rating || 0}
                            ratingCount={5}
                            imageSize={12}
                            ratingColor={colors.starYellow}
                            ratingBackgroundColor={colors.lightGrey}
                            tintColor={colors.white}
                          />
                        </View>
                        <Text
                          style={[
                            styles.reviewText,
                            { color: '#444', lineHeight: 18 },
                          ]}
                        >
                          {review.reviewText || review.reviewComment}
                        </Text>
                        <Text
                          style={[
                            styles.reviewTime,
                            { color: '#999', fontSize: 12, marginTop: 4 },
                          ]}
                        >
                          {review.time ||
                            (review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : '')}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        color: '#888',
                        fontSize: 13,
                        textAlign: 'center',
                        marginVertical: 16,
                      }}
                    >
                      No reviews available yet for this product.
                    </Text>
                  )}
                </View>
                {productDetails?.reviews &&
                  productDetails.reviews.length > 2 && (
                    <TouchableOpacity
                      style={[
                        styles.viewAllReviewsButton,
                        { borderColor: '#E0E0E0' },
                      ]}
                      onPress={() => setShowAllReviews(prev => !prev)}
                    >
                      <Text
                        style={[
                          styles.viewAllReviewsText,
                          { color: '#F25000', fontFamily: 'Gilroy-Bold' },
                        ]}
                      >
                        {showAllReviews
                          ? 'Show less'
                          : `View all (${productDetails.reviews.length})`}
                      </Text>
                    </TouchableOpacity>
                  )}
              </>
            )}
          </View>

          {relatedProducts && relatedProducts.length > 0 && (
            <View style={styles.similarProductsContainer}>
              <Text
                style={[
                  styles.accordionTitle,
                  {
                    marginBottom: 4,
                    textAlign: 'left',
                    fontFamily: 'Gilroy-Bold',
                  },
                ]}
              >
                Similar Products
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarProductsScroll}
                data={relatedProducts}
                keyExtractor={(item, index) =>
                  item?.productId
                    ? item?.productId.toString()
                    : index.toString()
                }
                renderItem={renderExploreItem}
              />
            </View>
          )}
          <View style={{ height: 100 }} />
        </Animated.ScrollView>

        <FloatingCartButton bottom={100} />

        <View style={styles.stickyFooter}>
          <View style={styles.footerPriceCol}>
            <Text style={styles.footerOldPriceText}>
              MRP ₹{productDetails?.product?.unitPrice?.toFixed(2) || '394.00'}
            </Text>
            <Text style={styles.footerPriceText}>
              ₹
              {productDetails?.product?.specialPrice?.toFixed(2) ||
                productDetails?.product?.unitPrice?.toFixed(2) ||
                '324.00'}
            </Text>
          </View>

          <View style={styles.footerActionsRow}>
            {(() => {
              const isOutOfStock =
                productDetails?.product?.stockQty <= 0 ||
                productDetails?.product?.stockAvailability === 'Out Of Stock';
              const cartItem = cartItems.find(
                (c: any) => String(c.productId) === String(product_id),
              );
              const cartQty = cartItem
                ? cartItem.quantity
                : productDetails?.customerspecific?.cartQty || 0;

              if (isOutOfStock) {
                return (
                  <TouchableOpacity
                    disabled={true}
                    style={{ borderRadius: 25, overflow: 'hidden' }}
                  >
                    <View
                      style={[
                        styles.footerBuyBtn,
                        { backgroundColor: '#E0E0E0', borderColor: '#E0E0E0' },
                      ]}
                    >
                      <Text
                        style={[styles.footerBuyBtnText, { color: '#888' }]}
                      >
                        Out of Stock
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              if (cartQty > 0) {
                const productId =
                  productDetails?.product?.productId || product_id;
                return (
                  <View
                    style={{
                      borderRadius: 25,
                      overflow: 'hidden',
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F25000',
                      height: 48,
                      paddingHorizontal: 16,
                      minWidth: 140,
                      justifyContent: 'space-between',
                      elevation: 2,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (cartQty > 1) {
                          updateCartFunction(productId, cartQty - 1);
                        } else {
                          romoveFromCart(productId);
                        }
                      }}
                      style={{
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="minus"
                        size={20}
                        color={colors.white}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: 'Gilroy-Bold',
                        fontSize: 16,
                        marginHorizontal: 16,
                      }}
                    >
                      {cartQty}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        updateCartFunction(productId, cartQty + 1);
                      }}
                      style={{
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        size={20}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    addToCartFunction(product_id);
                  }}
                  style={{
                    borderRadius: 25,
                    overflow: 'hidden',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                >
                  <LinearGradient
                    colors={['#F25000', '#FF7A00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 48,
                      minWidth: 140,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: 'Gilroy-Bold',
                        fontSize: 16,
                      }}
                    >
                      Add
                    </Text>
                    <MaterialCommunityIcons
                      name="plus"
                      size={18}
                      color={colors.white}
                      style={{ marginLeft: 6 }}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              );
            })()}
          </View>
        </View>
      </View>
    </>
  );
};

export default ProductDetailsScreen;
