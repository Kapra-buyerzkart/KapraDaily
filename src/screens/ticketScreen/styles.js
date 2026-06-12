import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0415',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgCircle: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    bgCircle1: {
        width: width * 0.8,
        height: width * 0.8,
        top: height * 0.2,
        left: -width * 0.1,
    },
    bgCircle2: {
        width: width * 0.6,
        height: width * 0.6,
        bottom: height * 0.15,
        right: -width * 0.1,
    },
    logoContainer: {
        alignItems: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: wp('55%'),
        height: hp('12%'),
    },
    tagline: {
        fontSize: wp('4%'),
        color: '#A78BFA',
        fontFamily: 'Poppins-Medium',
        marginTop: hp('1%'),
        letterSpacing: 2,
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: hp('12%'),
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B5CF6',
    },
    fadeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
    },
});

export const landingStyles = StyleSheet.create({});
