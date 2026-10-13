import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../styles/typography';
import icons from '@/assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabBarClearance } from '../animations/tabBarVisibility';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { useFocusEffect } from '@react-navigation/native';
import TokenProductCard from '../components/TokenProductCard';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import SelectedProducts from '../components/SelectedProducts';
import StoreUnavailable from '../components/StoreUnavailable';
import WishlistGridShimmer from '../components/WishlistGridShimmer';
import LocationModal from '../components/LocationModal';
import { AppContext } from '../context/appContext';
import images from '@/assets/images';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { wishlistItems, removeFromWishlist, loadWishlist, isLoading, error } =
    useWishlist();
  const { cartItems } = useCart();
  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const wishlistData = useMemo(() => {
    if (!Array.isArray(wishlistItems)) {
      return [];
    }
    const seen = new Set();
    return wishlistItems.filter(item => {
      const id = item?.wishlistItemId ?? item?.productId;
      if (id == null || seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  }, [wishlistItems]);

  const tabBarClearance = getTabBarClearance(insets.bottom);
  const lastScrollY = useSharedValue(0);
  const cartTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;
      if (y <= 10 || diff < -5) {
        cartTranslateY.value = withTiming(0, { duration: 200 });
      } else if (diff > 5) {
        cartTranslateY.value = withTiming(tabBarClearance, { duration: 200 });
      }
      lastScrollY.value = y;
    },
  });

  const cartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cartTranslateY.value }],
  }));

  useFocusEffect(
    React.useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  const handleRemoveFromWishlist = (productId, productName) => {
    setItemToRemove({ productId, productName });
    setConfirmationVisible(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromWishlist(itemToRemove.productId);
      setItemToRemove(null);
    }
  };

  const renderItem = ({ item, index }) => {
    const mappedItem = {
      ...item,
      productId: item.productId || item.id,
      prName: item.productName || item.prName || item.name,
      featuredImage:
        item.productImage ||
        item.featuredImage ||
        item.image ||
        item.img ||
        item.imageUrl,
      unitPrice: item.unitPrice || item.mrp || item.originalPrice,
      specialPrice: item.specialPrice || item.price || item.sellingPrice,
      stockQty: item.stockQty,
      isAvailable: item.isAvailable,
      token: item.bTokenValue ?? item.token ?? item.btokens,
      weight: item.weight || item.packSize || item.quantityDesc,
      subtitle: item.subtitle || item.subTitle || item.description || item.unit,
    };

    return (
      <TokenProductCard
        item={mappedItem}
        index={index}
        isThreeColumn={true}
        hideToken={false}
        isInWishlist={() => true}
        onToggleWishlist={() =>
          handleRemoveFromWishlist(mappedItem.productId, mappedItem.prName)
        }
        onPress={() =>
          navigation.navigate('ProductDetailsScreen', {
            productId: mappedItem.productId,
            product: mappedItem,
          })
        }
      />
    );
  };

  const renderNoitem = () => (
    <View style={styles.emptyContainer}>
      <Image source={icons.noProducts} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Explore products and tap the heart icon to save your favourites here.
      </Text>
    </View>
  );

  const renderListFooter = () => (
    <View style={styles.footerBottomContainer}>
      <View style={styles.footerDivider} />
      <View style={styles.footerBottomRow}>
        <Text style={styles.footerBottomText}>
          Everything you love, saved here
        </Text>
        <MaterialCommunityIcons
          name="cart-heart"
          size={22}
          color="#71717A"
          style={styles.footerBottomIcon}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Top Navigation Row: Back on left, Search & Cart on right */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={28} color="#000000" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.navigate('SearchScreen')}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              <Feather name="search" size={22} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.navigate('CartScreen')}
              activeOpacity={0.7}
              style={styles.actionButton}
            >
              <Feather name="shopping-cart" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Explore your Wishlist</Text>
          <Text style={styles.itemCountText}>
            {`${wishlistData.length} ${
              wishlistData.length === 1 ? 'item' : 'item'
            } in wish list`}
          </Text>
        </View>

        {/* Header Divider Line */}
        <View style={styles.headerDivider} />
      </View>

      {/* Products Grid */}
      <View style={styles.listContainer}>
        {isStoreUnavailable ? (
          <StoreUnavailable
            image={storeUnavailableData.image}
            text={storeUnavailableData.text}
            onChangeLocation={() => setIsLocationModalVisible(true)}
          />
        ) : isLoading && wishlistItems.length === 0 ? (
          <WishlistGridShimmer />
        ) : error && wishlistItems.length === 0 ? (
          <StoreUnavailable
            imageSource={images.noWishlist}
            text="Something went wrong while loading your wishlist. Please try again."
            buttonText="Retry"
            onChangeLocation={() => loadWishlist(true)}
          />
        ) : (
          <Animated.FlatList
            data={wishlistData}
            keyExtractor={(item, index) =>
              (
                item.wishlistItemId ??
                item.productId ??
                `wishlist-${index}`
              ).toString()
            }
            renderItem={renderItem}
            numColumns={3}
            key={3}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            ListEmptyComponent={!isLoading && renderNoitem}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: hp('14%') + tabBarClearance },
            ]}
            columnWrapperStyle={styles.columnWrapper}
            ListFooterComponent={wishlistData.length > 0 ? renderListFooter : null}
            ListFooterComponentStyle={styles.listFooterWrapper}
          />
        )}
      </View>

      {cartItems && cartItems.length > 0 && (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.floatingContainer,
            { bottom: hp('0.2%') + tabBarClearance },
            cartAnimatedStyle,
          ]}
        >
          <SelectedProducts selectedProducts={cartItems} />
        </Animated.View>
      )}

      <ConfirmationModal
        visible={confirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        onConfirm={confirmRemove}
        title="Remove from Wishlist"
        message={
          itemToRemove
            ? `Are you sure you want to remove "${itemToRemove.productName}" from your wishlist?`
            : ''
        }
      />
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3.5%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('0.5%'),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
  },
  actionButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('0.4%'),
    paddingBottom: hp('1.4%'),
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.8%'),
    color: '#000000',
    letterSpacing: -0.3,
  },
  itemCountText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#71717A',
    marginTop: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: wp('2.5%'),
    paddingTop: hp('1.5%'),
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  listFooterWrapper: {
    marginTop: 'auto',
  },
  footerBottomContainer: {
    width: '100%',
    marginTop: hp('4%'),
    marginBottom: hp('1.5%'),
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: -wp('2.5%'),
    marginBottom: hp('2%'),
  },
  footerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottomText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.4%'),
    color: '#71717A',
  },
  footerBottomIcon: {
    marginLeft: 6,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('0.7%'),
    left: 0,
    right: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('12%'),
  },
  emptyImage: {
    width: wp('45%'),
    height: wp('45%'),
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  emptyTitle: {
    color: '#000000',
    fontSize: wp('4.8%'),
    fontFamily: FONTS.gilroy.bold,
    textAlign: 'center',
    marginBottom: hp('0.8%'),
  },
  emptySubtitle: {
    color: '#8E8E93',
    fontSize: wp('3.5%'),
    fontFamily: FONTS.gilroy.regular,
    textAlign: 'center',
    paddingHorizontal: wp('10%'),
  },
});

