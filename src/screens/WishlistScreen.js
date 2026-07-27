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
import { FONTS } from '../styles/typography';
import icons from '@/assets/icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getTabBarClearance } from '../animations/tabBarVisibility';
import LinearGradient from 'react-native-linear-gradient';
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
import COLORS from '@/styles/colors';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { wishlistItems, removeFromWishlist, loadWishlist, isLoading, error } =
    useWishlist();
  const { addToCart, cartItems } = useCart();
  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Drop malformed entries and de-duplicate by product so the FlatList never
  // renders ghost/duplicate cards while virtualizing during scroll.
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
      loadWishlist(true); // Force fetch to bypass standard caching
    }, [loadWishlist]), // Stability is now ensured by context memoization
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
  const renderItem = ({ item }) => {
    const mappedItem = {
      ...item,
      productId: item.productId,
      prName: item.productName || item.prName || item.name,
      // Optimistically-added items carry the product-listing image fields
      // (featuredImage/img/imageUrl), while server wishlist items use
      // productImage. Fall back across all of them so a freshly added card
      // shows its real image (shimmer -> image) instead of flashing the
      // "not found" placeholder before the server refetch lands.
      featuredImage:
        item.productImage ||
        item.featuredImage ||
        item.image ||
        item.img ||
        item.imageUrl,
      unitPrice: item.unitPrice,
      specialPrice: item.specialPrice,
      stockQty: item.stockQty,
      isAvailable: item.isAvailable,
    };

    return (
      <TokenProductCard
        item={mappedItem}
        isThreeColumn={true}
        hideToken={true}
        onToggleWishlist={() =>
          handleRemoveFromWishlist(item.productId, item.productName)
        }
        onPress={() =>
          navigation.navigate('ProductDetailsScreen', {
            productId: item.productId,
            product: mappedItem,
          })
        }
      />
    );
  };

  const renderNoitem = () => (
    <View style={styles.footerContainer}>
      <Image source={images.noWishlist} style={styles.footerImage} />
      <Text style={styles.footerText}>Your Wishlist is Empty</Text>
    </View>
  );

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View
        style={{
          paddingHorizontal: wp('4.65%'),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity hitSlop={40} onPress={() => navigation.goBack()}>
            <Image
              source={icons.backArrowNew}
              style={{
                resizeMode: 'contain',
                tintColor: '#000',
              }}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Your Wishlist</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: hp('4%'),
          alignSelf: 'center',
        }}
      >
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
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            ListEmptyComponent={!isLoading && renderNoitem}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: wp('1%'),
              paddingBottom: hp('15%'),
            }}
          />
        )}
      </View>

      {cartItems && cartItems.length > 0 && (
        <Animated.View
          style={[
            styles.floatingContainer,
            { bottom: hp('0.2%') + tabBarClearance },
            // cartAnimatedStyle,
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
    backgroundColor: COLORS.white,
  },
  header: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    alignSelf: 'center',
    fontWeight: 400,
    marginLeft: wp('4%'),
  },
  giftImage: {
    width: wp('37.9%'),
    height: hp('14%'),
    resizeMode: 'contain',
    bottom: hp('-3.8%'),
    marginRight: wp('6%'),
  },
  productListView: {
    flex: 1,
    borderTopLeftRadius: wp('9.3%'),
    borderTopRightRadius: wp('9.3%'),
    borderWidth: 1,
    borderColor: '#b6b6b6',
    backgroundColor: '#FFFFFF',
    // alignItems: "center", // Removed to allow grid layout to span correctly
    borderBottomColor: '#FFFFFF',
    paddingTop: hp('1.5%'),
  },
  newWishesContainer: {
    width: wp('27.2%'),
    height: hp('3.75%'),
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2.33%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('1.8%'),
    alignSelf: 'flex-end',
    marginRight: wp('5%'),
    marginTop: hp('0.5%'),
    marginBottom: hp('0.5%'),
  },
  newWishesHeart: {
    height: wp('4.6%'),
    width: wp('4.6%'),
  },
  newWishesText: {
    color: '#000000',
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.25%'),
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('0.7%'),
    left: 0,
    right: 0,
  },
  footerContainer: {
    flex: 1,
    // backgroundColor: 'red',

    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImage: {
    // width: wp('20%'),
    // height: wp('20%'),
    resizeMode: 'contain',
  },
  footerText: {
    color: COLORS.black,
    fontSize: 20,
    padding: 10,
    fontFamily: FONTS.gilroy.bold,
    textAlign: 'center',
    //  marginTop: hp('1%'),
  },
});
