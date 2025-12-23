import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import KshopeScreen from '../screens/KshopeScreen';
import { Image, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {

    const KshopeButton = ({ onPress }) => {
        return (
            <TouchableOpacity style={styles.KshopeButton} onPress={onPress}>
                {/* <Text style={styles.KshopeButtonText}>K-shope</Text> */}
                <Image source={require("../assets/images/kshope.png")} style={{
                    width: wp("19.53%"),
                    height: hp("3%"),
                    resizeMode: "contain"
                }}/>
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
                        <KshopeButton onPress={props.onPress} />
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
        fontFamily: "Inter_18pt-Regular"
    },
    KshopeButton: {
        width: wp("28.84%"),
        height: hp("5.26"),
        backgroundColor: "#005CFF",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("0.3%")
    },
    KshopeButtonText: {
        fontSize: wp("5.3%"),
        fontFamily: "Italiana-Regular",
        color: "#000000"
    }
})
