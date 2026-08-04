// AnimatedSplash.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { prefetchLandingPages } from '../hooks/useLandingPages';

const SplashScreen = ({ navigation }) => {
    // Use the splash dwell time to fetch + decode the landing artwork, so
    // AuthSuccessScreen paints its API images immediately when it mounts.
    useEffect(() => {
        prefetchLandingPages();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('LocationFetching');
        }, 3000); // duration of gif

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/splash/splash.png')}
                style={styles.gif}
                resizeMode="contain"
            />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gif: {
        width: wp('100%'),
        height: hp('100%'),
    },
});
