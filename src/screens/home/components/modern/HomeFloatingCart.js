import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import { useCart } from '@/context/CartContext';
import CONFIG from '@/globals/config';
import { cartPillSlideIn, cartPillSlideOut } from '@/animations/cartItemPop';

const CAPSULE_BG = '#0D5335';
const MAX_VISIBLE_THUMBNAILS = 2;

const HomeFloatingCart = ({
  selectedProducts,
  style,
  containerStyle,
  bottom,
  onPress,
  buttonText = 'View Basket',
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { cartItems: contextCartItems, cartSummary } = useCart();

  let isTabBarScreen = false;
  try {
    const route = useRoute();
    const name = (route && route.name) || '';
    isTabBarScreen =
      name === 'Home' ||
      name === 'HomeScreen' ||
      name === 'Categories' ||
      name === 'CategoriesScreen' ||
      name === 'Wishlist' ||
      name === 'WishlistScreen' ||
      name === 'Kshope' ||
      name === 'KshopeHome';
  } catch (e) {
    // not in navigation context
  }

  const cartItems =
    selectedProducts && selectedProducts.length > 0
      ? selectedProducts
      : contextCartItems;

  const totalCount = useMemo(
    () => (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cartItems],
  );

  const grandTotal = useMemo(() => {
    if (cartSummary && cartSummary.grandTotal !== undefined && cartSummary.grandTotal !== null && Number(cartSummary.grandTotal) > 0) {
      return Math.round(cartSummary.grandTotal);
    }
    const sum = (cartItems || []).reduce((acc, item) => {
      const p = item.specialPrice || item.price || item.unitPrice || 0;
      return acc + p * (item.quantity || 1);
    }, 0);
    return Math.round(sum);
  }, [cartSummary, cartItems]);

  const discount = Math.round(
    (cartSummary && (cartSummary.totalDiscount || cartSummary.productDiscount)) || 0,
  );

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const previewItems = cartItems.slice(0, MAX_VISIBLE_THUMBNAILS);

  const getImageSource = item => {
    const raw = (item && item.product) || item;
    if (!raw) return require('@/assets/images/udenDealNotfound.png');

    if (raw.featuredImage) {
      return typeof raw.featuredImage === 'string' && !raw.featuredImage.startsWith('http')
        ? { uri: `${CONFIG.image_base_url}${raw.featuredImage}` }
        : typeof raw.featuredImage === 'string'
        ? { uri: raw.featuredImage }
        : raw.featuredImage;
    }
    if (raw.productImage) {
      return typeof raw.productImage === 'string' && !raw.productImage.startsWith('http')
        ? { uri: `${CONFIG.image_base_url}${raw.productImage}` }
        : typeof raw.productImage === 'string'
        ? { uri: raw.productImage }
        : raw.productImage;
    }
    if (raw.imageUrl) {
      return typeof raw.imageUrl === 'string' && !raw.imageUrl.startsWith('http')
        ? { uri: `${CONFIG.image_base_url}${raw.imageUrl}` }
        : typeof raw.imageUrl === 'string'
        ? { uri: raw.imageUrl }
        : raw.imageUrl;
    }
    if (Array.isArray(raw.images) && raw.images.length > 0) {
      const first = raw.images[0];
      const imgPath = typeof first === 'string' ? first : (first && (first.image || first.url)) || '';
      if (imgPath) {
        return imgPath.startsWith('http')
          ? { uri: imgPath }
          : { uri: `${CONFIG.image_base_url}${imgPath}` };
      }
    }
    if (raw.image) {
      return typeof raw.image === 'string' && !raw.image.startsWith('http')
        ? { uri: `${CONFIG.image_base_url}${raw.image}` }
        : typeof raw.image === 'string'
        ? { uri: raw.image }
        : raw.image;
    }
    return require('@/assets/images/udenDealNotfound.png');
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('CartScreen');
    }
  };

  const safeBottomMargin =
    bottom === undefined && !isTabBarScreen && insets.bottom > 0
      ? Math.max(0, insets.bottom - hp('0.5%'))
      : 0;

  return (
    <Animated.View
      entering={cartPillSlideIn}
      exiting={cartPillSlideOut}
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        safeBottomMargin > 0 && { marginBottom: safeBottomMargin },
        bottom !== undefined && { bottom },
        containerStyle,
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={styles.capsule}
      >
        {/* Left Section: Thumbnails + Count + Total */}
        <View style={styles.leftSection}>
          <View style={styles.thumbnailsContainer}>
            {previewItems.map((item, index) => (
              <View
                key={item.productId || item.id || item.cartItemId || index}
                style={[
                  styles.thumbnailCard,
                  index > 0 && { marginLeft: -wp('3.5%'), zIndex: index },
                ]}
              >
                <Image
                  source={getImageSource(item)}
                  style={styles.thumbnailImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>

          <View style={styles.textColumn}>
            <Text style={styles.mainTotalText} numberOfLines={1}>
              {totalCount} {totalCount === 1 ? 'item' : 'items'} • ₹{grandTotal}
            </Text>
            <Text style={styles.savingsSubText} numberOfLines={1}>
              {discount > 0 ? `₹${discount} saved on order` : 'Fast delivery in 30 mins'}
            </Text>
          </View>
        </View>

        {/* Right Section: White View Basket Button */}
        <View style={styles.viewBasketPill}>
          <Text style={styles.viewBasketText}>{buttonText}</Text>
          <Feather name="chevron-right" size={16} color={CAPSULE_BG} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: wp('3.5%'),
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CAPSULE_BG,
    borderRadius: 24,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('3.5%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp('2%'),
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('2.8%'),
  },
  thumbnailCard: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  textColumn: {
    justifyContent: 'center',
  },
  mainTotalText: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
  },
  savingsSubText: {
    fontSize: wp('2.8%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#D1FAE5',
    marginTop: 1,
  },
  viewBasketPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  viewBasketText: {
    fontSize: wp('3.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: CAPSULE_BG,
    marginRight: 2,
  },
});

export default React.memo(HomeFloatingCart);
