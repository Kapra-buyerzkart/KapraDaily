import React, { createContext, useState, useCallback } from 'react';
import { Dimensions, Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
// import colours from '../globals/colours';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

export const LoaderContext = createContext();

export const LoaderContextProvider = React.memo(({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = useCallback((show) => {
        setLoading(show);
    }, []);

    const value = { showLoader, loading };

    return (
        <>
            <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
            {/* {loading && (
                <Modal
                    transparent
                    visible={loading}
                    animationType="fade"
                    onRequestClose={() => setLoading(false)}
                >
                    <View style={styles.overlay} accessible accessibilityRole="progressbar">
                        <LottieView
                            source={require('../assets/Lottie/CartLoader1.json')}
                            style={styles.lottie}
                            autoPlay
                            loop
                        />
                        Fallback option
                        <View style={styles.indicatorBox}>
              <ActivityIndicator size="large" color={colours.primaryColor} />
            </View>
                    </View>
                </Modal>
            )} */}
        </>
    );
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,.7)',
    },
    lottie: {
        height: windowWidth * 0.4,
        width: windowWidth * 0.4,
    },
    indicatorBox: {
        // backgroundColor: colours.primaryWhite,
        borderRadius: 5,
        padding: 10,
        elevation: 5,
    },
});
