import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AppContext } from '../context/appContext';
import ComingSoonModal from '../components/ComingSoonModal';

const { width } = Dimensions.get('window');

const AuthSuccessScreen = ({ navigation }) => {
    const { generalSettings } = useContext(AppContext);
    const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);

    const handleKapra = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    const handleComingSoon = () => {
        setIsComingSoonVisible(true);
    };

    const handleKshope = () => {
        const isKshopeEnabled = generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;

        if (isKshopeEnabled) {
            const storeUrl = Platform.OS === 'ios' 
                ? (generalSettings?.kshope_ios_url || 'https://apps.apple.com/in/app/uden-deal/id6448085736') 
                : (generalSettings?.kshope_android_url || 'https://play.google.com/store/apps/details?id=com.kshope');
            
            Linking.openURL(storeUrl).catch(err => {
                console.error('Failed to open store URL:', err);
                handleComingSoon();
            });
        } else {
            handleComingSoon();
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/splash/header.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Deal Cards Section */}
                <View style={styles.cardsContainer}>
                    {/* 20 mins deal - Large Card (Kapra) */}
                    <TouchableOpacity activeOpacity={0.9} onPress={handleKapra}>
                        <Image
                            source={require('../assets/splashsvg/udendeal.png')}
                            style={styles.largeCard}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Small Cards Row */}
                    {/* <View style={styles.row}> */}
                        {/* 48 hrs deal (K-Shope) */}
                        <TouchableOpacity activeOpacity={0.9} onPress={handleKshope}>
                            <Image
                                source={require('../assets/splashsvg/48hrs.png')}
                                style={styles.largeCard}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        {/* Uden Tickets */}
                        <TouchableOpacity activeOpacity={0.9} onPress={handleComingSoon}>
                            <Image
                                source={require('../assets/splashsvg/udentickets.png')}
                                style={styles.largeCard}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    {/* </View> */}
                </View>
            </ScrollView>

            {/* Bottom Section (Skyline) */}
            <View style={styles.bottomSection}>
                <Image
                    source={require('../assets/images/splash/Vancouver.png')}
                    style={styles.skylineImage}
                    resizeMode="stretch"
                />
            </View>

            {/* Custom Coming Soon Popup */}
            <ComingSoonModal
                visible={isComingSoonVisible}
                onClose={() => setIsComingSoonVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: hp('10%'),
      //  paddingBottom: hp('15%'), // Increased padding to avoid overlap with skyline
    },
    logoContainer: {
        marginBottom: hp('2%'),
    },
    logo: {
        width: wp('70%'),
        height: hp('20%'),
    },
    cardsContainer: {
        width: wp('90%'),
        alignItems: 'center',
        marginTop: hp('2%'),
    },
    largeCard: {
        width: wp('90%'),
        height: hp('28%'),
        marginTop: -hp('10%'),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('90%'), // Match width of the large card
        marginTop: -hp('8%'),
    },
    smallCard: {
        width: wp('44.5%'), // Slightly larger to create a small gap in a 90% row
        height: hp('22%'),
      //  backgroundColor:'red'
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    skylineImage: {
        width: '100%',
        height: hp('10%'),
    }
});

export default AuthSuccessScreen;
