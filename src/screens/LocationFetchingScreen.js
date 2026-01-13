import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../styles/typography';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function LocationFetchingScreen({ navigation }) {

    useEffect(() => {
        // Simulate location fetch
        setTimeout(() => {
            navigation.replace("MainTabs");
        }, 3000);
    }, []);

    return (
        <SafeAreaView style={styles.maninContainer}>
            <ImageBackground style={styles.backgroundImage} resizeMode="cover" source={require('../assets/images/location-background.png')}>
                <Image resizeMode="contain" source={require('../assets/images/location-fetching-icon.png')} />
                <View style={styles.innerContainer}>
                    <Text style={styles.yourlocationText}>Your location</Text>
                    <Text style={styles.addressText}>Vennala : Chakkaparambu</Text>
                    <Text style={[styles.addressText, {
                        marginTop: hp('0.5%')
                    }]}>Kerala pin : 654339</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    maninContainer: {
        flex: 1
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        alignItems: 'center'
    },
    yourlocationText: {
        color: '#F25000',
        fontFamily: FONTS.poppins.extraBold,
        fontSize: wp('4%'),
        marginTop: hp('5%'),
        marginBottom: hp('1.5%')
    },
    addressText: {
        color: '#4D4D4D',
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%')
    }
})
