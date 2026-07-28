// Navigation entry point for the 48hrs Deals module.
//
// The module's providers are mounted here rather than in App.tsx on purpose:
// this module talks to a different backend with a different session, so its
// user/wishlist state must not leak into the host app's tree.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from '../context/UserContext';
import { WishlistProvider } from '../context/WishlistContext';
import KshopeScreen from '../screens/Kshope/KshopeScreen';
import NotYetPortedScreen from '../screens/NotYetPortedScreen';
import { DEALS48_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

// Registered so they resolve within this module instead of falling through to
// the host's same-named screens. Swap each for the real screen as it is ported.
const PENDING_ROUTES = [
  DEALS48_ROUTES.SEARCH,
  DEALS48_ROUTES.PRODUCT_DETAILS,
  DEALS48_ROUTES.PRODUCT_CATEGORY,
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
        {PENDING_ROUTES.map(name => (
          <Stack.Screen key={name} name={name} component={NotYetPortedScreen} />
        ))}
      </Stack.Navigator>
    </WishlistProvider>
  </UserProvider>
);

export default Deals48Stack;
