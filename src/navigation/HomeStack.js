import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import lazyScreen from './lazyScreen';

import HomeScreen from '../screens/home/HomeScreen';

const ProfileScreen = lazyScreen(() =>
  require('../screens/ProfileScreen/ProfileScreen'),
);
const MyOrdersScreen = lazyScreen(() => require('../screens/MyOrdersScreen'));

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = { headerShown: false, freezeOnBlur: true };

const PROFILE_OPTIONS = {
  animation: 'slide_from_right',
  animationDuration: 280,
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={PROFILE_OPTIONS}
      />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
    </Stack.Navigator>
  );
}
