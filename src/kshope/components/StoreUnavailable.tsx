import React from 'react';
import { View, Text } from 'react-native';

const StoreUnavailable = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Store is currently unavailable in your area.</Text>
    </View>
);
export default StoreUnavailable;
