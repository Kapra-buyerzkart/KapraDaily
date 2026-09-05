import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Animated from 'react-native-reanimated';

import { useWishlist } from '../../context/WishlistContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useCartPillScrollProps } from '../../components/cartPillScroll';
import { AppText, Badge, Divider } from '../../components/atoms';
import { AppIcons } from '../../assets/icons';
import { mapProductTile, tokensOf } from '../Home/redesign/data/mappers';
import { ProductImage, TokenBadge } from '../Home/redesign/parts';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '../../theme/tokens';
import { WISHLIST_ART } from './assets';

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = UI_SPACING.md;
const CARD_W = Math.floor((SCREEN_W - UI_SPACING.lg * 2 - CARD_GAP) / 2);

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { wishlistItems, loadWishlist, isLoading, toggleWishlist } =
    useWishlist();
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const cartPillScroll = useCartPillScrollProps();

  useFocusEffect(
    useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  const cards = useMemo(
    () => wishlistItems.map((item, index) => mapProductTile(item, index)),
    [wishlistItems],
  );

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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={goBack} style={styles.iconButton}>
        <AppIcons.Back color={UI_COLORS.textPrimary} size={22} />
      </TouchableOpacity>
      <View style={{}}>
        <AppText variant="title">Wishlist</AppText>

        {cards.length > 0 ? (
          <Badge
            tone="neutral"
            label={`${cards.length} ${cards.length === 1 ? 'item' : 'items'}`}
          />
        ) : null}
      </View>

      <View style={styles.headerSpacer} />

      <TouchableOpacity
        onPress={() => navigation.navigate('KshopeCart')}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons
          name="cart-outline"
          size={wp('5.2%')}
          color={UI_COLORS.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderCard = ({ item }: { item: any }) => {
    const tokens = item.tokens || tokensOf(item.raw);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openProduct(item)}
        style={styles.card}
      >
        <View style={styles.cardImageWrap}>
          <ProductImage source={item.image} style={styles.cardImage} />

          <TouchableOpacity
            onPress={() => setItemToRemove(item.raw)}
            hitSlop={hitSlopTo(28)}
            style={styles.heartButton}
          >
            <MaterialCommunityIcons
              name="heart"
              size={wp('4.4%')}
              color={UI_COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          {item.brand ? (
            <AppText variant="labelStrong" numberOfLines={1}>
              {item.brand}
            </AppText>
          ) : null}
          <AppText variant="caption" tone="muted" numberOfLines={1}>
            {item.name}
          </AppText>

          {tokens > 0 ? (
            <TokenBadge tokens={tokens} size={9} style={styles.tokenBadge} />
          ) : null}

          <View style={styles.priceRow}>
            <AppText variant="price">{item.price}</AppText>
            {item.mrp ? (
              <AppText variant="micro" tone="faint" style={styles.mrp}>
                {item.mrp}
              </AppText>
            ) : null}
            {item.discount ? (
              <AppText variant="microStrong" tone="muted">
                {item.discount}
              </AppText>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    if (isLoading && cards.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={UI_COLORS.primary} />
        </View>
      );
    }

    if (cards.length === 0) {
      return (
        <View style={styles.centered}>
          <Image
            source={WISHLIST_ART.emptyWishlist}
            resizeMode="contain"
            style={styles.emptyImage}
          />
          <AppText variant="heading" style={styles.emptyTitle}>
            Your Wishlist Feeling a{'\n'}
            <AppText variant="heading" tone="brand">
              Little Lonely
            </AppText>
          </AppText>
          <AppText variant="label" tone="muted" style={styles.emptySubtitle}>
            Looks like you haven’t saved anything yet.{'\n'}
            Explore and add items you love!
          </AppText>
        </View>
      );
    }

    return (
      <Animated.FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={card => String(card.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        {...cartPillScroll}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isFocused ? (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      ) : null}

      {/* <View style={styles.topContainer}> */}
      {renderHeader()}

      {/* <AddressCard
          addressType={selectedAddress?.type}
          addressLine={selectedAddress?.address}
          onChange={() => navigation.navigate('KshopeSavedAddress')}
          style={styles.addressCard}
        /> */}
      {/* </View> */}

      {renderBody()}

      <View style={styles.footer}>
        <Divider />
        <View style={styles.footerRow}>
          <MaterialCommunityIcons
            name="heart-outline"
            size={wp('4%')}
            color={UI_COLORS.textFaint}
          />
          <AppText variant="micro" tone="faint">
            Everything you love, saved here
          </AppText>
        </View>
      </View>

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
        themeColor={UI_COLORS.primary}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.card,
  },
  topContainer: {
    backgroundColor: UI_COLORS.card,
    paddingBottom: UI_SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI_COLORS.borderStrong,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
  },
  headerSpacer: {
    flex: 1,
  },
  iconButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCard: {
    backgroundColor: UI_COLORS.card,
    borderColor: UI_COLORS.borderStrong,
  },
  list: {
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.lg,
    paddingBottom: hp('4%'),
  },
  column: {
    justifyContent: 'flex-start',
    columnGap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_W,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
    overflow: 'hidden',
    ...UI_ELEVATION.card,
  },
  cardImageWrap: {
    width: '100%',
    height: CARD_W,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_COLORS.card,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: UI_SPACING.sm,
    right: UI_SPACING.sm,
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: UI_RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
  },
  cardBody: {
    gap: UI_SPACING.xs,
    padding: UI_SPACING.md,
  },
  tokenBadge: {
    marginTop: UI_SPACING.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    marginTop: UI_SPACING.xs,
  },
  mrp: {
    textDecorationLine: 'line-through',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: UI_SPACING.xl,
  },
  emptyImage: {
    width: wp('82%'),
    height: wp('84%'),
  },
  emptyTitle: {
    marginTop: UI_SPACING.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: UI_SPACING.sm,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: UI_SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    paddingTop: UI_SPACING.md,
  },
});

export default WishlistScreen;
