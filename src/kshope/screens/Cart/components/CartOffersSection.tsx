import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';
import { resolveImageSource } from '../../Home/redesign/data/mappers';

export const getOfferProductImage = (item: any) => {
  if (!item) return null;
  const raw =
    item?.featuredImage ??
    item?.FeaturedImage ??
    item?.productImage ??
    item?.ProductImage ??
    item?.imageUrl ??
    item?.ImageUrl ??
    item?.imagePath ??
    item?.ImagePath ??
    item?.thumbnail ??
    item?.Thumbnail ??
    item?.image ??
    item?.Image ??
    item?.raw?.featuredImage ??
    item?.raw?.productImage ??
    item?.raw?.imageUrl ??
    item?.raw?.image ??
    (Array.isArray(item?.images) ? item.images[0] : null) ??
    (Array.isArray(item?.productImages) ? item.productImages[0] : null);

  const resolved = resolveImageSource(raw);
  // STRICT: Only accept remote API images with an http(s) uri string. Never dummy bundle assets.
  if (
    resolved &&
    typeof resolved === 'object' &&
    typeof resolved.uri === 'string' &&
    resolved.uri.trim().startsWith('http')
  ) {
    return resolved;
  }
  return null;
};

type Props = {
  products: any[];
  isInWishlist: (id: string | number) => boolean;
  onToggleWishlist: (product: any) => void;
  onSelectProduct: (product: any) => void;
  onViewAll: () => void;
};

export const CartOffersSection: React.FC<Props> = ({
  products,
  isInWishlist,
  onToggleWishlist,
  onSelectProduct,
  onViewAll,
}) => {
  // STRICT: Only display products that have valid live API images. NO dummy images.
  const validProducts = (products || []).filter(item => {
    const src = getOfferProductImage(item);
    return !!src && typeof src.uri === 'string' && src.uri.startsWith('http');
  });

  if (validProducts.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: any; index: number }) => {
    const id = item.productId || item.id || item.prId;
    const wishlisted = isInWishlist(id);
    const imageSource = getOfferProductImage(item);

    if (!imageSource || !imageSource.uri) {
      return null;
    }

    const price = Number(
      item.specialPrice || item.unitPrice || item.price || 0,
    );

    const title = item.productName || item.prName || item.name || '';

    const purity =
      item.purity ||
      item.goldPurity ||
      item.metalPurity ||
      (item.goldType ? `${item.goldType} Gold` : '');
    const stone =
      item.diamondWeight ? `${item.diamondWeight} ct` :
      item.stoneWeight ? `${item.stoneWeight} ct` :
      item.weight ? `${item.weight}g` :
      item.gemstone ||
      item.stone ||
      '';
    const spec =
      [purity, stone].filter(Boolean).join(' • ') ||
      item.categoryName ||
      item.catName ||
      '';

    const badgeText = item.badge || item.collection || item.categoryName || item.catName || '';

    return (
      <TouchableOpacity
        testID={`cart-offer-card-${id}`}
        activeOpacity={0.88}
        onPress={() => onSelectProduct(item)}
        style={styles.card}
      >
        {/* Inset Product Image Container with Live API Image */}
        <View style={styles.imageBox}>
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="cover"
          />

          {/* Top-Left Tag Badge (only when tag/collection exists) */}
          {!!badgeText && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText} numberOfLines={2}>
                {badgeText.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Top-Right Circular Heart Button */}
          <TouchableOpacity
            testID={`cart-offer-heart-${id}`}
            activeOpacity={0.75}
            onPress={() => onToggleWishlist(item)}
            style={styles.heartButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={s(14)}
              color={wishlisted ? CART_COLORS.heartRed : CART_COLORS.textDark}
            />
          </TouchableOpacity>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {title}
          </Text>
          {!!spec && (
            <Text style={styles.specText} numberOfLines={1}>
              {spec}
            </Text>
          )}
          <Text style={styles.priceText}>
            ₹ {price.toLocaleString('en-IN')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Offers For You</Text>
        <TouchableOpacity
          testID="cart-offers-view-all"
          activeOpacity={0.7}
          onPress={onViewAll}
          style={styles.viewAllBtn}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={s(12)} color="#07332C" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        data={validProducts}
        keyExtractor={(item, index) => String(item.productId || item.id || index)}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: s(20),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    marginBottom: s(12),
  },
  heading: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(18),
    color: CART_COLORS.textDark,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(2),
  },
  viewAllText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12),
    color: '#07332C',
  },
  listContent: {
    paddingHorizontal: s(16),
    gap: s(12),
  },
  card: {
    width: s(186),
    backgroundColor: CART_COLORS.card,
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    padding: s(8),
  },
  imageBox: {
    width: '100%',
    height: s(115),
    borderRadius: s(10),
    overflow: 'hidden',
    backgroundColor: '#FAF8F5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: s(6),
    left: s(6),
    backgroundColor: 'rgba(0,0,0,0.38)',
    paddingHorizontal: s(6),
    paddingVertical: s(3),
    borderRadius: s(4),
  },
  tagBadgeText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(7.5),
    color: CART_COLORS.white,
    lineHeight: fs(10),
    letterSpacing: 0.3,
  },
  heartButton: {
    position: 'absolute',
    top: s(6),
    right: s(6),
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    paddingTop: s(8),
    paddingHorizontal: s(2),
  },
  productTitle: {
    fontFamily: CART_FONTS.serifSemiBold,
    fontSize: fs(14),
    color: CART_COLORS.textDark,
    lineHeight: fs(18),
  },
  specText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(10),
    color: '#7A7A7A',
    marginTop: s(2),
  },
  priceText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(14),
    color: CART_COLORS.textDark,
    marginTop: s(4),
  },
});
