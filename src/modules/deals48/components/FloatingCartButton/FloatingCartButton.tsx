import { DEALS48_ROUTES } from '../../navigation/routes';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import LinearGradient from 'react-native-linear-gradient';
import FallbackImage from '../FallbackImage';

interface FloatingCartButtonProps {
  bottom?: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ bottom }) => {
  const navigation = useNavigation<any>();
  const { cartCount, cartItems = [] } = useCart();

  if (cartCount <= 0) {
    return null;
  }

  // Get the most recently added items to show their images (max 3)
  const displayItems = [...cartItems].slice(-3).reverse();
  const fallbackImage = require('../../assets/images/logos/noimage.png');

  return (
    <View style={[styles.outerContainer, bottom !== undefined && { bottom }]}>
      <LinearGradient
        colors={['#F25000', '#FF6A00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <TouchableOpacity
          style={styles.touchableArea}
          onPress={() => navigation.navigate(DEALS48_ROUTES.CART)}
          activeOpacity={0.8}
        >
          <View style={styles.imagesWrapper}>
            {displayItems.map((item, index) => (
              <View
                key={item.cartItemId || `${item.productId}-${index}`}
                style={[
                  styles.imageContainer,
                  { zIndex: 10 - index },
                  index > 0 && { marginLeft: -22 },
                ]}
              >
                <FallbackImage
                  source={
                    item?.productImage
                      ? { uri: item.productImage }
                      : fallbackImage
                  }
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.itemsCountText} numberOfLines={1}>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.viewCartText} numberOfLines={1}>
              View Cart
            </Text>
          </View>

          <View style={styles.arrowContainer}>
            <AppIcons.ChevronRight size={20} color={colors.themeWhite} />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    zIndex: 9999,
    maxWidth: '90%',
    minWidth: 200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gradientContainer: {
    borderRadius: 50,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  imagesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  imageContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.themeWhite,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.themeWhite,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  viewCartText: {
    color: colors.themeWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsCountText: {
    color: colors.themeWhite,
    fontSize: 12,
    opacity: 0.9,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default FloatingCartButton;
