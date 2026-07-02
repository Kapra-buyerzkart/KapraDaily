import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import KshopeScreen from '../screens/KshopeScreen';
import { Image, Platform, StyleSheet, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeStack from './HomeStack';
import icons from '../assets/icons';
import { FONTS } from '../styles/typography';
import { useContext } from 'react';
import { AppContext } from '../context/appContext';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import ServiceSwitcherModal from '../components/ServiceSwitcherModal';
import AnimatedTabBar from '../components/AnimatedTabBar';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { isStoreUnavailable } = useContext(AppContext);
  const navigation = useNavigation();
  const [isServiceSwitcherVisible, setIsServiceSwitcherVisible] =
    useState(false);

  const insets = useSafeAreaInsets();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        // Custom tab bar swaps in the animated, scroll-aware bar below.
        // Tab.Screen options (tabBarIcon/tabBarLabel) and listeners
        // (tabPress) are untouched and still drive AnimatedTabBar's
        // rendering/press behavior via `descriptors` — see AnimatedTabBar.js.
        tabBar={props => <AnimatedTabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#000000ff',
          tabBarInactiveTintColor: null,

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

            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? icons.homeFilled : icons.home}
                style={[
                  styles.iconImage,
                  { tintColor: focused ? '#000000ff' : '#8E8E8E' },
                ]}
              />
            ),

            tabBarLabel: () => <Text style={styles.iconLabel}>Home</Text>,
          }}
        />

        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          listeners={{
            tabPress: e => {
              if (isStoreUnavailable) {
                e.preventDefault();
                Toast.show(
                  'Store is currently unavailable in your location',
                  Toast.SHORT,
                );
              }
            },
          }}
          options={{
            headerShown: false,

            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? icons.catFilld : icons.cat}
                style={[
                  styles.iconImage,
                  { tintColor: focused ? '#000000ff' : '#8E8E8E' },
                ]}
              />
            ),

            tabBarLabel: () => (
              <Text style={styles.iconLabel}>Grocery & more</Text>
            ),
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
                Toast.show(
                  'Store is currently unavailable in your location',
                  Toast.SHORT,
                );
              }
            },
          }}
          options={{
            headerShown: false,

            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? icons.heartFilled : icons.heart}
                style={{
                  height: wp('5.4%'),
                  width: wp('5.4%'),
                  tintColor: focused ? '#000000ff' : '#8E8E8E',
                  resizeMode: 'contain',
                }}
              />
            ),

            tabBarLabel: () => <Text style={styles.iconLabel}>Wishlist</Text>,
          }}
        />

        <Tab.Screen
          name="Kshope"
          component={KshopeScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setIsServiceSwitcherVisible(true);
            },
          }}
          options={{
            headerShown: false,

            tabBarIcon: ({ focused }) => (
              <Image
                source={require('../assets/icons/OBJECTS.png')}
                style={[
                  styles.iconStoreImage,
                  { tintColor: focused ? '#F25000' : null },
                ]}
              />
            ),

            tabBarLabel: () => (
              <Text style={styles.iconLabel}>Switch Store</Text>
            ),
          }}
        />
      </Tab.Navigator>

      <ServiceSwitcherModal
        visible={isServiceSwitcherVisible}
        onClose={() => setIsServiceSwitcherVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: hp('8%'),
    backgroundColor: '#FFFFFF',
    paddingTop: hp('0.2%'),
    // paddingBottom: hp("1%"),
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
