import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import BallPulse from './BallPulse';

const LoaderComponent = ({ visible }) => {
    return (
        <Modal transparent={true} animationType="none" visible={visible}>
            <View style={styles.container}>
                <BallPulse size="large" color="#F25000" />
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
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
