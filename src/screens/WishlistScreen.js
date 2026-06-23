import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { useFocusEffect } from '@react-navigation/native';
import TokenProductCard from '../components/TokenProductCard';
import { LoaderContext } from '../context/loaderContext';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import SelectedProducts from '../components/SelectedProducts';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { AppContext } from '../context/appContext';

export default function WishlistScreen() {
  const navigation = useNavigation();
  const { wishlistItems, removeFromWishlist, loadWishlist, isLoading } =
    useWishlist();
  const { addToCart, cartItems } = useCart();
  const { showLoader } = useContext(LoaderContext);
  const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // ── Floating cart show/hide on scroll direction ─────────────────────────
  const lastScrollY = useSharedValue(0);
  const cartTranslateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const y = event.contentOffset.y;
      const diff = y - lastScrollY.value;
      if (y <= 10 || diff < -5) {
        cartTranslateY.value = withTiming(0, { duration: 200 });
      } else if (diff > 5) {
        cartTranslateY.value = withTiming(150, { duration: 200 });
      }
      lastScrollY.value = y;
    },
  });

  const cartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cartTranslateY.value }],
  }));

  // Refresh wishlist when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const fetchWishlist = async () => {
        if (isLoading) return; // Avoid redundant fetches if already loading

        showLoader(true);
        await loadWishlist(true); // Force fetch to bypass standard caching
        if (isMounted) {
          showLoader(false);
        }
      };
      fetchWishlist();
      return () => {
        isMounted = false;
      };
    }, [loadWishlist, showLoader]), // Stability is now ensured by context memoization
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
    // Map wishlist specific keys to standard keys used by TokenProductCard
    const mappedItem = {
      ...item,
      productId: item.productId,
      prName: item.productName,
      featuredImage: item.productImage,
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

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Image
        source={require('../assets/images/wishlistnomore.png')}
        style={styles.footerImage}
      />
      <Text style={styles.footerText}>NO MORE ITEMS</Text>
    </View>
  );
  const renderNoitem = () => (
    <View style={styles.footerContainer}>
      <Image
        source={require('../assets/images/nowish.png')}
        style={styles.footerImage}
      />
      <Text style={styles.footerText}>{'No Wish \n Items'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <LinearGradient
        colors={['#FFE7DB', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp('4.65%'),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={styles.leftArrowIcon}
                source={require('../assets/images/left_arrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.header}>Wishlist</Text>
          </View>
          <Image
            style={styles.giftImage}
            source={require('../assets/images/gift_two.png')}
          />
        </View>
      </LinearGradient>
      <View style={styles.productListView}>
        {isStoreUnavailable ? (
          <StoreUnavailable
            image={storeUnavailableData.image}
            text={storeUnavailableData.text}
            onChangeLocation={() => setIsLocationModalVisible(true)}
          />
        ) : (
          <Animated.FlatList
            data={wishlistItems}
            keyExtractor={item =>
              item.wishlistItemId?.toString() || item.productId?.toString()
            }
            renderItem={renderItem}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            ListEmptyComponent={!isLoading && renderNoitem}
            ListFooterComponent={wishlistItems?.length > 0 && renderFooter}
            contentContainerStyle={{
              paddingHorizontal: wp('1%'),
              paddingBottom: hp('15%'),
            }}
          />
        )}
      </View>

      {cartItems && cartItems.length > 0 && (
        <Animated.View style={[styles.floatingContainer, cartAnimatedStyle]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    alignSelf: 'center',
    marginLeft: wp('4%'),
  },
  leftArrowIcon: {
    width: wp('2.33%'),
    height: hp('2.04%'),
    resizeMode: 'contain',
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
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3.25%'),
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('0.7%'),
    left: 0,
    right: 0,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: hp('2%'),
    paddingBottom: hp('10%'),
    justifyContent: 'center',
  },
  footerImage: {
    width: wp('20%'),
    height: wp('20%'),
    resizeMode: 'contain',
  },
  footerText: {
    color: 'rgba(242, 80, 0, 0.3)',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: FONTS.poppins.regular,
    textAlign: 'center',
    //  marginTop: hp('1%'),
  },
});
