import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppIcons } from '../assets/icons';
import { colors, fontColors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { useWishlist } from '../context/WishlistContext';
import CONFIG from '../globals/config';

interface ProductCardProps {
  item?: any;
  title?: string;
  image?: any;
  price?: string | number;
  mrp?: string | number;
  discount?: string | number;
  rating?: number;
  isWishlisted?: boolean;
  isInCart?: boolean;
  onWishlistPress?: () => void;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  title,
  image,
  price,
  mrp,
  discount,
  rating = 0,
  isWishlisted: isWishlistedProp,
  isInCart = false,
  onWishlistPress,
  onAddToCart,
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const displayTitle =
    item?.prName || item?.productName || item?.title || title || '';
  const displayPrice = item?.specialPrice || item?.price || price || 0;
  const displayMrp = item?.unitPrice || item?.mrp || mrp;
  const displayDiscount =
    item?.discountPercent?.toFixed(1) || item?.discount?.toFixed(1) || discount;
  const displayRating = item?.rating || rating || 0;
  const productId = item?.productId || item?.id;
  const isWishlisted =
    isWishlistedProp !== undefined ? isWishlistedProp : isInWishlist(productId);

  const getImageUrl = () => {
    if (image) return image;
    const img =
      item?.featuredImage ||
      item?.productImage ||
      item?.imageUrl ||
      item?.image;
    if (!img) return require('../assets/images/logos/noimage.png');
    if (typeof img === 'string') {
      if (img.startsWith('http')) return { uri: img };
      return {
        uri: `${CONFIG.image_base_url}/${img}`.replace(/([^:]\/)\/+/g, '$1'),
      };
    }
    return img;
  };

  const handleWishlistPress = () => {
    if (onWishlistPress) {
      onWishlistPress();
    } else if (item || productId) {
      toggleWishlist(
        item || {
          id: productId,
          title: displayTitle,
          price: displayPrice,
          image: getImageUrl(),
        },
      );
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= displayRating) {
        stars.push(
          <AppIcons.Star key={i} size={12} style={{ marginLeft: wp('1%') }} />,
        );
      } else {
        stars.push(
          <AppIcons.StarOutline
            key={i}
            size={12}
            style={{ marginLeft: wp('1%') }}
          />,
        );
      }
    }
    return stars;
  };

  const [imageError, setImageError] = useState(false);
  const noImage = require('../assets/images/logos/noimage.png');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imageError ? noImage : getImageUrl()}
        style={styles.imageSection}
        imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        onError={() => setImageError(true)}
      >
        {displayDiscount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {displayDiscount.toString().includes('%')
                ? displayDiscount
                : `${displayDiscount}%`}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.wishlistIcon}
          onPress={handleWishlistPress}
          activeOpacity={0.7}
        >
          {isWishlisted ? (
            <AppIcons.BookmarkFilled color={colors.tealIconFont} size={24} />
          ) : (
            <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
          )}
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {displayTitle}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{displayPrice}</Text>
          {displayMrp && <Text style={styles.mrp}>MRP ₹{displayMrp}</Text>}
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={onAddToCart}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isInCart
                ? ['#6c757d', '#495057', '#343a40']
                : [colors.themeTeal, colors.themeDarkTeal, colors.themeDarkTeal]
            }
            start={{ x: 0.1, y: 1 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cartGradient}
          >
            <Image
              source={require('../assets/images/cart.png')}
              style={{ width: 16, height: 16 }}
              tintColor={colors.white}
              resizeMode="contain"
            />
            <Text style={styles.cartText}>{isInCart ? 'Remove' : 'Cart'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('45%'),
    height: hp('35%'),
    backgroundColor: colors.white,
    borderRadius: wp('4%'),
    margin: wp('2%'),
    borderWidth: 1,
    borderColor: '#F25000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageSection: {
    width: '100%',
    height: '50%',
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0F2F1',
  },
  discountBadge: {
    position: 'absolute',
    top: wp('2%'),
    left: wp('2%'),
    backgroundColor: colors.white,
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F25000',
  },
  discountText: {
    fontSize: wp('2.2%'),
    color: '#F25000',
    fontFamily: Fonts.gilroyBold,
  },
  wishlistIcon: {
    position: 'absolute',
    top: wp('2%'),
    right: wp('2%'),
  },
  detailsContainer: {
    height: '50%',
    padding: wp('3%'),
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.gilroyRegular,
    color: fontColors.titleBlack,
    marginBottom: hp('0.5%'),
    height: hp('4%'),
  },
  ratingContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('1%'),
    marginBottom: hp('0.5%'),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: Fonts.gilroyBold,
    color: fontColors.titleBlack,
    marginRight: wp('2%'),
    fontWeight: 'bold',
  },
  mrp: {
    fontSize: wp('2.5%'),
    fontFamily: Fonts.gilroyRegular,
    color: fontColors.themeLightGray,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    width: '100%',
    height: hp('5.5%'),
    borderRadius: wp('10%'),
    overflow: 'hidden',
  },
  cartGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('2%'),
  },
  cartIcon: {
    marginRight: wp('2%'),
  },
  cartText: {
    fontSize: wp('3.4%'),
    fontFamily: Fonts.gilroyBold,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ProductCard;
