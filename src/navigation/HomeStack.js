import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import lazyScreen from './lazyScreen';

// HomeScreen is the initial route, so it is required eagerly — deferring it
// would only move the same work a few microseconds later. Profile and MyOrders
// are deferred until first navigation. LocationFetchingScreen, CartScreen,
// ProductDetailsScreen and LoginScreen used to be imported here but were never
// rendered by this navigator; their module bodies ran at startup for nothing.
import HomeScreen from '../screens/home/HomeScreen';

const ProfileScreen = lazyScreen(() =>
  require('../screens/ProfileScreen/ProfileScreen'),
);
const MyOrdersScreen = lazyScreen(() => require('../screens/MyOrdersScreen'));

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false };

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
    </Stack.Navigator>
  );
}
