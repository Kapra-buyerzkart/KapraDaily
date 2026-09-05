import React, { useCallback, useMemo, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getTabBarHeight } from './tabBarHeight';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '../../assets/icons';
import { FONTS } from '../../styles/typography';
import AnimatedTabBar from '../../components/AnimatedTabBar';
import ServiceSwitcherModal from '../../components/ServiceSwitcherModal';
import { colors } from '../theme/colours';
import HomeScreen from '../screens/Home/redesign/HomeRedesignScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import CategoryScreen from '../screens/Category/redesign/CategoryRedesignScreen';

const Tab = createBottomTabNavigator();

const STORE_ICON = require('../../assets/icons/OBJECTS.png');

const KshopePlaceholderScreen: React.FC = () => <View style={styles.placeholder} />;

const renderHomeIcon = ({ focused }: { focused: boolean }) => (
    <Image
        source={focused ? icons.homeFilled : icons.home}
        style={[styles.iconImage, focused ? styles.iconActive : styles.iconMuted]}
    />
);
const renderCategoriesIcon = ({ focused }: { focused: boolean }) => (
    <Image
        source={focused ? icons.catFilld : icons.cat}
        style={[styles.iconImage, focused ? styles.iconActive : styles.iconMuted]}
    />
);
const renderWishlistIcon = ({ focused }: { focused: boolean }) => (
    <Image
        source={focused ? icons.heartFilled : icons.heart}
        style={[
            styles.wishlistIconImage,
            focused ? styles.iconActive : styles.iconMuted,
        ]}
    />
);
const renderStoreIcon = ({ focused }: { focused: boolean }) => (
    <Image
        source={STORE_ICON}
        style={[styles.iconStoreImage, focused ? styles.storeIconActive : null]}
    />
);

const renderHomeLabel = () => <Text style={styles.iconLabel}>Home</Text>;
const renderCategoriesLabel = () => <Text style={styles.iconLabel}>Category</Text>;
const renderWishlistLabel = () => <Text style={styles.iconLabel}>Wishlist</Text>;
const renderStoreLabel = () => <Text style={styles.iconLabel}>Switch Store</Text>;

const HOME_OPTIONS = {
    headerShown: false,
    tabBarIcon: renderHomeIcon,
    tabBarLabel: renderHomeLabel,
};
const CATEGORIES_OPTIONS = {
    headerShown: false,
    tabBarIcon: renderCategoriesIcon,
    tabBarLabel: renderCategoriesLabel,
};
const WISHLIST_OPTIONS = {
    headerShown: false,
    tabBarIcon: renderWishlistIcon,
    tabBarLabel: renderWishlistLabel,
};
const SWITCH_STORE_OPTIONS = {
    headerShown: false,
    tabBarAccessibilityLabel: 'Switch store',
    tabBarIcon: renderStoreIcon,
    tabBarLabel: renderStoreLabel,
};

const renderTabBar = (props: any) => <AnimatedTabBar {...props} />;

const KshopeTabs: React.FC = () => {
    const [isServiceSwitcherVisible, setIsServiceSwitcherVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#000000ff',
            tabBarInactiveTintColor: undefined,
            freezeOnBlur: true,
            tabBarStyle: {
                height: getTabBarHeight(insets.bottom),
                backgroundColor: '#FFFFFF',
                paddingTop: hp('0.2%'),
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 6,
            },
        }),
        [insets.bottom],
    );

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
            <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
                <Tab.Screen name="HomeScreen" component={HomeScreen} options={HOME_OPTIONS} />
                <Tab.Screen name="CategoryScreen" component={CategoryScreen} options={CATEGORIES_OPTIONS} />
                <Tab.Screen name="WishlistScreen" component={WishlistScreen} options={WISHLIST_OPTIONS} />
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
    iconImage: {
        height: wp('5.12%'),
        width: wp('5.12%'),
        resizeMode: 'contain',
    },
    wishlistIconImage: {
        height: wp('5.4%'),
        width: wp('5.4%'),
        resizeMode: 'contain',
    },
    iconActive: {
        tintColor: '#000000ff',
    },
    iconMuted: {
        tintColor: '#8E8E8E',
    },
    storeIconActive: {
        tintColor: '#F25000',
    },
    iconStoreImage: {
        height: wp('8%'),
        width: wp('8%'),
        resizeMode: 'contain',
    },
    iconLabel: {
        fontSize: wp('2.4%'),
        color: '#8E8E8E',
        marginTop: hp('0.2%'),
        fontFamily: FONTS.inter.regular,
        textAlign: 'center',
    },
});

export default KshopeTabs;
