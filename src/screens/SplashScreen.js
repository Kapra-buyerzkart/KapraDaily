// AnimatedSplash.js
import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('LocationFetching');
        }, 3000); // duration of gif

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <FastImage
                source={require('../assets/images/splash/splash.png')}
                style={styles.gif}
                resizeMode={FastImage.resizeMode.contain}
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
