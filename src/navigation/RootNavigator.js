import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../screens/CartScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddLocationScreen from '../screens/AddLocationScreen'
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen'

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
            <Stack.Screen name="OrderTrackingScreen" component={OrderTrackingScreen} />
            {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
}
