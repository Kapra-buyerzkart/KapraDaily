import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcons } from '../../assets/icons';
import { colors } from '../../assets/theme/colours';
import { cartItemCardStyles as styles } from './styles';
import FallbackImage from '../FallbackImage';

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
      {/* Top: Image + Details */}
      <View style={styles.itemTopRow}>
        <View style={styles.imageContainer}>
          <FallbackImage
            source={
              item.image
                ? { uri: item.image }
                : require('../../assets/images/logos/noimage.png')
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

export default CartItemCard;
