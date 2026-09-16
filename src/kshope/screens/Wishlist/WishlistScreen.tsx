import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { AppIcons } from '../../assets/icons';
import { mapProductTile, tokensOf } from '../Home/redesign/data/mappers';
import { ProductImage } from '../Home/redesign/parts';
import { getHomepageData } from '../../api/services/homeService';
import { getKshopeAreaId } from '../../globals/storage';
import { Fonts } from '../../theme/fonts';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  hitSlopTo,
  hp,
  wp,
  pt,
} from '../../theme/tokens';

/* ───────── design constants ───────── */

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_W = Math.floor((SCREEN_W - 16 * 2 - CARD_GAP) / 2);
const CATEGORY_SIZE = wp('15%');

const COLORS = {
  darkGreen: '#1B4332',
  darkGreenSoft: '#2D6A4F',
  cream: '#F5F0E8',
  creamDark: '#EDE5D8',
  gold: '#C8A96E',
  goldLight: '#E8D5B0',
  bg: '#FFFFFF',
  textDark: '#1A1A1A',
  textBody: '#4A4A4A',
  textMuted: '#7A7A7A',
  textFaint: '#A0A0A0',
  border: 'rgba(0,0,0,0.06)',
  heartRed: '#C45A5A',
  overlay: 'rgba(0,0,0,0.03)',
};

/* ───────── static category data ───────── */

const WISHLIST_CATEGORIES = [
  { id: 'rings', label: 'Rings' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'pendants', label: 'Pendants' },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'bangles', label: 'Bangles' },
];

const OVERLAY_LABELS = [
  'FOR YOUR\nFOREVER',
  'ELEGANCE\nIN EVERY DETAIL',
  'TIMELESS\nBEAUTY',
  'CRAFTED\nWITH LOVE',
  'PURE\nRADIANCE',
  'ETERNAL\nSPARKLE',
];

