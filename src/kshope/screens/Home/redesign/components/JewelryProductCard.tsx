import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductTile } from '../content';
import { HOME_FONTS, s, fs } from '../theme';

interface JewelryProductCardProps {
  item: ProductTile;
  width: number;
  isWishlisted?: boolean;
  compact?: boolean;
  onPress?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
}

const JewelryProductCard: React.FC<JewelryProductCardProps> = ({
  item,
  width,
  isWishlisted = false,
  compact = false,
  onPress,
  onToggleWishlist,
}) => {
  const displayPrice = React.useMemo(() => {
    if (!item.price) return '₹ —';
    const clean = item.price.replace(/[^\d]/g, '');
    const num = Number(clean);
    if (!Number.isNaN(num) && num > 0) {
      return `₹ ${num.toLocaleString('en-IN')}`;
    }
    return item.price.replace('/-', '').replace('₹', '₹ ');
  }, [item.price]);

  const displaySubtitle =
    item.subtitle ||
    item.raw?.metalType ||
    item.raw?.goldType ||
    item.raw?.purity ||
    item.raw?.catName ||
    '18k Gold • Diamond';

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      {/* Product Image Box */}
      <View style={[styles.imageContainer, { height: compact ? width * 0.9 : width }]}>
        <TouchableOpacity
          style={styles.heartButton}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => onToggleWishlist?.(item)}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={compact ? 14 : 16}
            color={isWishlisted ? '#C45A5A' : '#767676'}
          />
        </TouchableOpacity>

        {item.image ? (
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="diamond-outline" size={24} color="#C5A869" />
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.body}>
        <Text style={[styles.name, compact && styles.compactName]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]} numberOfLines={1}>
          {displaySubtitle}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, compact && styles.compactPrice]} numberOfLines={1}>
            {displayPrice}
          </Text>

          {!compact && (
            <View style={styles.certifiedBadge}>
              <Ionicons name="diamond" size={8} color="#0C382E" />
              <Text style={styles.certifiedText}>Certified</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(10),
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderRadius: s(10),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EFE8DE',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    position: 'absolute',
    top: s(6),
    right: s(6),
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: s(12),
    padding: s(3),
  },
  body: {
    paddingTop: s(6),
    paddingBottom: s(4),
  },
  name: {
    fontSize: fs(11),
    fontFamily: HOME_FONTS.semiBold,
    color: '#1A1A1A',
    lineHeight: fs(14),
  },
  subtitle: {
    fontSize: fs(8.5),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    marginTop: 1,
    marginBottom: s(4),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: fs(11),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  certifiedText: {
    fontSize: fs(7.8),
    fontFamily: HOME_FONTS.medium,
    color: '#0C382E',
  },
  compactName: {
    fontSize: fs(9.5),
  },
  compactSubtitle: {
    fontSize: fs(7.8),
    marginBottom: s(2),
  },
  compactPrice: {
    fontSize: fs(9.5),
  },
});

export default JewelryProductCard;
