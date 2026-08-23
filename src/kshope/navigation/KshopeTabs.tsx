import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colours';
import HomeScreen from '../screens/Home/HomeScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import CategoryScreen from '../screens/Category/CategoryScreen';

const Tab = createBottomTabNavigator();

const KshopePlaceholderScreen: React.FC = () => <View style={styles.placeholder} />;

const KshopeTabs: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 74, paddingHorizontal: 10, paddingRight: 20 },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarIcon: ({ focused }) => {
                    let iconSource;

                    if (route.name === 'HomeScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/homeicon.png') : require('../assets/images/bottomtab/homee.png');
                    } else if (route.name === 'CategoryScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/cat_fil.png') : require('../assets/images/bottomtab/category.png');
                    } else if (route.name === 'WishlistScreen') {
                        iconSource = focused ? require('../assets/images/bottomtab/wishlist_fil.png') : require('../assets/images/bottomtab/wishlistt.png');
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Image source={iconSource} style={focused ? styles.normalIcon : styles.unselectedIcon} resizeMode="contain" />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="CategoryScreen" component={CategoryScreen} />
            <Tab.Screen name="WishlistScreen" component={WishlistScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    placeholder: { flex: 1, backgroundColor: colors.background },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 60,
        marginTop: 20,
    },
    normalIcon: {
        width: 35,
        height: 35,
        marginTop: 20,
    },
    unselectedIcon: {
        width: 35,
        height: 35,
        marginTop: 20,
    },
});

export default KshopeTabs;
