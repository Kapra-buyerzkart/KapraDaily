import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from '../context/appContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {

    const { loadProfileTwo, profile, loadProfile, isUpdateModalVisible, setIsUpdateModalVisible, updateInfo } = useContext(AppContext);

    useEffect(() => {
        loadProfile();
    }, []);

    if (!profile) {
        return null; // or splash loader
    }

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {
}
