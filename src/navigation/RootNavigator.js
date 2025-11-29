import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </Stack.Navigator>
    );
}
