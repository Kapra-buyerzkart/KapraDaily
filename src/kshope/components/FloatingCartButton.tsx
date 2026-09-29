import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { Fonts } from '../theme/fonts';
import FallbackImage from './FallbackImage';
import { cartPillSlideIn, cartPillSlideOut } from '../animations/cartItemPop';
import {
  tabBarVisibility,
  getTabBarClearance,
} from '../../animations/tabBarVisibility';

const CAPSULE_BG = '#0D5335';
const MAX_VISIBLE_THUMBNAILS = 2;

interface FloatingCartButtonProps {
  bottom?: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ bottom }) => {
  const navigation = useNavigation<any>();
  const { cartItems = [], cartSummary } = useCart();
  const insets = useSafeAreaInsets();

  const totalCount = useMemo(
    () => (cartItems || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0),
    [cartItems],
  );

  const grandTotal = useMemo(() => {
    if (cartSummary?.grandTotal !== undefined && cartSummary?.grandTotal !== null && Number(cartSummary.grandTotal) > 0) {
      return Math.round(Number(cartSummary.grandTotal));
    }
    const sum = (cartItems || []).reduce((acc: number, item: any) => {
      const p = item.specialPrice || item.price || item.unitPrice || 0;
      return acc + p * (item.quantity || 1);
    }, 0);
    return Math.round(sum);
  }, [cartSummary, cartItems]);

  const discount = Math.round(cartSummary?.totalDiscount || cartSummary?.productDiscount || 0);

  const bottomOffset =
    bottom !== undefined
      ? bottom
      : getTabBarClearance(insets.bottom) + hp('0.2%');

  const tabBarShift =
    bottom !== undefined ? 0 : getTabBarClearance(insets.bottom);

  const scrollHideStyle = useAnimatedStyle(() => {
    const progress = clamp(tabBarVisibility.value, 0, 1);
    return {
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [tabBarShift, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const previewItems = cartItems.slice(0, MAX_VISIBLE_THUMBNAILS);
  const fallbackImage = require('../assets/images/logos/noimage.png');

  const getImageSource = (item: any) => {
    const raw = item?.product || item;
    if (!raw) return fallbackImage;
    if (raw.productImage) {
      return typeof raw.productImage === 'string'
        ? { uri: raw.productImage }
        : raw.productImage;
    }
    if (raw.featuredImage) {
      return typeof raw.featuredImage === 'string'
        ? { uri: raw.featuredImage }
        : raw.featuredImage;
    }
    if (raw.imageUrl) {
      return typeof raw.imageUrl === 'string'
        ? { uri: raw.imageUrl }
        : raw.imageUrl;
    }
    if (raw.image) {
      return typeof raw.image === 'string'
        ? { uri: raw.image }
        : raw.image;
    }
    return fallbackImage;
  };

  const goToCart = () => navigation.navigate('KshopeCart');

  return (
    <Animated.View
      entering={cartPillSlideIn as any}
      exiting={cartPillSlideOut as any}
      pointerEvents="box-none"
      style={[styles.outerContainer, { bottom: bottomOffset }]}
    >
      <Animated.View style={[styles.wrapper, scrollHideStyle]} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={goToCart}
          style={styles.capsule}
        >
          {/* Left Section: Thumbnails + Count + Total */}
          <View style={styles.leftSection}>
            <View style={styles.thumbnailsContainer}>
              {previewItems.map((item: any, index: number) => (
                <View
                  key={item.cartItemId || item.productId || index}
                  style={[
                    styles.thumbnailCard,
                    index > 0 && { marginLeft: -wp('3.5%'), zIndex: index },
                  ]}
                >
                  <FallbackImage
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
            <Text style={styles.viewBasketText}>View Basket</Text>
            <Feather name="chevron-right" size={16} color={CAPSULE_BG} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
  },
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
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  savingsSubText: {
    fontSize: wp('2.8%'),
    fontFamily: Fonts.medium,
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
    fontFamily: Fonts.bold,
    color: CAPSULE_BG,
    marginRight: 2,
  },
});

export default React.memo(FloatingCartButton);
