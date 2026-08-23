import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcons } from '../assets/icons';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import FallbackImage from './FallbackImage';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  quantity: number;
  image: string;
}

interface CartItemCardProps {
  item: CartItem;
  onDelete?: (id: string) => void;
  onIncrement?: (id: string) => void;
  onDecrement?: (id: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onDelete,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTopRow}>
        <View style={styles.imageContainer}>
          <FallbackImage
            source={
              item.image
                ? { uri: item.image }
                : require('../assets/images/logos/noimage.png')
            }
            style={styles.itemImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete?.(item.id)}
          >
            <AppIcons.Delete color={'red'} size={14} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.variantRowContainer} />

          <Text style={styles.mrpText}>
            MRP{' '}
            <Text style={{ textDecorationLine: 'line-through' }}>
              ₹{item.originalPrice.toFixed(2)}
            </Text>
          </Text>

          <View style={styles.priceQtyRow}>
            <Text style={styles.priceText}>
              <Text style={styles.rupeeSign}>₹</Text>
              {item.price.toFixed(2)}
            </Text>

            <View style={styles.quantitySelector}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onDecrement?.(item.id)}
              >
                <LinearGradient
                  colors={['#F25000', '#FF6A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.qtyBtn}
                >
                  <AppIcons.Back color={colors.white} size={14} />
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.qtyText}>
                {String(item.quantity).padStart(2, '0')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onIncrement?.(item.id)}
              >
                <LinearGradient
                  colors={['#F25000', '#FF6A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.qtyBtn}
                >
                  <AppIcons.Forward color={colors.white} size={14} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    itemCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemTopRow: {
        flexDirection: 'row',
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    deleteButton: {
        position: 'absolute',
        top: -6,
        left: -6,
        backgroundColor: colors.white,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
        lineHeight: 18,
    },
    variantRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    variantRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variantLabel: {
        fontSize: 12,
        color: '#999999',
        fontFamily: Fonts.gilroyMedium,
    },
    variantValue: {
        fontSize: 12,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
    },
    colorCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    mrpText: {
        fontSize: 10,
        color: '#999999',
        fontFamily: Fonts.gilroyMedium,
        marginTop: 6,
    },
    priceQtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    priceText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
    },
    rupeeSign: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        paddingHorizontal: 12,
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
});

export default CartItemCard;
