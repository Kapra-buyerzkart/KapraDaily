import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import KshopeScreen from '../screens/KshopeScreen';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import { FONTS } from '../styles/typography'
import { useContext } from 'react';
import { AppContext } from '../context/appContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { isStoreUnavailable, generalSettings } = useContext(AppContext);
    const { showStatus } = useCart();

    const KshopeButton = ({ onPress }) => {
        const handleKshopeLink = async () => {
            console.log('[Kshope] Button pressed');
            console.log('[Kshope] isStoreUnavailable:', isStoreUnavailable);

            if (isStoreUnavailable) {
                console.log('[Kshope] Store unavailable — showing toast');
                Toast.show('Store is currently unavailable in your location', Toast.SHORT);
                return;
            }

            const isKshopeEnabled = generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;
            console.log('[Kshope] showkshope value:', generalSettings?.showkshope, '| isKshopeEnabled:', isKshopeEnabled);

            if (isKshopeEnabled) {
                const deepLink = 'udmv://';
                const storeUrl = Platform.OS === 'ios'
                    ? (generalSettings?.kshope_ios_url || 'https://apps.apple.com/in/app/uden-deal/id6448085736')
                    : (generalSettings?.kshope_android_url || 'https://play.google.com/store/apps/details?id=com.kshope');

                try {
                    console.log('[Kshope] Attempting to open deep link:', deepLink);
                    await Linking.openURL(deepLink);
                    console.log('[Kshope] Deep link opened successfully');
                } catch (deepLinkErr) {
                    console.warn('[Kshope] Deep link failed, app not installed. Redirecting to store:', storeUrl);
                    try {
                        await Linking.openURL(storeUrl);
                    } catch (storeErr) {
                        console.error('[Kshope] Store URL also failed:', storeErr);
                        showComingSoon();
                    }
                }
            }
        };

        const showComingSoon = () => {
            showStatus({
                type: 'orange',
                title: 'Coming Soon!',
                message: "We're working hard to bring you K-shope. Stay tuned for a premium shopping experience!"
            });
        };

        return (
            <TouchableOpacity style={styles.KshopeButton} onPress={handleKshopeLink}>
                <Image source={require("../assets/splashsvg/tab48.png")} style={{
                    width: wp("15%"),
                    height: hp("3.6%"),
                    resizeMode: "contain"
                }} />
            </TouchableOpacity>)
    }
    const insets = useSafeAreaInsets();
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#F25000",
                tabBarInactiveTintColor: null,

                tabBarStyle: {
                    height: Platform.OS === "android" ? hp("7%") + insets.bottom : hp("8%"),
                    backgroundColor: "#FFFFFF",
                    paddingTop: hp("0.2%"),
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 6,
                    paddingRight: wp("11%"),
                },
            }}
        >

            <Tab.Screen
                name="Home"
                component={HomeStack}
                listeners={({ navigation }) => ({
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate('Home', {
                            screen: 'HomeScreen',
                        });
                    },
                })}
                options={{
                    headerShown: false,

                    tabBarIcon: ({ focused, color }) => (
                        <Image
                            source={require("../assets/images/home.png")}
                            style={[styles.iconImage, { tintColor: focused ? "#F25000" : null }]}
                        />
                    ),

                    tabBarLabel: () => (
                        <Text style={styles.iconLabel}>Home</Text>
                    )
                }}
            />

            {/* ---------------- CATEGORIES ---------------- */}
            <Tab.Screen
                name="Categories"
                component={CategoriesScreen}
                listeners={{
                    tabPress: e => {
                        if (isStoreUnavailable) {
                            e.preventDefault();
                            Toast.show('Store is currently unavailable in your location', Toast.SHORT);
                        }
                    },
                }}
                options={{
                    headerShown: false,

                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require("../assets/images/grid.png")}
                            style={[styles.iconImage, { tintColor: focused ? "#F25000" : null }]}
                        />
                    ),

                    tabBarLabel: () => (
                        <Text style={styles.iconLabel}>Grocery & more</Text>
                    )
                }}
            />

            {/* ---------------- WISHLIST ---------------- */}
            <Tab.Screen
                name="Wishlist"
                component={WishlistScreen}
                listeners={{
                    tabPress: e => {
                        if (isStoreUnavailable) {
                            e.preventDefault();
                            Toast.show('Store is currently unavailable in your location', Toast.SHORT);
                        }
                    },
                }}
                options={{
                    headerShown: false,

                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={require("../assets/images/heart.png")}
                            style={{
                                height: wp("5.4%"),
                                width: wp("5.4%"),
                                tintColor: focused ? "#F25000" : null,
                                resizeMode: "contain"
                            }}
                        />
                    ),

                    tabBarLabel: () => (
                        <Text style={styles.iconLabel}>Wishlist</Text>
                    )
                }}
            />

            <Tab.Screen
                name="Kshope"
                component={KshopeScreen}
                options={{
                    tabBarButton: (props) => (
                        <KshopeButton onPress={() => { }} />
                    ),
                }} />


        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: hp("8%"),
        backgroundColor: "#FFFFFF",
        paddingTop: hp("0.2%"),
        // paddingBottom: hp("1%"),
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
        paddingRight: wp("11%")
    },
    iconImage: {
        height: wp("5.12%"),
        width: wp("5.12%"),
        resizeMode: "contain"
    },
    iconLabel: {
        fontSize: wp("2.4%"),
        color: "#8E8E8E",
        marginTop: hp("0.2%"),
        fontFamily: FONTS.inter.regular,
        textAlign: 'center',
    },
    KshopeButton: {
        width: wp("18%"),
        height: hp("5%"),
        backgroundColor: "#ffffff",
        borderColor: "#F25000",
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("0.8%"), left: 15
    },
    KshopeButtonText: {
        fontSize: wp("5.3%"),
        fontFamily: FONTS.italiana.regular,
        color: "#000000"
    }
})