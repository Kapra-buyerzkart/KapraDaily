import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from '../context/UserContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
import KshopeScreen from '../screens/Kshope/KshopeScreen';
import ProductCategoryDetail from '../screens/ProductCategoryDetail/ProductCategoryDetail';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import ProductDetails from '../screens/Product/ProductDetails';
import CartScreen from '../screens/Cart/CartScreen';
import AddLocationScreen from '../screens/AddLocation';
import OrderSuccessScreen from '../screens/Order/OrderSuccessScreen';
import OrderFailedScreen from '../screens/Order/OrderFailedScreen';
import OrderPendingScreen from '../screens/Order/OrderPendingScreen';
import MyOrder from '../screens/Order/MyOrder';
import MyOrderDetails from '../screens/Order/MyOrderDetails';
import NotYetPortedScreen from '../screens/NotYetPortedScreen';
import { DEALS48_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const Deals48Stack: React.FC = () => (
  <UserProvider>
    <CartProvider>
      <WishlistProvider>
        <Stack.Navigator
          initialRouteName={DEALS48_ROUTES.HOME}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name={DEALS48_ROUTES.HOME} component={KshopeScreen} />
          <Stack.Screen
            name={DEALS48_ROUTES.PRODUCT_CATEGORY}
            component={ProductCategoryDetail}
          />
          <Stack.Screen name={DEALS48_ROUTES.SEARCH} component={SearchScreen} />
          <Stack.Screen
            name={DEALS48_ROUTES.PRODUCT_DETAILS}
            component={ProductDetails}
          />
          <Stack.Screen name={DEALS48_ROUTES.CART} component={CartScreen} />
          <Stack.Screen
            name={DEALS48_ROUTES.ADD_LOCATION}
            component={AddLocationScreen}
          />
          <Stack.Screen
            name={DEALS48_ROUTES.ORDER_SUCCESS}
            component={OrderSuccessScreen}
          />
          <Stack.Screen
            name={DEALS48_ROUTES.ORDER_FAILED}
            component={OrderFailedScreen}
          />
          <Stack.Screen
            name={DEALS48_ROUTES.ORDER_PENDING}
            component={OrderPendingScreen}
          />
          <Stack.Screen name={DEALS48_ROUTES.MY_ORDERS} component={MyOrder} />
          <Stack.Screen
            name={DEALS48_ROUTES.MY_ORDER_DETAILS}
            component={MyOrderDetails}
          />
          <Stack.Screen
            name={DEALS48_ROUTES.PROFILE}
            component={NotYetPortedScreen}
          />
        </Stack.Navigator>
      </WishlistProvider>
    </CartProvider>
  </UserProvider>
);

export default Deals48Stack;
