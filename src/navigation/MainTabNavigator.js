import React, { useState, useMemo, useCallback, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import lazyScreen from './lazyScreen';
import icons from '../assets/icons';
import { FONTS } from '../styles/typography';
import { AppContext } from '../context/appContext';
import Toast from 'react-native-simple-toast';
import ServiceSwitcherModal from '../components/ServiceSwitcherModal';
import AnimatedTabBar from '../components/AnimatedTabBar';

const CategoriesScreen = lazyScreen(() =>
  require('../screens/CategoriesScreen'),
);
const WishlistScreen = lazyScreen(() => require('../screens/WishlistScreen'));
const KshopeScreen = lazyScreen(() => require('../kshope'));

const Tab = createBottomTabNavigator();

const STORE_ICON = require('../assets/icons/OBJECTS.png');

const renderHomeIcon = ({ focused }) => (
  <Image
    source={focused ? icons.homeFilled : icons.home}
    style={[styles.iconImage, focused ? styles.iconActive : styles.iconMuted]}
  />
);
const renderCategoriesIcon = ({ focused }) => (
  <Image
    source={focused ? icons.catFilld : icons.cat}
    style={[styles.iconImage, focused ? styles.iconActive : styles.iconMuted]}
  />
);
const renderWishlistIcon = ({ focused }) => (
  <Image
    source={focused ? icons.heartFilled : icons.heart}
    style={[
      styles.wishlistIconImage,
      focused ? styles.iconActive : styles.iconMuted,
    ]}
  />
);
const renderStoreIcon = ({ focused }) => (
  <Image
    source={STORE_ICON}
    style={[styles.iconStoreImage, focused ? styles.storeIconActive : null]}
  />
);

const renderHomeLabel = () => <Text style={styles.iconLabel}>Home</Text>;
const renderCategoriesLabel = () => (
  <Text style={styles.iconLabel}>Grocery & more</Text>
);
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
const KSHOPE_OPTIONS = {
  headerShown: false,
  tabBarIcon: renderStoreIcon,
  tabBarLabel: renderStoreLabel,
};

const homeListeners = ({ navigation }) => ({
  tabPress: e => {
    e.preventDefault();
    navigation.navigate('Home', { screen: 'HomeScreen' });
  },
});

const renderTabBar = props => <AnimatedTabBar {...props} />;

export default function MainTabNavigator() {
  const { isStoreUnavailable } = useContext(AppContext);
  const [isServiceSwitcherVisible, setIsServiceSwitcherVisible] =
    useState(false);

  const insets = useSafeAreaInsets();

  const screenOptions = useMemo(
    () => ({
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#000000ff',
      tabBarInactiveTintColor: null,
      freezeOnBlur: true,
      tabBarStyle: {
        height:
          Platform.OS === 'android' ? hp('7%') + insets.bottom : hp('8%'),
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

  const storeUnavailableListeners = useMemo(
    () => ({
      tabPress: e => {
        if (isStoreUnavailable) {
          e.preventDefault();
          Toast.show(
            'Store is currently unavailable in your location',
            Toast.SHORT,
          );
        }
      },
    }),
    [isStoreUnavailable],
  );

  const kshopeListeners = useMemo(
    () => ({
      tabPress: e => {
        e.preventDefault();
        setIsServiceSwitcherVisible(true);
      },
    }),
    [],
  );

  const closeServiceSwitcher = useCallback(
    () => setIsServiceSwitcherVisible(false),
    [],
  );

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={renderTabBar}
        screenOptions={screenOptions}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          listeners={homeListeners}
          options={HOME_OPTIONS}
        />

        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          listeners={storeUnavailableListeners}
          options={CATEGORIES_OPTIONS}
        />

        {}
        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          listeners={storeUnavailableListeners}
          options={WISHLIST_OPTIONS}
        />

        <Tab.Screen
          name="Kshope"
          component={KshopeScreen}
          listeners={kshopeListeners}
          options={KSHOPE_OPTIONS}
        />
      </Tab.Navigator>

      <ServiceSwitcherModal
        visible={isServiceSwitcherVisible}
        onClose={closeServiceSwitcher}
        excludeServiceId="quickDelivery"
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: hp('8%'),
    backgroundColor: '#FFFFFF',
    paddingTop: hp('0.2%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    paddingRight: wp('11%'),
  },
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
