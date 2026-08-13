import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from '../context/UserContext';
import { WishlistProvider } from '../context/WishlistContext';
import KshopeScreen from '../screens/Kshope/KshopeScreen';
import ProductCategoryDetail from '../screens/ProductCategoryDetail/ProductCategoryDetail';
import NotYetPortedScreen from '../screens/NotYetPortedScreen';
import { DEALS48_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const PENDING_ROUTES = [
  DEALS48_ROUTES.SEARCH,
  DEALS48_ROUTES.PRODUCT_DETAILS,
  DEALS48_ROUTES.CART,
  DEALS48_ROUTES.PROFILE,
];

const Deals48Stack: React.FC = () => (
  <UserProvider>
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
        {PENDING_ROUTES.map(name => (
          <Stack.Screen key={name} name={name} component={NotYetPortedScreen} />
        ))}
      </Stack.Navigator>
    </WishlistProvider>
  </UserProvider>
);

export default Deals48Stack;