/* ───────── component ───────── */

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { wishlistItems, loadWishlist, isLoading, toggleWishlist } =
    useWishlist();
  const { cartCount } = useCart();
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [categoryImages, setCategoryImages] = useState<Record<string, any>>({});

  useFocusEffect(
    useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  /* fetch suggested products & category images from home data */
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        const storedAreaId = await getKshopeAreaId();
        const data = await getHomepageData(storedAreaId, 20);
        const payload = data?.data || data;

        // Extract some products for "Curated Suggestions"
        const firstBlock = payload?.firstProductBlock;
        const products = Array.isArray(firstBlock?.products)
          ? firstBlock.products
          : Array.isArray(firstBlock?.Products)
          ? firstBlock.Products
          : [];
        const thirdBlock = payload?.thirdProductBlock;
        const thirdProducts = Array.isArray(thirdBlock?.products)
          ? thirdBlock.products
          : Array.isArray(thirdBlock?.Products)
          ? thirdBlock.Products
          : [];
        const combined = [...products, ...thirdProducts].slice(0, 6);
        setSuggestedProducts(combined.map(mapProductTile));

        // Extract category images from showcaseSlider or featuredCategories
        const showcase = payload?.showcaseSlider || [];
        const imgMap: Record<string, any> = {};
        showcase.forEach((cat: any) => {
          const name = (
            cat?.categoryName ||
            cat?.CategoryName ||
            cat?.name ||
            cat?.Name ||
            ''
          ).toLowerCase();
          const imageUrl = cat?.imageUrl || cat?.ImageUrl || cat?.image;
          if (name && imageUrl) {
            WISHLIST_CATEGORIES.forEach(wc => {
              if (name.includes(wc.id.slice(0, -1)) || name.includes(wc.label.toLowerCase())) {
                imgMap[wc.id] =
                  typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl;
              }
            });
          }
        });
        setCategoryImages(imgMap);
      } catch {
        // Fail silently
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);

  const cards = useMemo(
    () => wishlistItems.map((item, index) => mapProductTile(item, index)),
    [wishlistItems],
  );

  /* ─── navigation helpers ─── */

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('HomeScreen');
  };

  const openProduct = (card: any) => {
    const product = card.raw;
    navigation.navigate('KshopeProductDetails', {
      productId: product?.productId ?? product?.id ?? card.id,
      product,
    });
  };

  const openSearch = (params?: object) =>
    navigation.navigate('KshopeSearch', params);

  const openCart = () => navigation.navigate('KshopeCart');

  const openCategory = (cat: (typeof WISHLIST_CATEGORIES)[0]) => {
    openSearch({ query: cat.label, catName: cat.label });
  };

  /* ─── header ─── */

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={goBack}
        style={styles.headerBackButton}
        hitSlop={hitSlopTo(28)}
      >
        <AppIcons.Back color={COLORS.textDark} size={22} />
      </TouchableOpacity>

      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => openSearch()}
          hitSlop={hitSlopTo(28)}
          style={styles.headerIconWrap}
        >
          <Ionicons name="search-outline" size={22} color={COLORS.textDark} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('WishlistScreen')}
          hitSlop={hitSlopTo(28)}
          style={styles.headerIconWrap}
        >
          <Ionicons name="heart-outline" size={22} color={COLORS.textDark} />
          {cards.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {cards.length > 99 ? '99+' : cards.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openCart}
          hitSlop={hitSlopTo(28)}
          style={styles.headerIconWrap}
        >
          <Ionicons
            name="bag-outline"
            size={22}
            color={COLORS.textDark}
          />
          {cartCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ─── title section ─── */

  const renderTitleSection = () => (
    <View style={styles.titleSection}>
      <Text style={styles.titleText}>My Wishlist</Text>
      <Text style={styles.subtitleText}>
        {'BEAUTIFUL THINGS\nALWAYS BELONG WITH YOU'}
      </Text>
      <View style={styles.titleDivider} />
    </View>
  );

  /* ─── empty state ─── */

  const renderEmptyState = () => (
    <View style={styles.emptyCard}>
      {/* Heart circle with sparkle */}
      <View style={styles.emptyIconWrap}>
        <View style={styles.emptyCircle}>
          <Ionicons name="heart-outline" size={32} color={COLORS.gold} />
        </View>
        <View style={styles.sparkle}>
          <Text style={styles.sparkleText}>✦</Text>
        </View>
      </View>

      <Text style={styles.emptyTitle}>
        {'Your Wishlist Awaits Its First\nSparkle'}
      </Text>

      <Text style={styles.emptyBody}>
        {
          'Save the timeless designs that speak directly\nto your heart. Tap the heart icon on any high\njewellery creation to craft your personal\nheirloom collection here.'
        }
      </Text>

      {/* CTA buttons */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openSearch()}
        style={styles.ctaPrimary}
      >
        <Text style={styles.ctaPrimaryIcon}>✦</Text>
        <Text style={styles.ctaPrimaryText}>EXPLORE HIGH JEWELLERY</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openSearch()}
        style={styles.ctaOutline}
      >
        <Text style={styles.ctaOutlineText}>Book a Private Store Visit</Text>
      </TouchableOpacity>
    </View>
  );

  /* ─── you may also love ─── */

  const renderCategoryRow = () => (
    <View style={styles.categorySection}>
      <View style={styles.categorySectionHeader}>
        <Text style={styles.categorySectionTitle}>You may also love</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openSearch()}
        >
          <Text style={styles.categorySectionLink}>
            MORE JEWELLERY TO ADORE{' '}
            <Text style={styles.categorySectionChevron}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {WISHLIST_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => openCategory(cat)}
            style={styles.categoryItem}
          >
            <View style={styles.categoryCirlce}>
              {categoryImages[cat.id] ? (
                <Image
                  source={categoryImages[cat.id]}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.categoryPlaceholder}>
                  <MaterialCommunityIcons
                    name="diamond-stone"
                    size={24}
                    color={COLORS.gold}
                  />
                </View>
              )}
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  /* ─── curated suggestions ─── */

  const renderSuggestedCard = ({ item, index }: { item: any; index: number }) => {
    const overlayLabel = OVERLAY_LABELS[index % OVERLAY_LABELS.length];
    const detail = item.raw?.weight
      ? `${item.raw.metalType || '18K Gold'} · ${item.raw.weight}`
      : item.raw?.metalType || '';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openProduct(item)}
        style={styles.suggestedCard}
      >
        <View style={styles.suggestedImageWrap}>
          <ProductImage source={item.image} style={styles.suggestedImage} />

          {/* Overlay badge */}
          <View style={styles.overlayBadge}>
            <Text style={styles.overlayBadgeText}>{overlayLabel}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (item.raw) {
                toggleWishlist(item.raw);
              }
            }}
            hitSlop={hitSlopTo(28)}
            style={styles.suggestedHeart}
          >
            <Ionicons
              name="heart-outline"
              size={18}
              color={COLORS.heartRed}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.suggestedBody}>
          {item.brand ? (
            <Text style={styles.suggestedBrand} numberOfLines={1}>
              {item.brand}
            </Text>
          ) : null}
          <Text style={styles.suggestedName} numberOfLines={1}>
            {item.name}
          </Text>
          {detail ? (
            <Text style={styles.suggestedDetail} numberOfLines={1}>
              {detail}
            </Text>
          ) : null}
          <Text style={styles.suggestedPrice}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCuratedSuggestions = () => {
    if (suggestedProducts.length === 0 && !loadingSuggestions) {
      return null;
    }

    return (
      <View style={styles.suggestedSection}>
        <View style={styles.suggestedSectionHeader}>
          <Text style={styles.suggestedSectionTitle}>Curated Suggestions</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => openSearch()}>
            <Text style={styles.suggestedSectionLink}>Popular Icons</Text>
          </TouchableOpacity>
        </View>

        {loadingSuggestions ? (
          <ActivityIndicator
            size="small"
            color={COLORS.darkGreen}
            style={{ marginVertical: 24 }}
          />
        ) : (
          <FlatList
            data={suggestedProducts}
            renderItem={renderSuggestedCard}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.suggestedColumn}
            scrollEnabled={false}
            contentContainerStyle={styles.suggestedList}
          />
        )}
      </View>
    );
  };

  /* ─── wishlist items grid card ─── */

  const renderWishlistCard = ({ item, index }: { item: any; index: number }) => {
    const tokens = item.tokens || tokensOf(item.raw);
    const detail = item.raw?.weight
      ? `${item.raw.metalType || '18K Gold'} · ${item.raw.weight}`
      : item.raw?.metalType || '';
    const overlayLabel = OVERLAY_LABELS[index % OVERLAY_LABELS.length];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openProduct(item)}
        style={styles.wishlistCard}
      >
        <View style={styles.wishlistImageWrap}>
          <ProductImage source={item.image} style={styles.wishlistImage} />

          {/* Overlay badge */}
          <View style={styles.overlayBadge}>
            <Text style={styles.overlayBadgeText}>{overlayLabel}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setItemToRemove(item.raw)}
            hitSlop={hitSlopTo(28)}
            style={styles.wishlistHeart}
          >
            <Ionicons name="heart" size={18} color={COLORS.heartRed} />
          </TouchableOpacity>
        </View>

        <View style={styles.wishlistBody}>
          {item.brand ? (
            <Text style={styles.wishlistBrand} numberOfLines={1}>
              {item.brand}
            </Text>
          ) : null}
          <Text style={styles.wishlistName} numberOfLines={1}>
            {item.name}
          </Text>
          {detail ? (
            <Text style={styles.wishlistDetail} numberOfLines={1}>
              {detail}
            </Text>
          ) : null}
          <Text style={styles.wishlistPrice}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* ─── wishlist items grid ─── */

  const renderWishlistGrid = () => (
    <View style={styles.wishlistGridSection}>
      <FlatList
        data={cards}
        renderItem={renderWishlistCard}
        keyExtractor={card => String(card.id)}
        numColumns={2}
        columnWrapperStyle={styles.suggestedColumn}
        scrollEnabled={false}
        contentContainerStyle={styles.suggestedList}
      />
    </View>
  );

  /* ─── bottom action bar ─── */

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openSearch()}
        style={styles.bottomBtnLeft}
      >
        <Text style={styles.bottomBtnLeftIcon}>✦</Text>
        <Text style={styles.bottomBtnLeftText}>
          {'Find Similar\nPieces'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openCart}
        style={styles.bottomBtnRight}
      >
        <Ionicons name="bag-outline" size={18} color="#FFFFFF" />
        <Text style={styles.bottomBtnRightText}>
          {`Move All to Bag\n(${cards.length})`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  /* ─── loading state ─── */

  if (isLoading && cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {isFocused ? (
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
        ) : null}
        {renderHeader()}
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={COLORS.darkGreen} />
        </View>
      </SafeAreaView>
    );
  }

  /* ─── main render ─── */

  return (
    <SafeAreaView style={styles.container}>
      {isFocused ? (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      ) : null}

      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTitleSection()}

        {cards.length === 0 ? renderEmptyState() : renderWishlistGrid()}

        {renderCategoryRow()}

        {renderCuratedSuggestions()}

        {renderBottomBar()}
      </ScrollView>

      <ConfirmationModal
        visible={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            toggleWishlist(itemToRemove);
            setItemToRemove(null);
          }
        }}
        title="Remove Item"
        message="Are you sure you want to remove this item from your wishlist?"
        confirmText="Remove"
        themeColor={COLORS.darkGreen}
      />
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  /* ── layout ── */
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: hp('4%'),
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerIconWrap: {
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: 10,
    lineHeight: 13,
    color: '#FFFFFF',
  },

  /* ── title section ── */
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  titleText: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: pt(34),
    lineHeight: pt(40),
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9),
    lineHeight: pt(14),
    color: COLORS.textMuted,
    letterSpacing: 2.5,
    marginTop: 4,
  },
  titleDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginTop: 16,
  },

  /* ── empty state card ── */
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  emptyIconWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleText: {
    fontSize: 14,
    color: COLORS.gold,
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(22),
    lineHeight: pt(28),
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyBody: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(13),
    lineHeight: pt(20),
    color: COLORS.textBody,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.darkGreen,
    marginBottom: 12,
  },
  ctaPrimaryIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  ctaPrimaryText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    lineHeight: pt(16),
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  ctaOutline: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaOutlineText: {
    fontFamily: Fonts.cormorantGaramond.medium,
    fontSize: pt(15),
    lineHeight: pt(20),
    color: COLORS.textDark,
  },

  /* ── category row ── */
  categorySection: {
    marginTop: 32,
    paddingBottom: 8,
  },
  categorySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categorySectionTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(18),
    lineHeight: pt(24),
    color: COLORS.textDark,
  },
  categorySectionLink: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(8),
    lineHeight: pt(12),
    color: COLORS.textMuted,
    letterSpacing: 1.8,
  },
  categorySectionChevron: {
    fontSize: pt(11),
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 20,
  },
  categoryItem: {
    alignItems: 'center',
    width: CATEGORY_SIZE,
  },
  categoryCirlce: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: CATEGORY_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontFamily: Fonts.cormorantGaramond.medium,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: COLORS.textDark,
    marginTop: 6,
    textAlign: 'center',
  },

  /* ── curated suggestions / shared card grid ── */
  suggestedSection: {
    marginTop: 24,
  },
  suggestedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  suggestedSectionTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(18),
    lineHeight: pt(24),
    color: COLORS.textDark,
  },
  suggestedSectionLink: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(12),
    lineHeight: pt(16),
    color: COLORS.darkGreenSoft,
  },
  suggestedList: {
    paddingHorizontal: 16,
  },
  suggestedColumn: {
    justifyContent: 'flex-start',
    columnGap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  suggestedCard: {
    width: CARD_W,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
    ...UI_ELEVATION.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  suggestedImageWrap: {
    width: '100%',
    height: CARD_W,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
  },
  suggestedImage: {
    width: '100%',
    height: '100%',
  },
  suggestedHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...UI_ELEVATION.card,
  },
  overlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(27,67,50,0.75)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  overlayBadgeText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(7),
    lineHeight: pt(10),
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  suggestedBody: {
    padding: 12,
    gap: 2,
  },
  suggestedBrand: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(14),
    lineHeight: pt(18),
    color: COLORS.textDark,
  },
  suggestedName: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: COLORS.textMuted,
  },
  suggestedDetail: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9),
    lineHeight: pt(13),
    color: COLORS.textFaint,
  },
  suggestedPrice: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(13),
    lineHeight: pt(18),
    color: COLORS.textDark,
    marginTop: 4,
  },

  /* ── wishlist items grid ── */
  wishlistGridSection: {
    marginTop: 16,
  },
  wishlistCard: {
    width: CARD_W,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
    ...UI_ELEVATION.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  wishlistImageWrap: {
    width: '100%',
    height: CARD_W,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
  },
  wishlistImage: {
    width: '100%',
    height: '100%',
  },
  wishlistHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...UI_ELEVATION.card,
  },
  wishlistBody: {
    padding: 12,
    gap: 2,
  },
  wishlistBrand: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(14),
    lineHeight: pt(18),
    color: COLORS.textDark,
  },
  wishlistName: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: COLORS.textMuted,
  },
  wishlistDetail: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9),
    lineHeight: pt(13),
    color: COLORS.textFaint,
  },
  wishlistPrice: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(13),
    lineHeight: pt(18),
    color: COLORS.textDark,
    marginTop: 4,
  },

  /* ── bottom action bar ── */
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  bottomBtnLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.darkGreen,
  },
  bottomBtnLeftIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  bottomBtnLeftText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomBtnRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.darkGreenSoft,
  },
  bottomBtnRightText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    lineHeight: pt(15),
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default WishlistScreen;
