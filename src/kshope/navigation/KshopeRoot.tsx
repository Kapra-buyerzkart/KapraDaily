import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { ensureKshopeSession } from '../api/session';
import KshopeUnavailable from '../screens/KshopeUnavailable';
import logger from '../../utils/logger';
import { LoaderContextProvider } from '../context/loaderContext';
import { AlertProvider } from '../context/AlertContext';
import { UserProvider } from '../context/UserContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
import KshopeTabs from './KshopeTabs';
import SearchScreen from '../screens/Search/SearchScreen';
import CategoryScreen from '../screens/Category/redesign/CategoryRedesignScreen';
import ProductDetailsScreen from '../screens/Product/redesign/ProductDetailsRedesignScreen';
import ProductCategoryDetailScreen from '../screens/Product/ProductCategoryDetailScreen';
import CartScreen from '../screens/Cart/CartScreen';
import OrderSuccessScreen from '../screens/Order/OrderSuccessScreen';
import OrderFailedScreen from '../screens/Order/OrderFailedScreen';
import OrderPendingScreen from '../screens/Order/OrderPendingScreen';
import MyOrderScreen from '../screens/Order/MyOrderScreen';
import MyOrderDetailsScreen from '../screens/Order/MyOrderDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import UpdateContactScreen from '../screens/Profile/UpdateContactScreen';
import UpdateContactOtpScreen from '../screens/Profile/UpdateContactOtpScreen';
import SavedAddressScreen from '../screens/SavedAddress/SavedAddressScreen';
import AddLocationScreen from '../screens/AddLocation/AddLocationScreen';
import ReferralScreen from '../screens/Referral/ReferralScreen';
import BCoinScreen from '../screens/BCoin/BCoinScreen';
import ShopWithUsScreen from '../screens/ShopWithUs/ShopWithUsScreen';

const Stack = createNativeStackNavigator();

const KshopeStatusBar = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />
  );
};

const KshopeRoot: React.FC = () => {
  const [sessionState, setSessionState] = useState<'checking' | 'ready' | 'unavailable'>('checking');

  useEffect(() => {
    let cancelled = false;
    ensureKshopeSession()
      .then(ok => {
        if (!cancelled) setSessionState(ok ? 'ready' : 'unavailable');
      })
      .catch(error => {
        logger.error('[KSHOPE] session check failed', error);
        if (!cancelled) setSessionState('unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState === 'checking') {
    return (
      <View style={styles.centered}>
        <KshopeStatusBar />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessionState === 'unavailable') {
    return (
      <>
        <KshopeStatusBar />
        <KshopeUnavailable />
      </>
    );
  }

  return (
    <LoaderContextProvider>
      <KshopeStatusBar />
      <AlertProvider>
        <UserProvider>
          <WishlistProvider>
            <CartProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="KshopeHome" component={KshopeTabs} />
                <Stack.Screen name="KshopeSearch" component={SearchScreen} />
                <Stack.Screen name="KshopeCategory" component={CategoryScreen} />
                <Stack.Screen name="KshopeProductDetails" component={ProductDetailsScreen} />
                <Stack.Screen name="KshopeProductCategoryDetail" component={ProductCategoryDetailScreen} />
                <Stack.Screen name="KshopeCart" component={CartScreen} />
                <Stack.Screen name="KshopeOrderSuccess" component={OrderSuccessScreen} />
                <Stack.Screen name="KshopeOrderFailed" component={OrderFailedScreen} />
                <Stack.Screen name="KshopeOrderPending" component={OrderPendingScreen} />
                <Stack.Screen name="KshopeMyOrders" component={MyOrderScreen} />
                <Stack.Screen name="KshopeMyOrderDetails" component={MyOrderDetailsScreen} />
                <Stack.Screen name="KshopeProfile" component={ProfileScreen} />
                <Stack.Screen name="KshopeEditProfile" component={EditProfileScreen} />
                <Stack.Screen name="KshopeUpdateContact" component={UpdateContactScreen} />
                <Stack.Screen name="KshopeUpdateContactOtp" component={UpdateContactOtpScreen} />
                <Stack.Screen name="KshopeSavedAddress" component={SavedAddressScreen} />
                <Stack.Screen name="KshopeAddLocation" component={AddLocationScreen} />
                <Stack.Screen name="KshopeReferral" component={ReferralScreen} />
                <Stack.Screen name="KshopeBCoin" component={BCoinScreen} />
                <Stack.Screen name="KshopeShopWithUs" component={ShopWithUsScreen} />
              </Stack.Navigator>
            </CartProvider>
          </WishlistProvider>
        </UserProvider>
      </AlertProvider>
    </LoaderContextProvider>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
});

export default KshopeRoot;
