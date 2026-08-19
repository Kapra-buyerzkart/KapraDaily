import { DEALS48_ROUTES } from '../../navigation/routes';
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { styles } from './styles';
import { useCommonStyles } from '../../assets/styles';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RatingStars from '../../components/RatingStars';
import LinearGradient from 'react-native-linear-gradient';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
import { LoaderContext } from '../../../../context/loaderContext';
import {
  getProductDetails,
  getRelatedProductsApi,
} from '../../api/services/productService';
import { getPincodeAreaId } from '../../globals/storage';
import CONFIG from '../../globals/config';
import { addToCartApi } from '../../api/services';

import {
  removeFromCartApi,
  updateCartItemApi,
} from '../../api/services/cartService';
import { useCart } from '../../context/CartContext';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import {
  addToWishlistApi,
  removeFromWishlistApi,
} from '../../api/services/wishlistService';
import { useWishlist } from '../../context/WishlistContext';
import FallbackImage from '../../components/FallbackImage';

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const homeStyles = useCommonStyles();

  const { cartItems, cartSummary, loadCart } = useCart();
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Retrieve item from params or provide fallback

  // Get product correctly
  const { product, productId } = (route.params as any) || {};

  // fallback if needed
  const item = product || {};

  const product_id = item?.productId || productId;

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(true);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState('All');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth - 24; // 12 margin applied to imageContainer from both sides

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

  const sizes = ['S', 'M', 'L', 'XL'];
  const dummyReviews = [
    {
      id: '1',
      name: 'Kapra Media',
      rating: 3,
      text: 'Saddle slightly firm finding light hiking rough light lifestyle fitting...  Saddle slightly firm finding light hiking rough light lifestyle...',
      time: '1 min ago',
    },
    {
      id: '2',
      name: 'Kapra Media',
      rating: 3,
      text: 'Saddle slightly firm finding light hiking rough light lifestyle fitting...  Saddle slightly firm finding light hiking rough light lifestyle...',
      time: '1 min ago',
    },
  ];

  const productInfoDetails = [
    {
      label: 'Disclaimer',
      value:
        'All images are for representative purposes only. It is advised that you read the labels and manufacturing details for more information. Health and nutritional claims...',
    },
    {
      label: 'Customer Care details',
      value:
        'For queries, please contact us at care@kshopee.com or support@kshopee.com',
    },
  ];

  // Mock similar products
  const similarProducts = [
    {
      id: '1',
      title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
      image: require('../../assets/images/home/explore.png'),
      originalPrice: 'MRP ₹394.00',
      currentPrice: '₹324.00',
      discountBadge: '-17%',
      rating: 1,
    },
    {
      id: '2',
      title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
      image: require('../../assets/images/home/explore.png'),
      originalPrice: 'MRP ₹394.00',
      currentPrice: '₹324.00',
      discountBadge: '-17%',
      rating: 1,
    },
    {
      id: '3',
      title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
      image: require('../../assets/images/home/explore.png'),
      originalPrice: 'MRP ₹394.00',
      currentPrice: '₹324.00',
      discountBadge: '-17%',
      rating: 1,
    },
  ];

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

      console.log(
        'product details response---->',
        JSON.stringify(response, null, 2),
      );
      if (response && response.success && response.data) {
        console.log(
          'product details response data---->',
          JSON.stringify(response.data, null, 2),
        );
        setProductDetails(response.data);
      } else {
        setProductDetails(null);
      }
      if (relatedResponse && relatedResponse.success && relatedResponse.data) {
        console.log(
          'related products response data---->',
          JSON.stringify(relatedResponse.data, null, 2),
        );
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
        const storedPincodeAreaId = await getPincodeAreaId();
        const pincodeAreaId = storedPincodeAreaId
          ? parseInt(storedPincodeAreaId)
          : null;
        setPincodeAreaId(pincodeAreaId);
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
        console.log('Updating existing item in cart...');
        response = await updateCartItemApi(
          existingItem.cartItemId,
          existingItem.quantity + 1,
          cartSummary?.cartVersion,
          productId,
          pincodeAreaId,
        );
      } else {
        console.log('Adding new item to cart...');
        response = await addToCartApi(productId, 1, pincodeAreaId);
      }

      console.log(
        'cart operation response---->',
        JSON.stringify(response, null, 2),
      );

      // Reload cart globally in context
      await loadCart();

      // Update local state as immediate feedback
      setProductDetails((prev: any) => ({
        ...prev,
        customerspecific: {
          ...prev?.customerspecific,
          cartQty: (prev?.customerspecific?.cartQty || 0) + 1,
        },
      }));
    } catch (error) {
      console.error('Error modifying cart:', error);
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
        console.log('Updating existing item in cart...');
        response = await updateCartItemApi(
          existingItem.cartItemId,
          quantity,
          cartSummary?.cartVersion,
          productId,
          pincodeAreaId,
        );
      } else {
        console.log('Adding new item to cart...');
        response = await addToCartApi(productId, 1, pincodeAreaId);
      }

      console.log(
        'cart operation response---->',
        JSON.stringify(response, null, 2),
      );

      await loadCart();

      setProductDetails((prev: any) => ({
        ...prev,
        customerspecific: {
          ...prev?.customerspecific,
          cartQty: quantity,
        },
      }));
    } catch (error) {
      console.error('Error modifying cart:', error);
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
        console.log(
          'removeFromCart response---->',
          JSON.stringify(response, null, 2),
        );
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
      console.error('Error removing from cart:', error);
    } finally {
      showLoader(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      setRelatedProducts(prev =>
        prev.map(p =>
          (p.productId || p.id) === productId
            ? { ...p, isWishlist: true, isWishlisted: true }
            : p,
        ),
      );
      showLoader(true);
      const response = await addToWishlistApi(productId);
      console.log(
        'addToWishlist response---->',
        JSON.stringify(response, null, 2),
      );
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setRelatedProducts(prev =>
        prev.map(p =>
          (p.productId || p.id) === productId
            ? { ...p, isWishlist: false, isWishlisted: false }
            : p,
        ),
      );
    } finally {
      showLoader(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setRelatedProducts(prev =>
        prev.map(p =>
          (p.productId || p.id) === productId
            ? { ...p, isWishlist: false, isWishlisted: false }
            : p,
        ),
      );
      showLoader(true);
      const response = await removeFromWishlistApi(productId);
      console.log(
        'removeFromWishlist response---->',
        JSON.stringify(response, null, 2),
      );
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setRelatedProducts(prev =>
        prev.map(p =>
          (p.productId || p.id) === productId
            ? { ...p, isWishlist: true, isWishlisted: true }
            : p,
        ),
      );
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
        {/* <TouchableOpacity style={styles.headerIconBg}>
          <Ionicons
            name="share-social-outline"
            size={22}
            color={colors.black}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderImageSection = () => {
    {
      /* Image Section */
    }
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

        {/* <View style={styles.locationCard}> */}
        {/* <View style={styles.locationHeader}>
            <View style={styles.locationLeftRow}>
              <AppIcons.Location size={20} color="#F25000" />
              <Text style={styles.locationTitleText}>Delivering to | Home</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.locationChangeText, { color: '#F25000' }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>
            Nishamanzil(h),Vennala Chakkaraparambu Road ,ernakulam district
            654443
          </Text>
        </View> */}
      </View>
    );
  };

  const renderSimilarProduct = ({ item: simItem }: any) => {
    // Fallback image in case the require fails or is missing
    const simImg =
      simItem.image || require('../../assets/images/logos/noimage.png');

    return (
      <TouchableOpacity style={styles.similarProductCard}>
        <View style={styles.similarDiscountBadge}>
          <Text style={styles.similarDiscountText}>{simItem.discount}</Text>
        </View>
        <TouchableOpacity style={styles.similarBookmarkBtn}>
          <AppIcons.BookmarkOutline size={16} color={colors.themeTeal} />
        </TouchableOpacity>
        <FallbackImage source={simImg} style={styles.similarProductImage} />
        <Text style={styles.similarTitle} numberOfLines={2}>
          {simItem.title}
        </Text>

        {/* <Rating
          type="custom"
          readonly
          startingValue={4}
          ratingCount={5}
          imageSize={10}
          ratingColor={colors.starYellow}
          ratingBackgroundColor={colors.themeLightGray}
          tintColor={colors.themeWhite}
          style={{ alignSelf: 'flex-start', marginVertical: 4 }}
        /> */}

        <View style={styles.similarPriceRow}>
          <Text style={styles.similarPrice}>{simItem.price}</Text>
          <Text style={styles.similarOldPrice}>{simItem.oldPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={homeStyles.exploreItemCard}
      onPress={() => {
        navigation.push(DEALS48_ROUTES.PRODUCT_DETAILS, {
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
          {/* <Rating
            type="custom"
            readonly
            startingValue={item?.rating || 1}
            ratingCount={5}
            imageSize={12}
            ratingColor={colors.starYellow}
            ratingBackgroundColor={colors.lightGrey}
            tintColor={colors.white}
            style={{ alignSelf: 'flex-start', marginVertical: 6 }}
          /> */}

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

        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section */}
          {renderImageSection()}

          {/* Main Content Info */}
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
                      <RatingStars
                        value={productDetails?.ratingSummary?.avgRating || 0}
                        count={5}
                        size={16}
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

            {/* Side-by-side Select Color & Select Size exactly like screenshot */}

            {/* Product Details Section Card exactly like screenshot with gradient fade */}
            <View style={{ marginTop: !detailsExpanded ? 20 : -10 }}>
              <TouchableOpacity
                onPress={() => setDetailsExpanded(!detailsExpanded)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  //     paddingVertical: 12,
                  // borderTopWidth: 1,
                  //  borderBottomWidth: 1,
                  //  borderColor: '#F0F0F0',
                  //  marginVertical: 16,
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
                      //  paddingVertical: 30,
                      // justifyContent: 'flex-end',
                      // alignItems: 'center',
                      //  paddingBottom: 16,
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
                        // paddingVertical: 20,
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

              {/* Arched/Curved Details card with Warm Bottom Gradient and support@zeptonow.com email */}
              {detailsExpanded && (
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    height: specsExpanded ? 320 : 'auto',
                    overflow: 'hidden',
                    position: 'relative', // Absolutely critical so the absolute positioned View more stays pinned to bottom!
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

                  {/* Elegant warm orange gradient overlay matching the screenshot perfectly when specsExpanded is false */}
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
          {/* End of contentPadding */}
          <DeliveryAndService />
          {/* Ratings & Reviews Section */}
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
                {' '}
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
                {/* Filter Pills scroll row matching screenshot */}
                {/* <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.reviewFiltersScroll, { marginBottom: 16 }]}
            >
              {[
                'All',
                'Latest',
                'Popular',
                'Highest Rating',
                'Lowest Rating',
              ].map(filter => {
                const isActive = selectedReviewFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setSelectedReviewFilter(filter)}
                    style={[
                      styles.reviewFilterPill,
                      isActive && {
                        backgroundColor: '#F25000',
                        borderColor: '#F25000',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reviewFilterText,
                        isActive && {
                          color: colors.white,
                          fontFamily: 'Gilroy-Bold',
                        },
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView> */}
                {/* Review List - strictly API data only */}
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
                          <RatingStars
                            value={review.rating || 0}
                            count={5}
                            size={12}
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

          {/* Similar Products - strictly API data only */}
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

              {/* <TouchableOpacity style={styles.clickForMoreBtn}>
                <Text style={styles.clickForMoreText}>
                  Click for more offers
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#000" />
              </TouchableOpacity> */}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>

        <FloatingCartButton bottom={100} />

        {/* Persistent Sticky Footer exactly like screenshot */}
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
            {/* <TouchableOpacity
              style={styles.footerBagIcon}
              onPress={() => navigation?.navigate(DEALS48_ROUTES.CART)}
            >
              <MaterialCommunityIcons
                name="shopping-outline"
                size={22}
                color="#F25000"
              />
            </TouchableOpacity> */}

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
                      //paddingHorizontal: 16,
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

export default ProductDetails;
