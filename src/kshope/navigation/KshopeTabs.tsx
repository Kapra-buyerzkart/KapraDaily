import React, { useCallback, useMemo, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import ServiceSwitcherModal from '../../components/ServiceSwitcherModal';
import HomeScreen from '../screens/Home/redesign/HomeRedesignScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import CategoryScreen from '../screens/Category/redesign/CategoryRedesignScreen';

const Tab = createBottomTabNavigator();

const STORE_ICON = require('../../assets/icons/OBJECTS.png');

const KshopePlaceholderScreen: React.FC = () => <View style={styles.placeholder} />;

const renderSwitchStoreIcon = () => (
    <View style={styles.switchContainer}>
        <Image source={STORE_ICON} style={styles.switchIcon} resizeMode="contain" />
        <Text style={styles.switchLabel}>Switch Store</Text>
    </View>
);

const SWITCH_STORE_OPTIONS = {
    tabBarAccessibilityLabel: 'Switch store',
    tabBarIcon: renderSwitchStoreIcon,
};

const KshopeTabs: React.FC = () => {
    const [isServiceSwitcherVisible, setIsServiceSwitcherVisible] = useState(false);

    const switchStoreListeners = useMemo(
        () => ({
            tabPress: (e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsServiceSwitcherVisible(true);
            },
        }),
        [],
    );

    const closeServiceSwitcher = useCallback(() => setIsServiceSwitcherVisible(false), []);

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 92, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 8 },
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
                                <Image source={iconSource} style={styles.tabIcon} resizeMode="contain" />
                            </View>
                        );
                    },
                })}
            >
                <Tab.Screen name="HomeScreen" component={HomeScreen} />
                <Tab.Screen name="CategoryScreen" component={CategoryScreen} />
                <Tab.Screen name="WishlistScreen" component={WishlistScreen} />
                <Tab.Screen
                    name="SwitchStore"
                    component={KshopePlaceholderScreen}
                    listeners={switchStoreListeners}
                    options={SWITCH_STORE_OPTIONS}
                />
            </Tab.Navigator>

            <ServiceSwitcherModal
                visible={isServiceSwitcherVisible}
                onClose={closeServiceSwitcher}
                excludeServiceId="partner"
            />
        </>
    );
};

const styles = StyleSheet.create({
    placeholder: { flex: 1, backgroundColor: colors.background },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 52,
    },
    tabIcon: {
        width: 36,
        height: 36,
    },
    switchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 52,
    },
    switchIcon: {
        width: 36,
        height: 36,
    },
    switchLabel: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 9,
        color: colors.themeDarkGray,
        marginTop: 2,
    },
});

export default KshopeTabs;
