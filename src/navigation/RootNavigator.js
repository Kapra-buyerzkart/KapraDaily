import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../screens/CartScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddLocationScreen from '../screens/AddLocationScreen'
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen'
import LoginScreen from '../screens/LoginScreen'
import RegistraionScreen from '../screens/RegistrationScreen'
import OtpScreen from '../screens/OtpScreen'
import ChangePwdScreen from '../screens/ChangePwdScreen'
import BCoinScreen from '../screens/BCoinScreen'
import SearchScreen from '../screens/SearchScreen'
import OrderSuccessScreen from '../screens/OrderSuccessScreen'
import SplashScreen from '../screens/SplashScreen'
import LoginPwdScreen from '../screens/LoginPwdScreen'
import SavedAddressScreen from '../screens/SavedAddressScreen'
import ReferralScreen from '../screens/ReferralScreen'

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
            {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
            <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
            <Stack.Screen name="OrderTrackingScreen" component={OrderTrackingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} />
            <Stack.Screen name="RegistraionScreen" component={RegistraionScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
            <Stack.Screen name="BCoinScreen" component={BCoinScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
            <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
            <Stack.Screen name='SavedAddressScreen' component={SavedAddressScreen} />
            <Stack.Screen name='ReferralScreen' component={ReferralScreen} />
        </Stack.Navigator>
    );
}
