import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from '../../utils/responsive';
import { useWishlist } from '../../context/WishlistContext';
import CONFIG from '../../globals/config';

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

  // Use values from item if provided, otherwise use individual props
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
    if (!img) return require('../../assets/images/logos/noimage.png');
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

  // Helper to render stars
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
  const noImage = require('../../assets/images/logos/noimage.png');

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

        {/* <View style={styles.ratingContainer}>{renderStars()}</View> */}

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
              source={require('../../assets/images/cart.png')}
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

export default ProductCard;
