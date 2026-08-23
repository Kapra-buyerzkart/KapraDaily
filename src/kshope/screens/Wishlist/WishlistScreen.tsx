import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppIcons } from '../../assets/icons';
import ExploreItem from '../../components/ExploreItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, fontColors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  addToCartApi,
  removeFromCartApi,
} from '../../api/services/cartService';
import FloatingCartButton from '../../components/FloatingCartButton';
import ConfirmationModal from '../../components/ConfirmationModal';

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { wishlistItems, loadWishlist, isLoading, toggleWishlist } =
    useWishlist();
  const { cartItems, cartSummary, loadCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<any>(null);

  const handleCartToggle = async (item: any) => {
    const productId = item.productId || item.id;
    const existingCartItem = cartItems.find(c => c.productId === productId);

    try {
      if (existingCartItem) {
        await removeFromCartApi(
          existingCartItem.cartItemId,
          cartSummary?.cartVersion,
          productId,
        );
      } else {
        await addToCartApi(productId, 1);
      }
      await loadCart();
    } catch (error) {
      console.error('Error toggling cart item:', error);
      Alert.alert('Error', 'Failed to update cart. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcons.ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => navigation.navigate('KshopeCart')}
        >
          <Image
            source={require('../../assets/images/bottomtab/cart.png')}
            style={{ width: wp(8.5), height: wp(8.5) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {wishlistItems.length > 0 && (
        <Image
          source={require('../../assets/images/nomorewishlist.png')}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />
      )}
    </View>
  );

  if (isLoading && wishlistItems.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.mainContainer,
          {
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        {renderHeader()}
        <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.themeBg} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      {renderHeader()}

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/images/nowish.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}> Oops! No wishlist</Text>
        </View>
      ) : (
        <View style={{ backgroundColor: colors.wishlistbg, flex: 1 }}>
          <FlatList
            data={wishlistItems}
            renderItem={({ item }) => (
              <ExploreItem
                item={item}
                onPress={() =>
                  navigation.navigate('KshopeProductDetails', {
                    productId: item.productId || item.id,
                    product: item,
                  })
                }
                toggleWishlist={() => setItemToRemove(item)}
                isInWishlist={() => true}
                style={{
                  width: wp('29.3%'),
                  marginHorizontal: wp('0.5%'),
                  marginBottom: hp('1.5%'),
                  contentContainer: { padding: 6 },
                  image: { height: 80 },
                  caption: { fontSize: 9, height: 28 },
                  pricePill: {
                    minWidth: 45,
                    height: 20,
                    borderRadius: 6,
                    paddingHorizontal: 4,
                  },
                  pricePillText: { fontSize: 10 },
                  originalPriceText: { fontSize: 7 },
                }}
              />
            )}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <FloatingCartButton />
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
        themeColor={colors.themeTeal}
      />
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontFamily: Fonts.gilroyBold,
    color: fontColors.titleBlack,
    marginLeft: wp('4%'),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: wp('4%'),
  },
  cartIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: colors.themeTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('4%'),
  },
  listContent: {
    padding: wp('2%'),
    paddingBottom: hp('10%'),
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('10%'),
    position: 'relative',
  },
  heartOutlineWrapper: {
    position: 'absolute',
    opacity: 0.3,
  },
  noMoreWishlistText: {
    fontSize: wp('3.8%'),
    fontFamily: Fonts.gilroyBold,
    color: '#B2EBF2',
    textAlign: 'center',
    letterSpacing: 1,
  },
  heartOutlineLarge: {
    width: wp('30%'),
    height: wp('20%'),
    tintColor: '#B2EBF2',
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: -hp('25%'),
  },
  emptyImage: {
    width: wp('60%'),
    height: hp('30%'),
    resizeMode: 'contain',
  },
  toggleButton: {
    position: 'absolute',
    top: hp('10%'),
    right: wp('4%'),
    backgroundColor: colors.themeTeal,
    padding: wp('2%'),
    borderRadius: wp('2%'),
    zIndex: 1000,
  },
  toggleButtonText: {
    color: colors.white,
    fontSize: wp('3%'),
    fontFamily: Fonts.gilroyBold,
  },
  emptyText: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.gilroyBold,
    color: fontColors.titleBlack,
    fontWeight: 'bold',
  },
  cartGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
  },
});
