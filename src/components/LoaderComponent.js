// components/Loader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const LoaderComponent = ({ visible }) => {
    return (
        <Modal transparent={true} animationType="none" visible={visible}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#F25000" />
            </View>
        </Modal>
    );
};

export default LoaderComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent backdrop
    },
});
