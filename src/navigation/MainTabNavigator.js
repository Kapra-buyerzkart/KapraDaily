import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import KshopeScreen from '../screens/KshopeScreen';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import { FONTS } from '../styles/typography'
import { useContext } from 'react';
import { AppContext } from '../context/appContext';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-simple-toast';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { isStoreUnavailable } = useContext(AppContext);
    const { showStatus } = useCart();

    const KshopeButton = ({ onPress }) => {
        const handleComingSoon = () => {
            if (isStoreUnavailable) {
                Toast.show('Store is currently unavailable in your location', Toast.SHORT);
                return;
            }
            showStatus({
                type: 'orange',
                title: 'Coming Soon!',
                message: "We're working hard to bring you K-shope. Stay tuned for a premium shopping experience!"
            });
        };

        return (
            <TouchableOpacity style={styles.KshopeButton} onPress={handleComingSoon}>
                <Image source={require("../assets/images/kshope.png")} style={{
                    width: wp("19.53%"),
                    height: hp("3%"),
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

                // 🔶 icon active color
                // tabBarActiveTintColor: "#F25000",
                tabBarActiveTintColor: "#F25000",

                // 🔶 icon inactive color = null (keeps original PNG color)
                tabBarInactiveTintColor: null,

                tabBarStyle: {
                    // height: hp("8%") + insets.bottom,
                    height: Platform.OS === "android" ? hp("7%") + insets.bottom : hp("8%"),
                    backgroundColor: "#FFFFFF",
                    paddingTop: hp("0.2%"),
                    // paddingBottom: hp("1%"),
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 6,
                    paddingRight: wp("11%"),
                },
                // tabBarLabelStyle: {
                //     fontSize: wp("2.8%"),
                //     color: "#8E8E8E" // 🔶 Keeps label same for active & inactive
                // }
            }}
        >

            {/* ---------------- HOME ---------------- */}
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
                        <Text style={styles.iconLabel}>Categories</Text>
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
        fontSize: wp("2.8%"),
        color: "#8E8E8E",
        marginTop: hp("0.2%"),
        fontFamily: FONTS.inter.regular
    },
    KshopeButton: {
        width: wp("28.84%"),
        height: hp("5.26"),
        backgroundColor: "#990EE2",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("0.3%")
    },
    KshopeButtonText: {
        fontSize: wp("5.3%"),
        fontFamily: FONTS.italiana.regular,
        color: "#000000"
    }
})
