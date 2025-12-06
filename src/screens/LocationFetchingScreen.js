import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function LocationFetchingScreen({ navigation }) {

    useEffect(() => {
        // Simulate location fetch
        setTimeout(() => {
            navigation.replace("MainTabs");
        }, 10);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text>Fetching your location...</Text>
        </View>
    );
}
